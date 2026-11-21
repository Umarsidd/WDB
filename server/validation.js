import { z } from 'zod';
import { appointmentTypes, booking, slots } from '../data/site.js';
import { services } from '../data/services.js';
import { findPackage } from '../data/packages.js';
import { maxCartLines } from '../lib/cart.js';
import { bookableDate, upcomingSlot } from '../lib/booking.js';
const phone=z.string().trim().max(22).transform(v=>v.replace(/[ ()-]/g,'')).pipe(z.string().regex(/^(?:\+91)?[6-9]\d{9}$/,'Enter a valid Indian mobile number.')).transform(v=>v.startsWith('+91')?v:'+91'+v);
const ids=services.map(s=>s.slug).concat('other');
const line=z.object({category:z.enum(ids),slug:z.string().min(1).max(80),quantity:z.number().int().min(1).max(50)}).refine(x=>!!findPackage(x.category,x.slug),'A cart item is no longer available.');
const base=z.object({
  name:z.string().trim().min(2,'Enter your full name.').max(100),
  phone,email:z.email().trim().toLowerCase().max(150),
  category:z.enum(ids),package:z.string().max(80).default(''),
  budget:z.union([z.literal(''),z.enum(booking.budgets)]).default(''),
  message:z.string().trim().max(2000).default(''),
  consent:z.literal(true,{error:'Consent is required.'}),
  website:z.string().max(0,'Unable to submit this form.').default(''),
  cart:z.array(line).max(maxCartLines).default([]),
});
function selectedPackage(value,ctx){
  if(value.package&&!findPackage(value.category,value.package))ctx.addIssue({code:'custom',path:['package'],message:'Select a package from the chosen category.'});
}
export const enquirySchema=base.extend({ message:z.string().trim().min(1,'Enter a message.').max(2000) }).superRefine(selectedPackage);
export const appointmentSchema=base.extend({
  type:z.enum(appointmentTypes),
  date:z.string().refine(value=>bookableDate(value),'Choose an available date within the next 60 days.'),
  slot:z.enum(slots.map(s=>s.id)), business:z.string().trim().max(120).default(''),
}).superRefine((value,ctx)=>{
  selectedPackage(value,ctx);
  if(!upcomingSlot(value.date,slots.find(s=>s.id===value.slot)))ctx.addIssue({code:'custom',path:['slot'],message:'Choose a time slot that has not started.'});
});
export const loginSchema=z.object({email:z.email().max(150).toLowerCase(),password:z.string().min(1).max(200)});
export const leadUpdate=z.object({status:z.enum(['new','contacted','won']),notes:z.string().trim().max(2000)}).partial().strict();
export const appointmentUpdate=z.object({
  status:z.enum(['pending','confirmed','completed','cancelled']),notes:z.string().trim().max(2000),
  date:z.string(),slot:z.enum(slots.map(s=>s.id)),
}).partial().strict();
