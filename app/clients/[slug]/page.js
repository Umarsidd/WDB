import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { PageIntro, SectionHead } from '@/components/UI';
import { DeviceMockup, ProjectBadges } from '@/components/ClientCard';
import { projects, confirmations } from '@/data/projects';
import { pageMeta } from '@/lib/seo';
export function generateStaticParams(){return projects.map(({slug})=>({slug}));}
async function get(params){const p=projects.find(x=>x.slug===(params && params.slug));return p;}
export async function generateMetadata({params}){const p=await get(await params);if(!p)notFound();return pageMeta(p.name,p.description,'/clients/'+p.slug,p.screenshotDesktop||undefined);}
export default async function CaseStudy({params}){
  const p=await get(await params);if(!p)notFound();
  const live=<a className="btn primary" href={p.url} target="_blank" rel="noopener noreferrer">Visit Live Site <ArrowUpRight size={16}/></a>;
  return <><PageIntro eyebrow={p.featured?'Live in Iraq 🇮🇶':p.category} title={p.name} description={p.description} items={[[ 'Clients','/clients' ],[p.name,'/clients/'+p.slug]]}/><div className="shell section detail-grid">
    <div className="detail-main"><div className="project-visual"><DeviceMockup project={p} preview={false} priority/></div>
    <section className="content-card"><h2>Client</h2><p>{p.name} · {p.country}</p>{p.period&&<p>Built {p.period}.</p>}</section>
    <section className="content-card"><h2>Problem</h2><p>{p.problem||'Client brief coming soon.'}</p></section>
    <section className="content-card"><h2>Solution</h2><p>{p.solution||p.description}</p>{p.featured&&confirmations.danRtl&&<p>{confirmations.danRtl}</p>}</section>
    <section className="content-card"><h2>Key Features</h2><ul className="checks">{p.features.map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul></section>
    <section className="content-card"><h2>Tech Stack</h2><ProjectBadges project={p}/>
      {p.featured&&<><h3>Architecture</h3><div className="case-arch" role="img" aria-label="React to Apollo GraphQL to Prisma to PostgreSQL">{['React','Apollo GraphQL','Prisma','PostgreSQL'].map((n,i)=><span key={n}>{i>0&&<ArrowRight size={15}/>} {n}</span>)}</div><p className="muted">Docker · AWS S3 / Cloudinary · OpenAI API</p></>}</section>
    <section className="content-card"><h2>Result</h2>{p.result&&<p>{p.result}</p>}<p className="muted">{p.testimonial}</p></section></div>
    <div className="detail-main"><section className="content-card"><h2>Live Link</h2>{live}</section>
    {p.featured&&confirmations.danDashboardImages.length>0&&<section className="content-card detail-main"><h2>Dashboard screenshots</h2>{confirmations.danDashboardImages.map((src,i)=><figure className="case-figure" key={src}><img src={src} alt={p.name+' dashboard '+(i+1)} loading="lazy"/></figure>)}</section>}
    {p.screenshotFull&&<figure className="case-figure"><a href={p.screenshotFull} target="_blank" rel="noopener noreferrer"><img src={p.screenshotDesktop||p.screenshotFull} alt={p.name+' public website'} loading="lazy"/></a><figcaption>Open full-page capture <ArrowUpRight size={13}/></figcaption></figure>}</div>
  </div></>;
}
