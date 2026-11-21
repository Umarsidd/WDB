import Link from 'next/link';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Hero, HeroTech } from '@/components/Hero';
import { SectionHead, ServiceTiles, TechStack, Process } from '@/components/UI';
import { ClientCard } from '@/components/ClientCard';
import { PackageCard } from '@/components/Catalogue';
import { SwarmIntro } from '@/components/SwarmIntro';
import { site } from '@/data/site';
import { projects } from '@/data/projects';
import { packages } from '@/data/packages';
import { founder } from '@/data/founder';
import { reasons, credibility } from '@/data/services';
import { pageMeta } from '@/lib/seo';

export const metadata=pageMeta(site.name,site.tagline);
export default function Home(){
  const featured=projects.find(p=>p.featured);
  const popular=packages.filter(p=>['starter-website','business-website','growth-website'].includes(p.slug));
  return <>
    <Hero/><HeroTech/><SwarmIntro home/>
    <section className="shell section"><SectionHead tag="01 / WHAT WE DO" title="Our Services At a Glance" description="Explore the services and packages that fit your business." href="/services" linkText="Explore all services"/><ServiceTiles/></section>
    <section className="shell section feature-section"><SectionHead tag="02 / FEATURED WORK" title="Built for business. Live in Iraq."/><ClientCard project={featured} featured/></section>
    <section className="section section-tinted"><div className="shell"><SectionHead tag="03 / WEBSITE PACKAGES" title="Popular packages" description="Simple, Transparent and Affordable Pricing for Indian Businesses" href="/services/websites" linkText="All website packages"/><div className="package-grid home-packages">{popular.map((p,i)=><PackageCard key={p.slug} plan={p} index={i}/>)}</div></div></section>
    <section className="shell section"><SectionHead tag="04 / OUR WORK" title="Happy Clients & Projects" href="/clients" linkText="View all projects"/><div className="project-grid">{projects.filter(p=>!p.featured).slice(0,3).map((p,index)=><ClientCard key={p.slug} project={p} index={index}/>)}</div></section>
    <section className="shell section"><div className="founder-strip" data-build="box"><div className="founder-monogram" aria-hidden="true">US<span>.</span></div><div><div className="eyebrow"><span/>05 / MEET THE FOUNDER</div><h2>{founder.name}</h2><p>{founder.title}</p><small><MapPin size={15}/> {founder.location}</small></div><Link className="btn ghost" href="/about">About the founder <ArrowUpRight size={16}/></Link></div></section>
    <section className="shell section why-section"><SectionHead tag="06 / THE WDB DIFFERENCE" title="Why Choose Us" description={credibility}/><ul>{reasons.map(r=><li key={r}><Check size={16}/>{r}</li>)}</ul></section>
    <section className="shell section"><SectionHead tag="07 / HOW WE WORK" title="Our Process" href="/process" linkText="See our process"/><Process/></section>
    <section className="shell section"><SectionHead tag="08 / UNDER THE HOOD" title="Technology Stack" href="/tech-stack" linkText="Explore the stack"/><TechStack/></section>
  </>;
}
