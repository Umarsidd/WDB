import { Download, ExternalLink } from 'lucide-react';
import { PageIntro, JsonLd, SectionHead } from '@/components/UI';
import { Stats } from '@/components/Stats';
import { founder as f } from '@/data/founder';
import { site } from '@/data/site';
import { pageMeta, schema, origin } from '@/lib/seo';
export const metadata=pageMeta('About Mohd Umar Siddiqui',f.title,'/about');
export default function About(){return <><JsonLd value={schema('Person',{name:f.name,jobTitle:'Full Stack Developer',description:f.bio,url:origin+'/about',sameAs:[f.linkedin,f.github,f.portfolio],email:site.email})}/><PageIntro eyebrow="Founder" title={f.name} description={f.title} items={[[ 'About','/about' ]]}/><div className="shell section">
  <div className="detail-grid"><div className="content-card"><h2>Founder profile</h2><p>{f.bio}</p><p className="muted">{f.location}</p><div className="link-row profile-links"><a href={f.portfolio} target="_blank" rel="noopener noreferrer" className="btn primary">View Full Portfolio <ExternalLink size={15}/></a><a href={f.resume} download className="btn ghost">Download resume <Download size={15}/></a></div>
  <div className="link-row profile-links"><a className="inline-link" href={'tel:+91'+site.phone}>+91 {site.phone}</a><a className="inline-link" href={'mailto:'+site.email}>{site.email}</a><a className="inline-link" href={f.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/mohd-umar-siddiqui</a><a className="inline-link" href={f.github} target="_blank" rel="noopener noreferrer">github.com/Umarsidd</a></div></div>
  <img className="about-photo" src={f.photo} width="320" height="320" alt={f.name+' profile photo placeholder'}/></div>
  <Stats items={f.stats}/>
  <section className="section"><SectionHead tag="Experience" title="Career timeline"/><div className="timeline-grid">{f.timeline.map(j=><article className="content-card" key={j.role}><span className="eyebrow">{j.period}</span><h3>{j.role}</h3><ul className="list-disc pl-5">{j.details.map(d=><li key={d}>{d}</li>)}</ul></article>)}</div></section>
  <div className="detail-grid"><section className="content-card"><h2>Education & Certification</h2>{f.education.map(x=><p key={x}>{x}</p>)}<p>{f.certification}</p></section><section className="content-card"><h2>Languages</h2>{f.languages.map(x=><p key={x}>{x}</p>)}</section></div>
  <section className="section"><SectionHead tag="Capabilities" title="Skills"/><div className="service-grid">{Object.entries(f.skills).map(([g,list])=><div className="content-card" key={g}><h3>{g}</h3><div className="tag-list">{list.map(x=><span className="skill-chip" key={x}>{x}</span>)}</div></div>)}</div></section>
  </div></>;}
