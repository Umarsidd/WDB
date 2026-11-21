import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { Lead, Appointment } from './models/index.js';
import { adminAuth } from './auth.js';
import { appointmentSchema, appointmentUpdate, enquirySchema, leadUpdate, loginSchema } from './validation.js';
import { slots } from '../data/site.js';
import { services } from '../data/services.js';
import { findPackage } from '../data/packages.js';
import { readCart, estimate } from '../lib/cart.js';
import { bookableDate, upcomingSlot } from '../lib/booking.js';

const states={leads:['new','contacted','won'],appointments:['pending','confirmed','completed','cancelled']};
const escapeRegExp=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function validated(schema){return(req,res,next)=>{
  const parsed=schema.safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:parsed.error.issues[0].message,issues:parsed.error.issues.map(x=>({field:x.path[0],message:x.message}))});
  req.valid=parsed.data;next();
};}
function limit(max,minutes){return rateLimit({windowMs:minutes*60000,limit:max,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many requests. Please try again later.'}});}
function intake(data){
  const {website:_bot,cart,...fields}=data;
  const selection=readCart(cart);
  return {...fields,service:services.find(s=>s.slug===fields.category)?.form||services.find(s=>s.slug===fields.category)?.name||'Other',
    packageName:findPackage(fields.category,fields.package)?.name||'',estimate:estimate(selection),
    cart:selection.map(line=>{const {name,amount,billing,unit,startsAt}=findPackage(line.category,line.slug);return {...line,name,amount,billing,unit,startsAt};})};
}
const csvValue = value => {
  const v=String(value??'');
  // Prevent cells originating from form submissions becoming spreadsheet formulas.
  return '"'+(/^[\s]*[=+\-@]|^[\t\r\n]/.test(v)?"'":'')+v.replaceAll('"','""')+'"';
};
const csvFields={leads:['name','phone','email','service','packageName','budget','message','cart','estimate','status','notes','createdAt'],appointments:['id','name','phone','email','service','packageName','business','budget','message','cart','estimate','type','date','slot','status','notes','createdAt']};
function filters(query,kind){
  const filter={};
  if(states[kind].includes(query.status))filter.status=query.status;
  if(typeof query.search==='string'&&query.search.trim()){
    const regex=new RegExp(escapeRegExp(query.search.trim().slice(0,100)),'i');
    filter.$or=['name','email','phone','service',...(kind==='appointments'?['id']:[])].map(field=>({[field]:regex}));
  }
  if(kind==='appointments'&&typeof query.month==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(query.month))filter.date={$regex:'^'+query.month+'-'};
  return filter;
}
export function createApp({origins=[],jwtSecret='',secureCookie=false,trustProxy=false,mailer=null}={}){
  const app=express();
  app.disable('x-powered-by');
  app.set('trust proxy',trustProxy);
  app.use(helmet(),cors({origin:(origin,done)=>done(null,!origin||origins.includes(origin)),credentials:true,allowedHeaders:['Content-Type','X-WDB-Request']}));
  app.use('/api',(_req,res,next)=>{res.set('Cache-Control','no-store');next();});
  app.use(express.json({limit:'24kb'}));
  app.get('/api/health',(_req,res)=>{const ready=mongoose.connection.readyState===1;res.status(ready?200:503).json({ready});});
  app.use('/api',(_req,res,next)=>{if(mongoose.connection.readyState!==1)return res.status(503).json({error:'The service is temporarily unavailable. Please try again or contact us on WhatsApp.'});next();});
  app.get('/api/appointments/availability',limit(100,10),async(req,res)=>{
    const date=req.query.date;
    if(!bookableDate(date))return res.json({slots:[]});
    const booked=await Appointment.distinct('slot',{date,active:true});
    res.json({slots:slots.filter(s=>!booked.includes(s.id)&&upcomingSlot(date,s)).map(s=>s.id)});
  });
  const intakeLimit=limit(10,15);
  app.post('/api/enquiry',intakeLimit,validated(enquirySchema),async(req,res)=>{
    const lead=await Lead.create(intake(req.valid));
    if(mailer)await mailer.notify('enquiry',lead);
    res.status(201).json({id:String(lead._id)});
  });
  app.post('/api/appointments',intakeLimit,validated(appointmentSchema),async(req,res)=>{
    const item=await Appointment.create({...intake(req.valid),id:'WDB-'+randomUUID().toUpperCase()});
    const emailed=mailer?await mailer.notify('appointment',item):false;
    res.status(201).json({id:item.id,date:item.date,slot:item.slot,service:item.service,status:item.status,emailed});
  });
  const {requireAdmin,login,logout}=adminAuth(jwtSecret,secureCookie);
  app.use('/api/admin',(req,res,next)=>{
    if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.get('X-WDB-Request')!=='1')return res.status(403).json({error:'This request was blocked.'});
    if(req.get('Origin')&&!origins.includes(req.get('Origin')))return res.status(403).json({error:'This request was blocked.'});
    next();
  });
  app.post('/api/admin/login',limit(8,15),validated(loginSchema),login);
  app.post('/api/admin/logout',logout);
  app.use('/api/admin',requireAdmin);
  app.get('/api/admin/session',async(req,res)=>{
    const user=await mongoose.models.User.findById(req.admin.sub).select('email');
    if(!user)return res.status(401).json({error:'Please sign in to continue.'});
    res.json({email:user.email});
  });
  for(const [kind,Model,update] of [['leads',Lead,leadUpdate],['appointments',Appointment,appointmentUpdate]]){
    app.get('/api/admin/'+kind,async(req,res)=>{
      const filter=filters(req.query,kind);
      const page=Math.max(1,Math.min(10000,Number.parseInt(req.query.page)||1));
      const [rows,total]=await Promise.all([Model.find(filter).sort({createdAt:-1,_id:-1}).skip((page-1)*50).limit(50).lean(),Model.countDocuments(filter)]);
      res.json({rows,total,page});
    });
    app.get('/api/admin/'+kind+'/csv',async(req,res)=>{
      const keys=csvFields[kind];
      res.type('text/csv').attachment('wdb-'+kind+'.csv');
      res.write(keys.join(',')+'\r\n');
      const cursor=Model.find(filters(req.query,kind)).sort({createdAt:-1}).lean().cursor();
      const abort=()=>{void cursor.close().catch(()=>{});};
      res.once('close',abort);
      try{
        for await(const row of cursor){
          if(res.destroyed)break;
          const chunk=keys.map(key=>csvValue(key==='createdAt'?row[key]?.toISOString():['cart','estimate'].includes(key)?JSON.stringify(row[key]||[]):row[key])).join(',')+'\r\n';
          if(!res.write(chunk))await new Promise(resolve=>{
            const resume=()=>{res.off('drain',resume);res.off('close',resume);resolve();};
            res.once('drain',resume);res.once('close',resume);
          });
        }
      }finally{res.off('close',abort);await cursor.close();}
      if(!res.destroyed)res.end();
    });
    app.patch('/api/admin/'+kind+'/:id',validated(update),async(req,res)=>{
      if(!mongoose.isValidObjectId(req.params.id))return res.status(404).json({error:'Record not found.'});
      const item=await Model.findById(req.params.id);
      if(!item)return res.status(404).json({error:'Record not found.'});
      if(kind==='appointments'){
        const date=req.valid.date??item.date,slot=req.valid.slot??item.slot,status=req.valid.status??item.status;
        const changed=date!==item.date||slot!==item.slot;
        if((changed||item.status==='cancelled'&&['pending','confirmed'].includes(status))&&(!bookableDate(date)||!upcomingSlot(date,slots.find(s=>s.id===slot))))return res.status(400).json({error:'Choose a future slot on an available date.'});
        item.active=status!=='cancelled';
      }
      Object.assign(item,req.valid);await item.save();res.json(item);
    });
  }
  app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint not found.'}));
  app.use((err,req,res,next)=>{
    if(res.headersSent){res.destroy();return;}
    if(err?.code===11000)return res.status(409).json({error:'This time slot was just taken. Please choose another.'});
    if(err?.name==='VersionError')return res.status(409).json({error:'This record changed. Refresh before editing again.'});
    if(err?.type==='entity.parse.failed')return res.status(400).json({error:'Invalid JSON body.'});
    if(err?.status===413)return res.status(413).json({error:'Request is too large.'});
    console.error('WDB request failed:',err?.name);
    res.status(500).json({error:'Something went wrong. Please try again.'});
  });
  return app;
}
