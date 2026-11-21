'use client';
import { useEffect, useRef, useState } from 'react';
import { Toolbar } from './Toolbar';

const team=[['Design','#b8a4ff'],['Code','#8bc8ff'],['SEO','#81e8b1'],['Ads','#ff9671'],['Umar','#ffaad8'],['UI','#ffd78e'],['Build','#98e3df'],['Web','#acb8ff'],['App','#ffe1b3']];
const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
const lerp=(a,b,t)=>a+(b-a)*t;

export function SwarmIntro({home=false}){
  const canvas=useRef(null), audio=useRef(null), controls=useRef({speed:1,tour:false,sound:false}), run=useRef(null);
  const [allowed,setAllowed]=useState(false), [headerVisible,setHeaderVisible]=useState(true), [live,setLive]=useState(false), [hidden,setHidden]=useState(false), [tour,setTour]=useState(false), [speed,setSpeed]=useState(1), [sound,setSound]=useState(false);
  function toggleSound(){
    const on=!controls.current.sound;
    if(on){
      try{audio.current??=new (window.AudioContext||window.webkitAudioContext)();audio.current.resume().catch(()=>{});}catch{return;}
    }
    controls.current.sound=on;setSound(on);
  }
  useEffect(()=>{controls.current.speed=speed;},[speed]);
  useEffect(()=>{controls.current.tour=tour;},[tour]);
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    function sync(){setAllowed(!preference.matches&&innerWidth>=760&&(navigator.hardwareConcurrency??4)>=4&&!navigator.connection?.saveData);}
    sync();preference.addEventListener('change',sync);window.addEventListener('resize',sync);
    return()=>{preference.removeEventListener('change',sync);window.removeEventListener('resize',sync);};
  },[]);
  useEffect(()=>()=>{if(audio.current){audio.current.close().catch(()=>{});audio.current=null;}},[]);
  useEffect(()=>{
    if(!allowed)return;
    const node=canvas.current, ctx=node.getContext('2d',{alpha:true});
    if(!ctx)return;
    const header=document.querySelector('[data-swarm-header]');
    const elements=[...(home?document.querySelectorAll('main [data-build]'):header?.querySelectorAll('[data-build]')||[])];
    if(!header||!elements.length)return;
    const observed=new Set(), visited=new WeakSet(), active=new Map();
    const pointer={x:innerWidth*.75,y:innerHeight*.56};
    const flock=team.map(()=>({x:innerWidth/2,y:innerHeight/2,vx:0,vy:0}));
    const mark=new Image();mark.src='/brand/mark-black.webp';
    let frame=0, start=0, previous=0, lastScroll=scrollY, velocity=0, playing=false, duration=850;
    function resize(){const dpr=Math.min(devicePixelRatio,1.5);node.width=innerWidth*dpr;node.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    function note(type,i){
      const ac=audio.current;
      if(!controls.current.sound||!ac||ac.state!=='running')return;
      const osc=ac.createOscillator(),gain=ac.createGain();osc.type=type==='text'?'triangle':'sine';
      osc.frequency.value=type==='text'?150+48*(i%4):[329.6,392,440,523.25,587.3][i%5];
      gain.gain.setValueAtTime(.0001,ac.currentTime);gain.gain.exponentialRampToValueAtTime(.04,ac.currentTime+.008);
      gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+(type==='text'?.05:.27));
      osc.connect(gain);gain.connect(ac.destination);osc.start();osc.stop(ac.currentTime+.3);
    }
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)observed.add(entry.target);else observed.delete(entry.target);}wake();},{threshold:.1});
    elements.forEach(el=>observer.observe(el));
    const headerObserver=new IntersectionObserver(([entry])=>setHeaderVisible(entry.isIntersecting),{threshold:0});
    headerObserver.observe(header);
    function cursor(x,y,i,style){
      const [name,color]=team[i];
      ctx.save();ctx.translate(x,y);ctx.strokeStyle=style==='guide'?'#ed745a':color;ctx.fillStyle=color;ctx.lineWidth=1.4;ctx.shadowColor='#14162966';ctx.shadowBlur=4;
      ctx.beginPath();
      if(style==='text'){ctx.moveTo(2,-7);ctx.lineTo(12,-7);ctx.moveTo(7,-7);ctx.lineTo(7,10);ctx.moveTo(2,10);ctx.lineTo(12,10);ctx.stroke();}
      else if(style==='box'){ctx.moveTo(-6,0);ctx.lineTo(9,0);ctx.moveTo(0,-6);ctx.lineTo(0,9);ctx.stroke();}
      else{ctx.moveTo(0,0);ctx.lineTo(16,6);ctx.lineTo(8,8);ctx.lineTo(5,15);ctx.closePath();ctx.fill();}
      ctx.shadowBlur=0;ctx.font='700 10px sans-serif';const w=ctx.measureText(name).width+12;ctx.beginPath();ctx.roundRect(13,10,w,18,4);ctx.fill();ctx.fillStyle='#171a2e';ctx.fillText(name,19,22.5);ctx.restore();
    }
    function stop({endTour=true}={}){
      playing=false;cancelAnimationFrame(frame);ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const el of elements) el.classList.remove('swarm-reveal','swarm-reveal-text');
      active.clear();setLive(false);if(endTour){controls.current.tour=false;setTour(false);}
    }
    function begin({replay=false,intro=true}={}){
      stop({endTour:replay});
      if(replay){window.scrollTo({top:0,behavior:'instant'});for(const el of elements)visited.delete(el);}
      duration=intro?850:0;playing=true;setLive(true);setHidden(false);start=performance.now();previous=start;
      frame=requestAnimationFrame(draw);
      if(intro)note('box',1);
    }
    function draw(now){
      if(!playing)return;
      const cfg=controls.current, width=innerWidth,height=innerHeight,dt=Math.min(34,now-previous);
      previous=now;ctx.clearRect(0,0,width,height);
      if(cfg.tour){window.scrollBy({top:dt*.26*cfg.speed,behavior:'instant'});if(scrollY+height>=document.documentElement.scrollHeight-2){controls.current.tour=false;setTour(false);}}
      velocity=lerp(velocity,Math.abs(scrollY-lastScroll)/(dt||1),.15);lastScroll=scrollY;
      const age=(now-start)*cfg.speed, intro=age<duration;
      if(intro){
        const r=header.getBoundingClientRect(), top=Math.max(0,r.top), bottom=Math.min(height,r.bottom);
        if(bottom>top){
          ctx.fillStyle=`rgba(250,249,246,${1-clamp((age-duration*.61)/(duration*.39),0,1)})`;ctx.fillRect(0,top,width,bottom-top);
          const x=width*.5,y=(top+bottom)/2;
          if(mark.complete&&mark.naturalWidth){ctx.globalAlpha=1-clamp((age-duration*.72)/(duration*.28),0,1);ctx.drawImage(mark,x-27,y-25,54,51);ctx.globalAlpha=1;}
        }
      }
      if(!intro){
        for(const el of observed){
          if(active.size>=4)break;if(visited.has(el))continue;
          visited.add(el);active.set(el,{progress:0,kind:el.dataset.build,lastTick:0});
          el.classList.add(el.dataset.build==='text'?'swarm-reveal-text':'swarm-reveal');el.style.setProperty('--build-duration',`${460/cfg.speed}ms`);
          note(el.dataset.build,active.size+1);
        }
      }
      const tasks=[];
      for(const [el,state] of active){
        state.progress+=dt*cfg.speed/500;const p=clamp(state.progress,0,1);
        const r=el.getBoundingClientRect(), x=r.left,y=r.top,w=r.width,h=r.height;
        if(p>=1||r.bottom<0||r.top>height){active.delete(el);el.classList.remove('swarm-reveal','swarm-reveal-text');continue;}
        const wx=w*p, hy=h*p;
        ctx.save();
        if(state.kind==='text'){
          // The selection grows over the real text; the canvas never holds SEO content.
          ctx.strokeStyle='#f57564';ctx.globalAlpha=1-p;ctx.beginPath();ctx.moveTo(x-11,0);ctx.lineTo(x-11,height);ctx.stroke();
          ctx.fillStyle='#f57564';for(let i=0;i<height;i+=12)ctx.fillRect(x-11,i,i%60===0?9:4,1);
          ctx.globalAlpha=.33*(1-p);ctx.fillStyle='#ffd9cb';ctx.fillRect(x,y,wx,Math.min(54,h));ctx.globalAlpha=1;
          if(Math.floor(p*12)%2===0){ctx.fillStyle='#b13c32';ctx.fillRect(x+wx,y+2,2,Math.min(31,h));}
          if(Math.floor(p*7)>state.lastTick){state.lastTick=Math.floor(p*7);note(state.lastTick===6?'box':'text',state.lastTick);}
          tasks.push({x:x+wx,y:y+Math.min(32,h),kind:'text'});
        }else{
          ctx.globalAlpha=1-p*.8;ctx.strokeStyle=state.kind==='duplicate'?'#f36d63':'#827afe';ctx.setLineDash(state.kind==='duplicate'?[4,3]:[]);
          if(state.kind==='line'){
            ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+wx,y);ctx.stroke();
            ctx.fillStyle='#f36d63';ctx.fillRect(x-2,y-2,4,4);ctx.fillRect(x+wx-2,y-2,4,4);
          }else{
            ctx.strokeRect(x,y,wx,hy);ctx.fillStyle='rgba(138,143,162,.14)';ctx.fillRect(x,y,wx,hy);
            const gap=parseFloat(getComputedStyle(el.parentElement).gap)||0;
            ctx.fillStyle=state.kind==='duplicate'?'#ab4536':'#272542';ctx.font='700 11px monospace';
            if(state.kind==='duplicate'){ctx.beginPath();ctx.moveTo(x-gap,y+hy);ctx.lineTo(x,y+hy);ctx.stroke();}
            ctx.fillText(state.kind==='duplicate'?'Alt · '+Math.round(gap)+' px':Math.round(wx)+' × '+Math.round(hy),x+8,y+hy+14);
          }
          tasks.push({x:x+wx,y:y+hy,kind:state.kind==='box'?'box':'guide'});
        }
        ctx.restore();
      }
      const r=header.getBoundingClientRect(), near=r.bottom>0&&r.top<height;
      const finale=home&&scrollY+height>=document.documentElement.scrollHeight-100;
      const count=intro?8:tasks.length?Math.min(team.length,5+Math.round(velocity*2)):finale?7:near&&age<duration+1000?5:0;
      const motion=now*.0016;
      for(let i=0;i<count;i++){
        const f=flock[i], t=motion+i*Math.PI*2/team.length, task=tasks[i];
        let tx,ty;
        if(intro){const go=clamp((age-duration*.55)/(duration*.45),0,1);tx=width/2+Math.cos(t)*(53+go*width*.35);ty=(Math.max(0,r.top)+Math.min(height,r.bottom))/2+Math.sin(t)*(42+go*height*.24);}
        else if(task){tx=task.x;ty=task.y;}
        else if(finale){tx=pointer.x+Math.cos(t)*(29+i*5);ty=pointer.y+Math.sin(t)*(23+i*4);}
        else {tx=width*.67+Math.cos(t)*width*.13;ty=Math.max(42,r.top+r.height*.5)+Math.sin(t)*72;}
        const dx=f.x-pointer.x,dy=f.y-pointer.y,dist=Math.hypot(dx,dy)||1;
        const repel=!finale&&dist<65?(65-dist)*.07:0;
        const neighbour=flock[(i+1)%count];
        f.vx=(f.vx+(tx-f.x)*.019+dx/dist*repel+neighbour.vx*.041)*.72;
        f.vy=(f.vy+(ty-f.y)*.019+dy/dist*repel+neighbour.vy*.041)*.72;
        f.x+=f.vx;f.y+=f.vy;cursor(f.x,f.y,i,task?.kind);
      }
      if(intro||count||active.size||observed.size&&[...observed].some(el=>!visited.has(el))||cfg.tour)frame=requestAnimationFrame(draw);
      else frame=0;
    }
    function wake(){if(playing&&!frame){previous=performance.now();frame=requestAnimationFrame(draw);}}
    const move=e=>{pointer.x=e.clientX;pointer.y=e.clientY;wake();};
    const scroll=()=>wake();
    const onKey=e=>{
      if(e.defaultPrevented||e.repeat||e.altKey||e.metaKey||e.ctrlKey||e.target?.closest('input,textarea,select,[contenteditable],dialog'))return;
      if(e.key==='Escape'){stop();setHidden(true);}
      if(e.key.toLowerCase()==='m')toggleSound();
    };
    resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('keydown',onKey);
    run.current={begin,stop,wake};
    let first=true;try{first=!sessionStorage.getItem('wdb-swarm-'+location.pathname);sessionStorage.setItem('wdb-swarm-'+location.pathname,'1');}catch{}
    if(first)begin();
    return()=>{stop();observer.disconnect();headerObserver.disconnect();run.current=null;window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);window.removeEventListener('keydown',onKey);};
  },[allowed,home]);
  useEffect(()=>{if(tour){if(!live)run.current?.begin({intro:false});run.current?.wake();}},[tour,live]);
  if(!allowed)return null;
  return <><canvas ref={canvas} className="swarm-canvas" aria-hidden="true"/>{(home||tour||headerVisible)&&(!hidden?<Toolbar tour={tour} setTour={setTour} speed={speed} setSpeed={setSpeed} sound={sound} toggleSound={toggleSound} live={live} replay={()=>run.current?.begin({replay:true})} skip={()=>{run.current?.stop();setHidden(true);}}/>:<button className="swarm-reopen" type="button" onClick={()=>run.current?.begin({replay:true})}>Replay intro</button>)}</>;
}
