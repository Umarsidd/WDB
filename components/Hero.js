import Link from 'next/link';
import { ArrowUpRight, ArrowRight, PanelsTopLeft, Code2, Globe2, CircleCheck, PenTool, Smartphone, BarChart3, Sparkles } from 'lucide-react';
import { site } from '@/data/site';
import { TechLogo, WhatsAppLink } from './UI';
import { StudioArt } from './StudioArt';

export function HeroGraphic(){
  return <div className="hero-visual" aria-hidden="true" data-build="box">
    <div className="hero-grid"/>
    <div className="canvas-tag"><span/> WDB / DESIGN STUDIO</div><div className="canvas-counter">01 / 05</div>
    <div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/>
    <div className="hero-window"><div className="window-top"><span className="traffic"><i/><i/><i/></span><span><Globe2 size={10}/> wdb / workspace</span><span>•••</span></div>
      <div className="window-content"><div className="window-toolbar"><PanelsTopLeft size={14}/><div/><div/><div/><small>Publish <ArrowUpRight size={9}/></small></div>
      <div className="window-work"><div className="window-copy"><span>✦ DIGITAL BY DESIGN</span><b>Made for<br/>your <em>growth.</em></b><div className="wire-lines"><i/><i/></div><small>Explore <ArrowUpRight size={11}/></small></div>
      <div className="window-orb"><svg viewBox="0 0 180 155" fill="none"><defs><linearGradient id="orb-fill" x1="20" y1="15" x2="158" y2="141" gradientUnits="userSpaceOnUse"><stop stopColor="#ffb99a"/><stop offset=".53" stopColor="#f76e4f"/><stop offset="1" stopColor="#a6366c"/></linearGradient></defs><circle cx="90" cy="77" r="60" fill="url(#orb-fill)"/><g stroke="#40233d" strokeOpacity=".44"><ellipse cx="90" cy="77" rx="60" ry="22" transform="rotate(-25 90 77)"/><ellipse cx="90" cy="77" rx="60" ry="42" transform="rotate(-25 90 77)"/><ellipse cx="90" cy="77" rx="31" ry="60" transform="rotate(-25 90 77)"/><ellipse cx="90" cy="77" rx="12" ry="60" transform="rotate(-25 90 77)"/><path d="M36 102 144 52M65 22l50 110"/></g><ellipse cx="90" cy="77" rx="84" ry="19" transform="rotate(-24 90 77)" stroke="#ffbaac" strokeOpacity=".75"/><circle cx="152" cy="40" r="3" fill="#ffe7dd"/></svg><Sparkles size={17}/></div></div>
      <div className="window-foot"><i/><i/><i/></div></div>
    </div>
    <div className="visual-chip visual-code"><Code2 size={16}/><span>Development</span></div>
    <div className="visual-chip visual-chart"><BarChart3 size={16}/><span>Marketing</span></div>
    <div className="canvas-bottom"><CircleCheck size={13}/> Design · Develop · Launch <span>✦</span></div>
  </div>;
}
export function Hero(){
  return <div className="hero-background">
    <section className="hero shell" data-swarm-header>
      <div className="hero-copy">
        <h1 data-build="text">{site.hero}</h1>
        <p data-build="text">{site.tagline}</p>
        <div className="hero-identity">{site.partner} <strong>{site.disciplines.join(' | ')}</strong></div>
        <div className="hero-actions"><Link className="btn primary" href="/book-appointment">Book Appointment<ArrowUpRight size={18}/></Link><WhatsAppLink/></div>
        <div className="hero-chips">{site.chips.map((chip,i)=><span key={chip}>{chip}{i<site.chips.length-1&&<b>+</b>}</span>)}</div>
      </div>
      <StudioArt/>
    </section>
  </div>;
}
export function HeroTech(){
  return <div className="hero-tech"><div className="shell"><span>BUILT WITH MODERN TECH</span>{[['react','React'],['next','Next.js'],['node','Node.js'],['mongo','MongoDB'],['tailwind','Tailwind CSS']].map(([type,name])=><div key={type}><TechLogo type={type} size={21}/>{name}</div>)}<Link href="/tech-stack" aria-label="View technology stack"><ArrowRight size={20}/></Link></div></div>;
}
