import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CalendarDays, Check } from 'lucide-react';
import { PageIntro, WhatsAppLink, JsonLd, SectionHead } from '@/components/UI';
import { HeroGraphic } from '@/components/Hero';
import { PackageCard, PackageEstimate } from '@/components/Catalogue';
import { services, domainNotice } from '@/data/services';
import { appointmentHref, enquiryHref, findPackage, packageHref, packages, priceLabel } from '@/data/packages';
import { faqs } from '@/data/faqs';
import { confirmations } from '@/data/projects';
import { pageMeta, schema, origin } from '@/lib/seo';
export function generateStaticParams(){return packages.map(({category,slug})=>({category,slug}));}
async function get(params){const {category,slug}=await params;const p=findPackage(category,slug);if(!p)notFound();return p;}
export async function generateMetadata({params}){const p=await get(params);return pageMeta(p.name,[p.bestFor,priceLabel(p),...p.features.slice(0,2)].filter(Boolean).join(' · '),packageHref(p));}
export default async function PackageDetail({params}){
  const p=await get(params),s=services.find(x=>x.slug===p.category);
  const related=packages.filter(x=>x.category===p.category&&x.slug!==p.slug).slice(0,3);
  const alternatives=related.length?related:packages.filter(x=>x.category==='add-ons').slice(0,3);
  const questions=[...(faqs[p.category]||[]),...faqs.all];
  return <><PageIntro eyebrow={p.popular?'MOST POPULAR':s.name} title={p.name} description={p.bestFor||s.summary} items={[[ 'Services','/services' ],[s.heading,'/services/'+s.slug],[p.name,packageHref(p)]]}/>
    <JsonLd value={schema('Service',{name:p.name,description:p.bestFor||s.summary,serviceType:s.name,url:origin+packageHref(p),provider:{'@id':origin+'/#business'},offers:{'@type':'Offer',name:p.name,url:origin+enquiryHref(p),priceCurrency:'INR',...(p.amount!==null?(p.startsAt?{priceSpecification:{'@type':'PriceSpecification',minPrice:p.amount,priceCurrency:'INR'}}:{price:p.amount}):{})}})}/>
    <div className="shell section"><div className="detail-grid"><div className="detail-main">
    <section className="content-card"><strong className="package-price">{priceLabel(p)}</strong><div className="detail-actions"><Link className="btn primary" href={appointmentHref(p)}><CalendarDays size={17}/>Book Appointment</Link><WhatsAppLink message={'Hello WDB, I would like to enquire about '+p.name+'.'}>Enquire on WhatsApp</WhatsAppLink><Link href={enquiryHref(p)} className="inline-link">{p.cta} <ArrowUpRight size={15}/></Link></div></section>
      <section className="content-card"><h2>What’s included</h2>{p.features.length?<ul className="checks">{p.features.map(x=><li key={x}><Check size={16}/>{x}</li>)}</ul>:<p>Request a quote to discuss the scope of {p.name}.</p>}{p.slug==='premium-smm'&&confirmations.influencerCollaboration&&<p>{confirmations.influencerCollaboration}</p>}{p.category==='websites'&&<div className="domain-notice">🇮🇳 {domainNotice}</div>}</section>
      <section className="content-card detail-gallery"><h2>Mockup gallery</h2><figure><HeroGraphic/><figcaption>Illustrative WDB design workspace.</figcaption></figure><figure className="mini-mockup"><div><span>WDB / MOBILE</span><strong>Made for<br/>your growth.</strong><small>Web | App | Marketing | Branding</small></div><figcaption>Illustrative mobile layout.</figcaption></figure></section>
      <section className="content-card faq"><h2>Frequently asked questions</h2>{questions.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    </div><PackageEstimate plan={p}/></div>
    <div className="cross-sell"><Link className="btn ghost" href="/services/social-media">Add Social Media Marketing <ArrowUpRight size={16}/></Link><Link className="btn ghost" href="/services/paid-promotion">Add Paid Promotion <ArrowUpRight size={16}/></Link></div>
    {alternatives.length>0&&<><SectionHead tag="Explore more" title="Related packages"/><div className="package-grid">{alternatives.map(x=><PackageCard plan={x} key={x.slug}/>)}</div></>}
    </div></>;
}
