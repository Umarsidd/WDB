import mongoose from 'mongoose';
const { Schema, model, models }=mongoose;
const cartLine=new Schema({category:String,slug:String,quantity:Number,name:String,amount:Number,billing:String,unit:String,startsAt:Boolean},{_id:false,optimisticConcurrency:true});
const intake={name:String,phone:String,email:String,category:String,package:String,service:String,packageName:String,budget:String,message:String,consent:Boolean,cart:[cartLine],estimate:Schema.Types.Mixed,notes:{type:String,default:''}};
const lead=new Schema({...intake,status:{type:String,enum:['new','contacted','won'],default:'new'}},{timestamps:true,optimisticConcurrency:true});
const appointment=new Schema({...intake,id:{type:String,required:true,unique:true},type:String,date:{type:String,required:true},slot:{type:String,required:true},business:String,status:{type:String,enum:['pending','confirmed','completed','cancelled'],default:'pending'},active:{type:Boolean,default:true}},{timestamps:true,id:false,optimisticConcurrency:true});
// MongoDB, not a preflight check, arbitrates simultaneous requests and reschedules.
appointment.index({date:1,slot:1},{unique:true,partialFilterExpression:{active:true}});
lead.index({createdAt:-1});
appointment.index({createdAt:-1});
const user=new Schema({email:{type:String,required:true,unique:true},passwordHash:{type:String,required:true,select:false}},{timestamps:true});
export const Lead=models.Lead||model('Lead',lead);
export const Appointment=models.Appointment||model('Appointment',appointment);
export const User=models.User||model('User',user);
