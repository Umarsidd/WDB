import { services } from '../data/services.js';
import { findPackage } from '../data/packages.js';
export function prefill(query){
  const category=query.category;
  const initialCategory=services.some(s=>s.slug===category)||category==='other'?category:'';
  return {initialCategory,initialPackage:findPackage(initialCategory,query.package)?.slug||''};
}
