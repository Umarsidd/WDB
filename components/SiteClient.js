'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Menu, Phone, ShoppingBag, Trash2, X } from 'lucide-react';
import { services } from '@/data/services';
import { site, languages, whatsapp } from '@/data/site';
import { findPackage, money, priceLabel } from '@/data/packages';
import { estimate, readCart } from '@/lib/cart';
import { Brand, WhatsAppIcon, categoryPrice, iconMap } from './UI';

const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);
export function SiteProvider({children}){
  const [cart,setCart]=useState([]), [ready,setReady]=useState(false), [cartOpen,setCartOpen]=useState(false), [language,setLanguage]=useState('en');
  useEffect(()=>{try{setCart(readCart(JSON.parse(localStorage.getItem('wdb-cart')||'[]')));if(localStorage.getItem('wdb-lang')==='hi')setLanguage('hi');}catch{}setReady(true);},[]);
  useEffect(()=>{if(ready){try{localStorage.setItem('wdb-cart',JSON.stringify(cart)); localStorage.setItem('wdb-lang',language);}catch{}}},[cart,language,ready]);
  function add(lines,open=true){setCart(existing=>readCart([...existing.filter(x=>!lines.some(y=>x.slug===y.slug)),...lines]));if(open)setCartOpen(true);}
  function remove(slug){setCart(existing=>existing.filter(x=>x.slug!==slug));}
  return <SiteContext.Provider value={{cart,add,remove,ready,setCartOpen,language,setLanguage}}>{children}<QuoteCart open={cartOpen} onClose={()=>setCartOpen(false)}/></SiteContext.Provider>;
}
export function Drawer({open,onClose,title,children}){
  const ref=useRef(null);
  useEffect(()=>{const d=ref.current;if(open&&!d.open)d.showModal();else if(!open&&d.open)d.close();},[open]);
  return <dialog ref={ref} className="drawer" aria-label={title} onClose={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="drawer-body"><div className="drawer-head"><h2>{title}</h2><button className="icon-btn" type="button" aria-label="Close" onClick={onClose}><X size={20}/></button></div>{children}</div>
  </dialog>;
}
const nav=[
  ['Home','/',true],
  ['About Us','/about'],
  ['Our Projects','/clients'],
  ['Blogs','/blogs'],
  ['Contact Us','/contact'],
  ['Technical Support','/contact#enquiry'],
];
export function Navbar(){
  const {cart,setCartOpen}=useSite(), path=usePathname();
  const [open,setOpen]=useState(false), menu=useRef(null);
  useEffect(()=>{setOpen(false);if(menu.current)menu.current.open=false;},[path]);
  useEffect(()=>{
    const close=e=>{if(menu.current&&(e.key==='Escape'||(e.type==='pointerdown'&&!menu.current.contains(e.target))))menu.current.open=false;};
    document.addEventListener('pointerdown',close);document.addEventListener('keydown',close);
    return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',close);};
  },[]);
  return <header className="site-header"><div className="shell nav-shell"><Brand dark/>
    <nav id="main-navigation" className={`nav-links ${open?'is-open':''}`} aria-label="Main navigation">
      {nav.slice(0,1).map(([label,url])=><Link className={path===url?'nav-current':undefined} href={url} key={label}>{label}</Link>)}
      {nav.slice(1,2).map(([label,url])=><Link className={path.startsWith(url)?'nav-current':undefined} href={url} key={label}>{label}</Link>)}
      <details className="mega" ref={menu}><summary className={path.startsWith('/services')?'nav-current':''}>Services<ChevronDown size={13}/></summary>
      <div className="mega-panel"><Link className="mega-all" href="/services" lang={language}>Browse all services <ArrowRight size={16}/></Link><div>{services.map(s=>{const Icon=iconMap[s.icon];return <Link href={'/services/'+s.slug} key={s.slug} onClick={()=>{menu.current.open=false;setOpen(false);}}><span className={'service-icon tone-'+s.color}><Icon size={19}/></span><span><strong>{s.name}</strong><small>{categoryPrice(s)}</small></span></Link>;})}</div></div></details>
      {nav.slice(2).map(([label,url])=><Link className={path.startsWith(url.split('#')[0])?'nav-current':undefined} aria-current={path===url.split('#')[0]?'page':undefined} href={url} key={label}>{label}</Link>)}
    </nav>
    <div className="nav-actions"><a className="nav-call" href="tel:+918240740018"><Phone size={16}/>Call: 8240740018</a>
      <button type="button" className="icon-btn bag-btn mobile-bag" onClick={()=>setCartOpen(true)} aria-label={`Quote Cart, ${cart.length} items`}><ShoppingBag size={19}/><span>{cart.length}</span></button>
      <button type="button" className="icon-btn mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button>
    </div></div></header>;
}
export function Estimate({lines}){
  const value=estimate(lines);
  const labels={'one-time':'one-time',month:'/ month',campaign:'/ campaign',year:'/ year'};
  return <div className="estimate"><strong>Estimated total</strong>{Object.keys(labels).map(k=>value[k]>0&&<span key={k}>{money(value[k])} <small>{labels[k]}</small></span>)}{!Object.keys(labels).some(k=>value[k]>0)&&<span>{value.custom?'Get Quote':'₹0'}</span>}{(value.minimum||value.custom)&&<small>{value.minimum?'Includes starting prices. ':''}{value.custom?'Some items require a custom quote.':''}</small>}</div>;
}
export function QuoteCart({open,onClose}){
  const {cart,add,remove}=useSite();
  return <Drawer open={open} onClose={onClose} title="Quote Cart">
    {cart.length?<><ul className="cart-list">{cart.map(line=>{const p=findPackage(line.category,line.slug);return <li key={line.slug}><div><strong>{p.name}</strong><small>{priceLabel(p)}</small>{p.category==='add-ons'&&<label>Quantity <input type="number" min="1" max="50" value={line.quantity} onChange={e=>add([{...line,quantity:Number(e.target.value)}],false)}/></label>}</div><button type="button" className="icon-btn" aria-label={'Remove '+p.name} onClick={()=>remove(line.slug)}><Trash2 size={18}/></button></li>;})}</ul>
    <Estimate lines={cart}/><p className="muted">Send one quote request for your selection. No online payment.</p><div className="stack"><Link className="btn primary" href="/contact?quote=1#enquiry" onClick={onClose}>Request a Quote <ArrowUpRight size={16}/></Link><Link className="btn ghost" href="/book-appointment?quote=1" onClick={onClose}>Book Appointment <CalendarDays size={17}/></Link></div></>:<div className="empty"><ShoppingBag size={32}/><h3>Your Quote Cart is empty</h3><p>Choose a package or add-on to start your estimate.</p><Link className="btn primary" href="/services" onClick={onClose}>Explore services <ArrowRight size={16}/></Link></div>}
  </Drawer>;
}
export function WhatsAppFab(){
  return <><a href={whatsapp()} target="_blank" rel="noopener noreferrer" className="whatsapp-fab" aria-label="Chat with WDB on WhatsApp"><WhatsAppIcon size={27}/></a><nav className="mobile-bar" aria-label="Quick contact">
    <a href={'tel:+91'+site.phone}><Phone size={17}/>Call</a><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={19}/>WhatsApp</a><Link href="/book-appointment"><CalendarDays size={17}/>Book</Link></nav></>;
}
