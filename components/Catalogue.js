'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Layers3, Search, SlidersHorizontal, ShoppingBag, X, Monitor, Code2, BarChart3 } from 'lucide-react';
import { addonPackages, enquiryHref, money, packageHref, priceLabel } from '@/data/packages';
import { Drawer, Estimate, useSite } from './SiteClient';

export function PackageCard({plan:p,compare,onCompare,index=0,illustrated=false}){
  const {add}=useSite();
  return <article className={`package-card package-${p.color}`} data-build={index?'duplicate':'box'}>
    <div className="package-top">{p.popular&&<span className="popular">MOST POPULAR</span>}<h3><Link href={packageHref(p)}>{p.name}</Link></h3>{p.bestFor&&<p>{p.bestFor}</p>}</div>
    <div className="package-inner">{illustrated&&<div className="plan-illustration" aria-hidden="true"><span><Monitor size={52}/><Code2 size={27}/><BarChart3 size={30}/></span></div>}<strong className="package-price">{p.amount===null?'Get Quote':<>{money(p.amount)}{p.startsAt&&!p.unit?'+':''} <small>{p.unit||(p.billing==='one-time'?'':'/ '+p.billing)}</small></>}</strong>
      {p.features.length>0&&<ul className="checks">{(illustrated?p.features:p.features.slice(0,5)).map(f=><li key={f}><Check size={15}/>{f}</li>)}</ul>}
      <div className="package-actions"><Link className="btn plan-btn" href={enquiryHref(p)}>{p.cta}<ArrowUpRight size={16}/></Link>
      <div><Link className="inline-link" href={packageHref(p)}>View package <ArrowRight size={13}/></Link><button className="icon-btn" type="button" aria-label={'Add '+p.name+' to Quote Cart'} onClick={()=>add([{category:p.category,slug:p.slug,quantity:1}])}><ShoppingBag size={17}/></button></div>
      {onCompare&&<label className="compare-check"><input type="checkbox" checked={compare} onChange={()=>onCompare(p)}/> Compare</label>}</div>
    </div>
  </article>;
}
export function PackageTabs({tabs,active,onChange}){
  return <div className="filter-chips" aria-label="Website package filters">{['All',...tabs].map(tab=><button className={active===tab?'active':''} aria-pressed={active===tab} key={tab} onClick={()=>onChange(tab)}>{tab}</button>)}</div>;
}
export function CompareDrawer({open,close,plans}){
  const features=[...new Set(plans.flatMap(p=>p.features))];
  return <Drawer open={open} onClose={close} title="Compare packages"><div className="table-scroll"><table className="compare-table"><thead><tr><th scope="col">Feature</th>{plans.map(p=><th scope="col" key={p.slug}><Link href={packageHref(p)}>{p.name}</Link></th>)}</tr></thead>
    <tbody><tr><th scope="row">Price</th>{plans.map(p=><td key={p.slug}>{priceLabel(p)}</td>)}</tr><tr><th scope="row">Best for</th>{plans.map(p=><td key={p.slug}>{p.bestFor||'—'}</td>)}</tr>{features.map(f=><tr key={f}><th scope="row">{f}</th>{plans.map(p=><td key={p.slug}>{p.features.includes(f)?<Check size={16} aria-label="Included"/>:'—'}</td>)}</tr>)}</tbody></table></div></Drawer>;
}
export function Catalogue({plans,website}){
  const [search,setSearch]=useState(''),[sort,setSort]=useState('popular'),[min,setMin]=useState(''),[max,setMax]=useState(''),[best,setBest]=useState(''),[billing,setBilling]=useState(''),[tab,setTab]=useState('All'),[filters,setFilters]=useState(false),[selected,setSelected]=useState([]),[compare,setCompare]=useState(false),[compareNotice,setCompareNotice]=useState('');
  const tabs=plans.map(p=>p.tab).filter(Boolean);
  const visible=plans.filter(p=>{
    const query=search.trim().toLowerCase();
    return (!query||[p.name,p.bestFor,...p.features].join(' ').toLowerCase().includes(query))&&
      (!min||(p.amount!==null&&p.amount>=Number(min)))&&(!max||(p.amount!==null&&p.amount<=Number(max)))&&(!best||p.bestFor===best)&&(!billing||p.billing===billing)&&(tab==='All'||p.tab===tab);
  }).sort((a,b)=>sort==='low'?(a.amount??Infinity)-(b.amount??Infinity):sort==='high'?(b.amount??-1)-(a.amount??-1):Number(!!b.popular)-Number(!!a.popular));
  function select(p){if(selected.some(x=>x.slug===p.slug)){setSelected(selected.filter(x=>x.slug!==p.slug));setCompareNotice('');}else if(selected.length<3){setSelected([...selected,p]);setCompareNotice('');}else setCompareNotice('You can compare up to 3 packages.');}
  function clear(){setMin('');setMax('');setBest('');setBilling('');setTab('All');setSearch('');}
  const fields=<><label>Minimum price (₹)<input type="number" min="0" step="1" value={min} onChange={e=>setMin(e.target.value)} placeholder="Any price"/></label><label>Maximum price (₹)<input type="number" min="0" step="1" value={max} onChange={e=>setMax(e.target.value)} placeholder="Any price"/></label><label>Best for<select value={best} onChange={e=>setBest(e.target.value)}><option value="">All businesses</option>{[...new Set(plans.map(p=>p.bestFor).filter(Boolean))].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Billing type<select value={billing} onChange={e=>setBilling(e.target.value)}><option value="">All billing types</option>{[['one-time','One-time'],['month','Monthly'],['campaign','Per campaign'],['year','Yearly']].map(([v,t])=><option value={v} key={v}>{t}</option>)}</select></label>
    <button className="btn ghost" type="button" onClick={clear}>Clear filters</button></>;
  return <div className="catalogue shell section">
    <aside className="filter-panel"><h2><SlidersHorizontal size={19}/> Filters</h2>{fields}</aside>
    <div className="catalogue-main">{website&&<PackageTabs tabs={tabs} active={tab} onChange={setTab}/>}
      <div className="catalogue-toolbar"><label className="search"><Search size={17}/><input aria-label="Search packages" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search packages"/></label>
      <button className="btn ghost mobile-filters" type="button" onClick={()=>setFilters(true)}><SlidersHorizontal size={17}/> Filters</button>
      <label className="sort">Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Popularity</option><option value="low">Price low → high</option><option value="high">Price high → low</option></select></label></div>
      <p className="muted" aria-live="polite">{visible.length} {visible.length===1?'package':'packages'}</p>
      {visible.length?<div className="package-grid">{visible.map((p,index)=><PackageCard key={p.slug} plan={p} compare={selected.some(s=>s.slug===p.slug)} onCompare={select} index={index}/>)}</div>:<div className="empty"><h3>No matching packages</h3><button onClick={clear} className="btn ghost">Clear filters</button></div>}
    </div>
    <Drawer open={filters} onClose={()=>setFilters(false)} title="Filters"><div className="stack">{fields}<button className="btn primary" onClick={()=>setFilters(false)}>Show {visible.length} packages</button></div></Drawer>
    {selected.length>0&&<div className="compare-bar"><span role="status">{compareNotice||selected.length+' / 3 selected'}</span><button className="btn primary" type="button" onClick={()=>setCompare(true)}><Layers3 size={16}/> Compare</button><button className="icon-btn" aria-label="Clear comparison" onClick={()=>{setSelected([]);setCompareNotice('');}}><X size={17}/></button></div>}
    <CompareDrawer open={compare} close={()=>setCompare(false)} plans={selected}/>
  </div>;
}
export function PackageEstimate({plan}){
  const {add}=useSite(), [selected,setSelected]=useState({});
  const lines=[{category:plan.category,slug:plan.slug,quantity:1},...addonPackages.filter(p=>selected[p.slug]).map(p=>({category:p.category,slug:p.slug,quantity:selected[p.slug]}))];
  return <div className="estimate-builder"><h2>Build your quote</h2>{addonPackages.some(p=>p.slug!==plan.slug)&&<fieldset className="addon-options"><legend>Optional add-ons</legend>{addonPackages.filter(p=>p.slug!==plan.slug).map(p=><div className="addon-row" key={p.slug}><label><input type="checkbox" checked={Boolean(selected[p.slug])} onChange={e=>setSelected({...selected,[p.slug]:e.target.checked?1:0})}/><span>{p.name}<small>{priceLabel(p)}</small></span></label>{selected[p.slug]>0&&<input aria-label={'Quantity for '+p.name} type="number" min="1" max="50" value={selected[p.slug]} onChange={e=>setSelected({...selected,[p.slug]:Math.max(1,Math.min(50,Math.trunc(Number(e.target.value))||1))})}/>}</div>)}</fieldset>}
    <Estimate lines={lines}/><button className="btn primary" type="button" onClick={()=>add(lines)}><ShoppingBag size={18}/> Add to Quote Cart</button>
  </div>;
}
