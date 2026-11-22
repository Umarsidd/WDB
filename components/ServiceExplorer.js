'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/services';
import { packages, packageHref, priceLabel } from '@/data/packages';
import { iconMap, WhatsAppLink } from './UI';
export function ServiceExplorer(){
  const [selected,setSelected]=useState(services[0].slug);
  const service=services.find(s=>s.slug===selected), Icon=iconMap[service.icon];
  const plans=packages.filter(p=>p.category===selected);
  return <div className="service-explorer">
    <div className="explorer-nav" aria-label="Explore service categories">
      {services.map(s=>{const I=iconMap[s.icon];return <button key={s.slug} type="button" className={selected===s.slug?'active':''} aria-pressed={selected===s.slug} onClick={()=>setSelected(s.slug)}><I size={22}/>{s.name}</button>;})}
    </div>
    <section className="explorer-content" aria-live="polite">
      <h3><Icon size={25}/>{service.name}</h3><p>{service.summary}</p>
      <div className="explorer-plans">{plans.map(p=><Link key={p.slug} href={packageHref(p)}><span><strong>{p.name}</strong><small>{p.bestFor||service.name}</small></span><b>{priceLabel(p)}</b></Link>)}</div>
      <div className="explorer-actions"><WhatsAppLink message={'Hello WDB, I would like to enquire about '+service.name+'.'}>Chat on WhatsApp</WhatsAppLink><Link href={'/services/'+service.slug} className="inline-link">Explore {service.name} <ArrowRight size={16}/></Link></div>
    </section>
  </div>;
}
