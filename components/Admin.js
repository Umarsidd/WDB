'use client';
import { useEffect, useState } from 'react';
import { CalendarDays, Download, List, LogOut } from 'lucide-react';
import { dateKey } from '@/lib/booking';
import { slots } from '@/data/site';
import { money } from '@/data/packages';

const groups={leads:['new','contacted','won'],appointments:['pending','confirmed','completed','cancelled']};
async function api(path,{method='GET',body,signal}={}){
  const res=await fetch('/api/admin/'+path,{method,signal,cache:'no-store',headers:{'Content-Type':'application/json','X-WDB-Request':'1'},body:body?JSON.stringify(body):undefined});
  if(res.status===204)return null;
  const value=await res.json().catch(()=>null);
  if(!res.ok){const err=Error(value?.error||'The admin API is unavailable.');err.status=res.status;throw err;}
  return value;
}
function Calendar({month,rows}){
  const [year,m]=month.split('-').map(Number);
  const start=new Date(Date.UTC(year,m-1,1)).getUTCDay();
  const length=new Date(Date.UTC(year,m,0)).getUTCDate();
  return <div className="calendar-grid" aria-label={'Appointments for '+month}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=><span key={x}>{x}</span>)}{Array.from({length:start},(_,i)=><div key={'padding-'+i}/>)}{Array.from({length},(_,i)=>{
    const key=month+'-'+String(i+1).padStart(2,'0');
    return <div key={key}><strong>{i+1}</strong>{rows.filter(row=>row.date===key).map(row=><small key={row._id}>{row.name} · {slots.find(s=>s.id===row.slot)?.label} · {row.status}</small>)}</div>;
  })}</div>;
}
function Row({row,appointment,onSave}){
  const [status,setStatus]=useState(row.status),[date,setDate]=useState(row.date),[slot,setSlot]=useState(row.slot),[notes,setNotes]=useState(row.notes||''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function save(){setError('');setBusy(true);try{await onSave(row._id,{status,notes,...(appointment?{date,slot}:{})});}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <tr><td><strong>{row.name}</strong><br/>{row.phone}<br/>{row.email}{appointment&&<><br/>{row.id}</>}</td><td>{row.service}{row.packageName&&<><br/>{row.packageName}</>}{row.business&&<><br/>{row.business}</>}{row.budget&&<><br/>{row.budget}</>}{row.message&&<p>{row.message}</p>}{row.cart?.length>0&&<details><summary>Quote Cart ({row.cart.length})</summary>{row.cart.map(x=><p key={x.slug}>{x.name} × {x.quantity} · {x.amount===null?'Get Quote':money(x.amount)+(x.startsAt&&!x.unit?'+':'')+' '+(x.unit||x.billing)}</p>)}</details>}</td>
  {appointment&&<td>{row.type}<label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>Time slot<select value={slot} onChange={e=>setSlot(e.target.value)}>{slots.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label></td>}
  <td><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{groups[appointment?'appointments':'leads'].map(s=><option key={s}>{s}</option>)}</select></label></td><td><label>Notes<textarea value={notes} maxLength={2000} onChange={e=>setNotes(e.target.value)}/></label><button className="btn primary" type="button" disabled={busy} onClick={save}>{busy?'Saving…':'Save'}</button>{error&&<p className="form-error" role="alert">{error}</p>}</td></tr>;
}
export function Admin(){
  const [session,setSession]=useState(undefined),[kind,setKind]=useState('leads'),[mode,setMode]=useState('list'),[month,setMonth]=useState(''),[page,setPage]=useState(1),[status,setStatus]=useState(''),[search,setSearch]=useState(''),[rows,setRows]=useState([]),[total,setTotal]=useState(0),[error,setError]=useState(''),[busy,setBusy]=useState(false),[refresh,setRefresh]=useState(0);
  useEffect(()=>{const c=new AbortController();setMonth(dateKey().slice(0,7));api('session',{signal:c.signal}).then(setSession).catch(e=>{if(e.name!=='AbortError')setSession(null);});return()=>c.abort();},[]);
  const calendar=kind==='appointments'&&mode==='calendar';
  const filters=new URLSearchParams({status,search,...(calendar&&month?{month}:{})}).toString();
  useEffect(()=>{
    if(!session)return;
    const controller=new AbortController();
    setError('');setBusy(true);
    api(kind+'?'+filters+'&page='+page,{signal:controller.signal}).then(v=>{setRows(v.rows);setTotal(v.total);}).catch(e=>{
      if(e.name==='AbortError')return;if(e.status===401)setSession(null);else setError(e.message);
    }).finally(()=>{if(!controller.signal.aborted)setBusy(false);});
    return()=>controller.abort();
  },[session,kind,filters,page,refresh]);
  async function login(event){
    event.preventDefault();setError('');setBusy(true);
    const body=Object.fromEntries(new FormData(event.currentTarget));
    try{setSession(await api('login',{method:'POST',body}));}catch(e){setError(e.message);}finally{setBusy(false);}
  }
  async function logout(){try{await api('logout',{method:'POST'});setSession(null);setRows([]);setTotal(0);setError('');}catch(e){setError(e.message);}}
  function changeKind(value){setKind(value);setPage(1);setStatus('');setRows([]);setMode('list');}
  async function save(id,body){try{await api(kind+'/'+id,{method:'PATCH',body});setRefresh(n=>n+1);}catch(e){if(e.status===401)setSession(null);throw e;}}
  if(session===undefined)return <p>Checking your session…</p>;
  if(!session)return <section className="form-card admin-login"><h2>Sign in</h2><form onSubmit={login}><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Password<input name="password" type="password" required autoComplete="current-password"/></label>{error&&<p role="alert" className="form-error">{error}</p>}<button className="btn primary" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form></section>;
  return <section className="admin-card"><div className="link-row"><h2>Dashboard</h2><button className="btn ghost ml-auto" onClick={logout}><LogOut size={16}/>Sign out</button></div>
    <div className="filter-chips mt-4">{[['leads','Leads & Quotes'],['appointments','Appointments']].map(([value,label])=><button className={kind===value?'active':''} aria-pressed={kind===value} onClick={()=>changeKind(value)} key={value}>{label}</button>)}</div>
    <div className="admin-tools"><label>Search<input type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></label><label>Status<select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="">All statuses</option>{groups[kind].map(s=><option key={s}>{s}</option>)}</select></label>
      {kind==='appointments'&&<><button className="btn ghost" type="button" onClick={()=>{setMode(calendar?'list':'calendar');setPage(1);}}>{calendar?<List size={16}/>:<CalendarDays size={16}/>} {calendar?'List':'Calendar'}</button>{calendar&&<label>Month<input type="month" value={month} onChange={e=>{if(e.target.value)setMonth(e.target.value);setPage(1);}}/></label>}</>}
      <a className="btn ghost" href={'/api/admin/'+kind+'/csv?'+filters}><Download size={16}/>Export CSV</a></div>
    {error&&<p className="form-error" role="alert">{error}</p>}
    {busy?<p role="status">Loading records…</p>:<><p className="muted">{total} {total===1?'record':'records'}</p>{calendar&&month&&<Calendar month={month} rows={rows}/>}
    {rows.length>0&&<div className="table-scroll"><table className="admin-table"><thead><tr><th>Contact</th><th>Request</th>{kind==='appointments'&&<th>Appointment</th>}<th>Status</th><th>Notes</th></tr></thead><tbody>{rows.map(row=><Row key={row._id+':'+row.updatedAt} row={row} appointment={kind==='appointments'} onSave={save}/>)}</tbody></table></div>}
    {total>50&&<div className="link-row mt-3"><button className="btn ghost" disabled={page===1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page}</span><button className="btn ghost" disabled={page*50>=total} onClick={()=>setPage(page+1)}>Next</button></div>}</>}
  </section>;
}
