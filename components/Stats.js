'use client';
import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
function Counter({value,label}){
  const item=useRef(null), number=useRef(null), shown=useInView(item,{once:true}), reduced=useReducedMotion();
  const format=n=>Math.round(n).toLocaleString('en-US')+'+';
  useEffect(()=>{if(!shown||reduced)return;const run=animate(0,value,{duration:.75,onUpdate:x=>{if(number.current)number.current.textContent=format(x);}});return()=>run.stop();},[shown,reduced,value]);
  return <div ref={item}><strong aria-hidden="true" ref={number}>{format(value)}</strong><span><span className="sr-only">{format(value)} </span>{label}</span></div>;
}
export function Stats({items}){return <div className="stats-grid">{items.map(([n,t])=><Counter key={t} value={n} label={t}/>)}</div>;}
