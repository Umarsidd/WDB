import { promisify } from 'node:util';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { User } from './models/index.js';
const derive=promisify(scrypt);
const dummySalt='00000000000000000000000000000000';
export async function passwordHash(password,salt=randomBytes(16).toString('hex')){
  const key=await derive(password,salt,64);return salt+':'+key.toString('hex');
}
export async function verifyPassword(password,hash){
  const [salt,expected]=(hash||dummySalt+':'+ '00'.repeat(64)).split(':');
  const [,actual]=(await passwordHash(password,salt)).split(':');
  return !!hash&&expected?.length===128&&timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(actual,'hex'));
}
export async function bootstrapAdmin({email,password}){
  if(!email&&!password)return;
  if(!email||!password||password.length<12)throw Error('Set both admin bootstrap variables and use at least 12 characters for the password.');
  await User.updateOne({email:email.trim().toLowerCase()},{$setOnInsert:{passwordHash:await passwordHash(password)}},{upsert:true});
}
const cookie='wdb_admin';
const audience='wdb-admin';
const options=secure=>({httpOnly:true,secure,sameSite:'strict',path:'/api/admin'});
export function adminAuth(secret,secure){
  function requireAdmin(req,res,next){
    const token=req.headers.cookie?.split(/;\s*/).find(c=>c.startsWith(cookie+'='))?.slice(cookie.length+1);
    try{if(!secret)throw Error();req.admin=jwt.verify(token,secret,{audience,issuer:'wdb-api',algorithms:['HS256']});next();}
    catch{res.status(401).json({error:'Please sign in to continue.'});}
  }
  return {
    requireAdmin,
    async login(req,res){
      if(!secret)return res.status(503).json({error:'Admin login has not been configured.'});
      const {email,password}=req.valid;
      const user=await User.findOne({email}).select('+passwordHash');
      const matches=await verifyPassword(password,user?.passwordHash);
      if(!matches)return res.status(401).json({error:'Invalid email or password.'});
      const token=jwt.sign({sub:String(user._id)},secret,{audience,issuer:'wdb-api',algorithm:'HS256',expiresIn:'2h'});
      res.cookie(cookie,token,{...options(secure),maxAge:7200000}).json({email:user.email});
    },
    logout(_req,res){res.clearCookie(cookie,options(secure)).status(204).end();},
  };
}
