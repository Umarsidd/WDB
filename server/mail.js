import nodemailer from 'nodemailer';
import { site, slots } from '../data/site.js';
export function createMailer(config){
  if(!config.host||!config.from||!config.admin)return null;
  const transport=nodemailer.createTransport({
    host:config.host,port:config.port||587,secure:config.secure,
    requireTLS:!config.secure&&config.requireTLS!==false,
    auth:config.user?{user:config.user,pass:config.pass}:undefined,
    connectionTimeout:4500,greetingTimeout:4500,socketTimeout:6000,
  });
  return { async notify(kind,item){
    const appointment=kind==='appointment';
    const info=[
      item.id&&'Booking ID: '+item.id, 'Name: '+item.name,'Service: '+item.service,
      item.packageName&&'Package: '+item.packageName,
      appointment&&'Appointment type: '+item.type,
      appointment&&'Date: '+item.date+' at '+slots.find(s=>s.id===item.slot).label+' (Asia/Kolkata)',
    ].filter(Boolean).join('\n');
    const adminText=[info,'Phone: '+item.phone,'Email: '+item.email,item.business&&'Business: '+item.business,item.budget&&'Budget: '+item.budget,item.message&&'Message: '+item.message,item.cart?.length&&'Quote Cart: '+item.cart.map(p=>p.name+' × '+p.quantity).join(', ')].filter(Boolean).join('\n');
    const tasks=[transport.sendMail({from:config.from,to:config.admin,subject:appointment?'WDB appointment request':'WDB enquiry',text:adminText})];
    if(appointment)tasks.push(transport.sendMail({from:config.from,to:item.email,subject:'Your WDB appointment request',text:info+'\n\nYour request is pending confirmation. For questions, contact '+site.email+'.'}));
    const delivered=await Promise.allSettled(tasks);
    if(delivered.some(result=>result.status==='rejected'))console.warn('WDB email delivery failed. The request remains saved in MongoDB.');
    return delivered.every(result=>result.status==='fulfilled');
  } };
}
