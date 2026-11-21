import { findPackage } from '../data/packages.js';
export const maxCartLines = 30;
const maxQuantity = 50;
export function readCart(lines = []) {
  const entries = new Map();
  for (const line of Array.isArray(lines) ? lines.slice(0,maxCartLines) : []) {
    if (!line || typeof line !== 'object') continue;
    const p = findPackage(line.category,line.slug);
    if (!p) continue;
    const quantity = p.category === 'add-ons' ? Math.min(maxQuantity,Math.max(1,Number.isInteger(line.quantity)?line.quantity:1)) : 1;
    entries.set(p.slug,{category:p.category,slug:p.slug,quantity});
  }
  return [...entries.values()];
}
export function estimate(lines) {
  return readCart(lines).reduce((out,line)=>{
    const p = findPackage(line.category,line.slug);
    if (p.amount===null) out.custom=true;
    else out[p.billing] += p.amount*line.quantity;
    if (p.startsAt) out.minimum=true;
    return out;
  },{'one-time':0,month:0,campaign:0,year:0,custom:false,minimum:false});
}
