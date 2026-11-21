'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Globe2 } from 'lucide-react';
export function DeviceMockup({project,preview=true,priority=false}){
  const [hover,setHover]=useState(false),timer=useRef(null),screen=useRef(null);
  const previewEnabled=preview&&project.canFrame;
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{if(!hover||!screen.current)return;const node=screen.current;const size=()=>node.style.setProperty("--preview-scale",String(node.clientWidth/1440));size();const observer=new ResizeObserver(size);observer.observe(node);return()=>observer.disconnect();},[hover]);
  const fallback=<div className="device-fallback"><img src="/brand/mark-white.webp" width="50" height="47" alt=""/><strong>{project.name}</strong></div>;
  return <div className="devices" data-build="box" onPointerEnter={e=>{if(previewEnabled&&e.pointerType==='mouse')timer.current=setTimeout(()=>setHover(true),750);}} onPointerLeave={()=>{clearTimeout(timer.current);setHover(false);}}>
    <div className="browser-frame"><div className="browser-top"><span className="traffic"><i/><i/><i/></span><span><Globe2 size={10}/> {new URL(project.url).hostname}</span></div>
      <div className="browser-screen" ref={screen}>{project.screenshotDesktop?<img src={project.screenshotDesktop} alt={project.name+' live website on desktop'} width="1440" height="900" loading={priority?'eager':'lazy'} decoding="async"/>:fallback}
      {hover&&previewEnabled&&<iframe src={project.url} title={project.name+' live preview'} tabIndex={-1} loading="lazy" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer"/>}</div>
    </div>
    <div className="phone-frame"><div className="phone-notch"/>{project.screenshotMobile?<img src={project.screenshotMobile} alt={project.name+' live website on mobile'} width="390" height="844" loading={priority?'eager':'lazy'} decoding="async"/>:fallback}</div>
  </div>;
}
export function ProjectBadges({project}){return <div className="project-badges">{project.techStack.map(t=><span key={t}>{t}</span>)}{project.hosting&&<span>{project.hosting}</span>}</div>;}
export function ClientCard({project,featured=false,index=0}){
  return <article className={`project-card ${featured?'featured-project':''}`} data-build={index?'duplicate':'box'}>
    <div className="project-visual"><DeviceMockup project={project}/><span className="client-ribbon">{featured?'Live in Iraq':'Happy Client'}</span></div>
    <div className="project-body"><div className="project-status"><span>{project.categoryBadge||project.category}</span>{project.verified&&<span><i/>Verified Live</span>}</div>
      <h3>{project.name} {featured&&<small>Iraq 🇮🇶</small>}</h3><p>{project.description}</p><ProjectBadges project={project}/>
      <div className="project-actions"><Link className={featured?'btn primary':'inline-link'} href={'/clients/'+project.slug}>View Case Study <ArrowRight size={16}/></Link><a className={featured?'btn inverse':'inline-link'} href={project.url} target="_blank" rel="noopener noreferrer">Visit Live Site <ArrowUpRight size={16}/></a></div>
    </div>
  </article>;
}
export function ClientGrid({projects,categories}){
  const [category,setCategory]=useState(categories[0]);
  const visible=projects.filter(p=>category===categories[0]||p.category===category||p.filters?.includes(category));
  return <><div className="filter-chips client-filters" aria-label="Project categories">{categories.map(c=><button type="button" key={c} className={category===c?'active':''} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="project-grid">{visible.map((project,index)=><ClientCard key={project.slug} project={project} index={index}/>)}</div></>;
}
