import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Monitor, Users, Megaphone, PenTool, Video, Headphones, Globe2, Code2, MessageCircle, ClipboardList, CircleCheck, Rocket, Cloud, ChevronRight, MapPin } from 'lucide-react';
import { packages, priceLabel } from '@/data/packages';
import { services, process as processSteps, technologies, techInAction } from '@/data/services';
import { site, whatsapp } from '@/data/site';
import { origin, schema } from '@/lib/seo';

export const iconMap = {monitor:Monitor,users:Users,megaphone:Megaphone,pen:PenTool,video:Video,headphones:Headphones};
export const categoryPrice = s => {
  const priced = packages.filter(p => p.category === s.slug && p.amount !== null).sort((a,b) => a.amount-b.amount);
  return priced.length ? 'from ' + priceLabel(priced[0]) : 'Get Quote';
};
export function Brand({dark=false}){
  return <Link href="/" className="brand" aria-label={site.name}>
    <img src={`/brand/mark-${dark?'white':'black'}.webp`} alt="" width="37" height="35"/>
    <span><strong aria-hidden="true"><img src={`/brand/wordmark-${dark?'white':'black'}.webp`} alt="" width="84" height="20"/><span>.</span></strong><small>WEBSITE DEVELOPMENT FOR BUSINESS</small></span>
  </Link>;
}
export function WhatsAppIcon({size=18}){
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L4 20.4l1-3.9A8.5 8.5 0 1 1 20.5 11.8Z"/><path fill="currentColor" stroke="none" d="M9.2 8c.4-.2.7-.1.9.3l.7 1.5c.1.3-.1.5-.5 1 .5 1 1.4 1.8 2.5 2.3.3 0 .7-.7.9-.8.2-.1 1.9.7 2.1.9.2.2.1.8-.2 1.2-.8 1.3-3 .5-4.4-.4C9.7 13 8 11.2 8 9.6 8 8.8 8.7 8.1 9.2 8Z"/></svg>;
}
export function WhatsAppLink({children='WhatsApp Now',message,className='btn ghost'}){
  return <a href={whatsapp(message)} className={className} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{children}</a>;
}
export function SectionHead({tag,title,description,href,linkText}){
  return <div className="section-head"><div><div className="eyebrow"><span/>{tag}</div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{href&&<Link className="inline-link" href={href}>{linkText}<ArrowUpRight size={17}/></Link>}</div>;
}
export function JsonLd({value}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>;}
export function Breadcrumb({items}){
  const all=[['Home','/'],...items];
  return <><nav aria-label="Breadcrumb" className="breadcrumb">{all.map(([label,url],i)=><span key={url}>{i>0&&<ChevronRight size={13}/>} {i===all.length-1?<span aria-current="page">{label}</span>:<Link href={url}>{label}</Link>}</span>)}</nav>
    <JsonLd value={schema('BreadcrumbList',{itemListElement:all.map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:origin+url}))})}/></>;
}
export function PageIntro({eyebrow,title,description,items,children}){
  return <section className="page-intro"><div className="shell">{items&&<Breadcrumb items={items}/>}<div className="page-intro-content" data-swarm-header><div className="eyebrow"><span/>{eyebrow}</div><h1 data-build="text">{title}</h1>{description&&<p data-build="text">{description}</p>}{children}</div></div></section>;
}
export function ServiceTiles({directory=false}){
  return <div className="service-grid">{services.map((s,i)=>{const Icon=iconMap[s.icon];return <Link href={'/services/'+s.slug} className={`service-tile tone-${s.color}`} key={s.slug} data-build={i===0?'box':'duplicate'}>
    <span className="service-icon"><Icon size={23} strokeWidth={1.7}/></span><ArrowUpRight className="tile-arrow" size={20}/>
    <h3>{s.name}</h3><p>{s.summary}</p>
    <div className="tile-meta"><span>{categoryPrice(s)}</span>{directory&&<span>{packages.filter(p=>p.category===s.slug).length} {packages.filter(p=>p.category===s.slug).length===1?'package':'packages'} · Explore <ArrowRight size={13}/></span>}</div>
  </Link>;})}</div>;
}
const techLogos = {react:'react',node:'nodedotjs',mysql:'mysql',next:'nextdotjs',express:'express',mongo:'mongodb',wordpress:'wordpress',tailwind:'tailwindcss',docker:'docker'};
export function TechLogo({type,size=23}){return techLogos[type]?<img className={'tech-logo tech-'+type} src={'/tech/'+techLogos[type]+'.svg'} alt="" width={size} height={size}/>:<Cloud size={size}/>;}
export function TechStack(){
  return <><div className="tech-grid">{technologies.map(([name,desc,type],i)=><div className="tech-card" key={name} data-build={i===0?'box':'duplicate'}><TechLogo type={type}/><strong>{name}</strong>{desc&&<span>({desc})</span>}</div>)}</div>
    <div className="action-strip"><strong>Tech Stack in Action</strong><div>{techInAction.join(' · ')}</div></div></>;
}
const processIcons=[MessageCircle,ClipboardList,Code2,CircleCheck,Rocket];
export function Process(){return <ol className="process-grid">{processSteps.map((step,i)=>{const Icon=processIcons[i];return <li key={step} data-build={i===0?'box':'duplicate'}><span className="process-icon"><Icon size={24}/></span><small>0{i+1}</small><h3>{step}</h3></li>;})}</ol>;}
export function MapCard({compact=false}){
  const embed=process.env.NEXT_PUBLIC_MAPS_EMBED_URL;
  return <section className={`map-card ${compact?'compact':''}`} aria-label="Find Us on Google Maps">
    <div className="map-info"><div className="eyebrow"><MapPin size={15}/> Find Us on Google Maps</div>{!compact&&<h2>Visit the WDB office</h2>}<p>{site.address}</p>
    <a className="inline-link" href={site.maps} target="_blank" rel="noopener noreferrer">{compact?'Get Directions':'Get Directions / Open in Google Maps'} <ArrowUpRight size={15}/></a></div>
    <figure><img src="/brand/directions.png" width="78" height="78" loading="lazy" alt="QR code for directions to the WDB office"/><figcaption>Scan to Get Directions</figcaption></figure>
    {!compact&&embed&&/^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed(?:\?|$)/i.test(embed)&&<iframe title="Map to the WDB office" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>}
  </section>;
}
export function Closing(){return <section className="shell closing-wrap"><div className="closing"><ArrowDownRight className="closing-art" aria-hidden="true"/><div className="eyebrow"><span/> {site.partner}</div><h2>{site.closing}</h2><Link href="/contact#enquiry" className="btn primary">Contact Us<ArrowUpRight size={17}/></Link></div></section>;}
export function Footer(){
  return <><div className="glance"><div className="shell"><strong>Our Services At a Glance</strong>{services.map(s=>{const Icon=iconMap[s.icon];return <Link key={s.slug} href={'/services/'+s.slug}><Icon size={16}/>{s.name}</Link>;})}</div></div>
    <footer className="footer"><div className="shell footer-grid"><div><Brand dark/><p>{site.tagline}</p><p>{site.disciplines.join('  |  ')}</p><Link href="/contact#enquiry" className="inline-link">Contact Us <ArrowUpRight size={16}/></Link></div>
    <div><h3>Services</h3>{services.map(s=><Link key={s.slug} href={'/services/'+s.slug}>{s.name}</Link>)}</div>
    <div><h3>Quick Links</h3>{[['Clients','clients'],['About','about'],['Tech Stack','tech-stack'],['Process','process'],['Contact','contact'],['Book Appointment','book-appointment']].map(([n,p])=><Link key={p} href={'/'+p}>{n}</Link>)}</div>
    <div><h3>Contact Us Today</h3><a href={'tel:+91'+site.phone}>+91 {site.phone}</a><a href={'mailto:'+site.email}>{site.email}</a><a href={'https://instagram.com/'+site.instagram} target="_blank" rel="noopener noreferrer">{site.instagram}</a><WhatsAppLink className="footer-wa">WhatsApp</WhatsAppLink><MapCard compact/></div>
    </div><div className="shell footer-end"><span>© WDB – Website Development for Business</span><span>{site.closing}</span></div></footer></>;
}
