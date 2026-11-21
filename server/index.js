import mongoose from 'mongoose';
import { createApp } from './app.js';
import { Appointment, Lead, User } from './models/index.js';
import { bootstrapAdmin } from './auth.js';
import { createMailer } from './mail.js';

const env=process.env;
const local=env.NODE_ENV!=='production';
let embedded;
if(!env.MONGODB_URI){
  if(!local||env.WDB_LOCAL_DB!=='1')throw Error('Set MONGODB_URI or opt in to disposable local storage with WDB_LOCAL_DB=1.');
  const {MongoMemoryServer}=await import('mongodb-memory-server');
  embedded=await MongoMemoryServer.create({binary:{version:'8.0.17'}});
}
if(!local&&(!env.JWT_SECRET||env.JWT_SECRET.length<32))throw Error('JWT_SECRET must contain at least 32 characters.');
if(!local&&!env.CORS_ORIGINS)throw Error('Set CORS_ORIGINS to the public frontend origin.');
await mongoose.connect(env.MONGODB_URI||embedded.getUri(),{serverSelectionTimeoutMS:8000});
await Promise.all([Appointment.init(),Lead.init(),User.init()]);
await Promise.all([Appointment.createIndexes(),User.createIndexes()]);
await bootstrapAdmin({email:env.ADMIN_EMAIL,password:env.ADMIN_PASSWORD});
const app=createApp({
  origins:(env.CORS_ORIGINS||'http://localhost:3000,http://127.0.0.1:3000').split(',').map(s=>s.trim()).filter(Boolean),
  jwtSecret:env.JWT_SECRET,secureCookie:!local,trustProxy:env.TRUST_PROXY_HOPS?Number(env.TRUST_PROXY_HOPS):false,
  mailer:createMailer({host:env.SMTP_HOST,port:Number(env.SMTP_PORT),secure:env.SMTP_SECURE==='true',user:env.SMTP_USER,pass:env.SMTP_PASS,from:env.SMTP_FROM,admin:env.NOTIFY_EMAIL||env.ADMIN_EMAIL}),
});
const server=app.listen(Number(env.PORT||4000),env.HOST||'0.0.0.0',()=>console.log('WDB API ready on port '+server.address().port));
async function shutdown(){server.close();await mongoose.disconnect();await embedded?.stop();}
process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
