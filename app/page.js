import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MapPin, Monitor, ShoppingCart, BadgeIndianRupee } from 'lucide-react';
import { Hero, HeroTech } from '@/components/Hero';
import { SectionHead, TechStack, Process } from '@/components/UI';
import { StudioArt } from '@/components/StudioArt';
import { ServiceExplorer } from '@/components/ServiceExplorer';
import { ClientCard } from '@/components/ClientCard';
import { PackageCard } from '@/components/Catalogue';
import { projects } from '@/data/projects';
import { packages } from '@/data/packages';
import { founder } from '@/data/founder';
import { reasons, credibility, domainNotice } from '@/data/services';
import { pageMeta } from '@/lib/seo';
import { site } from '@/data/site';
export const metadata=pageMeta(site.name,site.tagline);
const highlights=[
  {icon:Monitor,title:'Website Development',subtitle:'Web Design & Development',href:'/services/websites'},
  {icon:ShoppingCart,title:'E-commerce',subtitle:'Websites',href:'/services/websites/e-commerce-website'},
  {icon:BadgeIndianRupee,title:'Affordable Pricing',subtitle:'Digital Solutions',href:'/services'},
];
export default function Home(){
  const featured=projects.find(p=>p.featured);
  const websitePlans=packages.filter(p=>p.category==='websites');
  return <>
    <Hero/>
    <div className="shell highlight-cards">{highlights.map(({icon:Icon,title,subtitle,href})=><Link href={href} className="highlight-card" key={title} data-build="box"><span><Icon size={50} strokeWidth={1.7}/></span><h2>{title}</h2><p>{subtitle}</p></Link>)}</div>
    <section className="shell section intro-section">
      <div className="intro-art"><StudioArt compact/></div>
      <div className="intro-copy"><div className="intro-kicker">Your Digital Growth Partner</div><h2>Welcome to WDB – Website Development for Business</h2><p>{founder.bio}</p><details><summary>Read More <ArrowRight size={17}/></summary><p>{credibility}. {founder.location}.</p><Link href="/about" className="inline-link">About the founder <ArrowUpRight size={16}/></Link></details></div>
    </section>
    <section className="shell section service-section"><SectionHead tag="Our Services At a Glance" title="Services" description="Explore the services and packages that fit your business." href="/services" linkText="Explore all services"/><ServiceExplorer/></section>
    <section className="section section-tinted pricing-section"><div className="shell"><SectionHead tag="Website Development Packages" title="Plans & Pricing" description="Simple, Transparent and Affordable Pricing for Indian Businesses" href="/services/websites" linkText="Compare website packages"/><p className="pricing-notice">🇮🇳 {domainNotice}</p><div className="package-grid home-packages">{websitePlans.map((p,i)=><PackageCard key={p.slug} plan={p} index={i} illustrated/>)}</div></div></section>
    <section className="shell section feature-section"><SectionHead tag="Featured work" title="Built for business. Live in Iraq."/><ClientCard project={featured} featured/></section>
    <section className="shell section"><SectionHead tag="Our work" title="Happy Clients & Projects" href="/clients" linkText="View all projects"/><div className="project-grid">{projects.filter(p=>!p.featured).slice(0,3).map((p,index)=><ClientCard key={p.slug} project={p} index={index}/>)}</div></section>
    <section className="shell section"><div className="founder-strip" data-build="box"><div className="founder-monogram" aria-hidden="true">US<span>.</span></div><div><div className="eyebrow"><span/>Meet the founder</div><h2>{founder.name}</h2><p>{founder.title}</p><small><MapPin size={15}/> {founder.location}</small></div><Link className="btn ghost" href="/about">About the founder <ArrowUpRight size={16}/></Link></div></section>
    <section className="shell section why-section"><SectionHead tag="The WDB difference" title="Why Choose Us" description={credibility}/><ul>{reasons.map(r=><li key={r}><Check size={16}/>{r}</li>)}</ul></section>
    <section className="shell section"><SectionHead tag="How we work" title="Our Process" href="/process" linkText="See our process"/><Process/></section>
    <section className="shell section"><SectionHead tag="Under the hood" title="Technology Stack" href="/tech-stack" linkText="Explore the stack"/><TechStack/></section>
    <HeroTech/>
  </>;
}
