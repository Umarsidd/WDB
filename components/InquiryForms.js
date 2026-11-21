'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, CircleCheck, Download, Send } from 'lucide-react';
import { appointmentTypes, booking, site, slots } from '@/data/site';
import { services } from '@/data/services';
import { findPackage, packages, priceLabel } from '@/data/packages';
import { bookingBounds, bookableDate, calendarLinks, formatDate } from '@/lib/booking';
import { Estimate, useSite } from './SiteClient';
import { WhatsAppLink } from './UI';

const categories=[...services.map(s=>[s.slug,s.form||s.name]),['other','Other']];
function FormField({label,children,wide=false}){return <label className={wide?'field-span':undefined}>{label}{children}</label>;}
function BookingResult({item}){
  const {google,ics}=calendarLinks(item),slot=slots.find(s=>s.id===item.slot);
  const note=`Hello WDB, I booked an appointment (${item.id}) for ${item.service} on ${formatDate(item.date)}, ${slot.label} IST.`;
  return <section className="booking-result" aria-live="polite"><div className="form-success">Appointment request received</div><p><strong>Booking ID:</strong> {item.id}</p><p><strong>Date:</strong> {formatDate(item.date)}</p><p><strong>Time:</strong> {slot.label} (Asia/Kolkata)</p><p><strong>Service:</strong> {item.service}</p><p>Your appointment is pending confirmation.{item.emailed?' Check your email for the details.':''}</p>
  <div className="link-row"><a className="btn primary" href={google} target="_blank" rel="noopener noreferrer"><CalendarDays size={16}/>Add to Google Calendar</a><a className="btn ghost" href={ics} download={item.id+'.ics'}><Download size={16}/>Download .ics</a><WhatsAppLink message={note}>Message on WhatsApp</WhatsAppLink></div></section>;
}
function IntakeForm({isAppointment=false,initialCategory='',initialPackage='',map}){
  const {cart,ready}=useSite();
  const [selection,setSelection]=useState({category:initialCategory,slug:initialPackage}),[initialized,setInitialized]=useState(false);
  const [date,setDate]=useState(''),[slot,setSlot]=useState(''),[availability,setAvailability]=useState({date:'',state:'idle',slots:[]}),[refresh,setRefresh]=useState(0),
    [busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState(null);
  const [bounds,setBounds]=useState({});
  useEffect(()=>{setBounds(bookingBounds());},[]);
  useEffect(()=>{
    if(!ready||initialized)return;
    const main=cart.find(line=>line.category!=='add-ons')||cart[0];
    if(!initialCategory&&main)setSelection({category:main.category,slug:main.slug});
    setInitialized(true);
  },[cart,initialized,initialCategory,ready]);
  useEffect(()=>{
    if(!isAppointment||!date||!bookableDate(date))return;
    const controller=new AbortController();
    fetch('/api/appointments/availability?date='+date,{signal:controller.signal}).then(async r=>{
      if(!r.ok)throw Error();
      const data=await r.json();
      setAvailability({date,state:'ready',slots:data.slots});
    }).catch(err=>{if(err.name!=='AbortError')setAvailability({date,state:'error',slots:[]});});
    return()=>controller.abort();
  },[date,refresh,isAppointment]);
  const {category,slug}=selection;
  const matching=packages.filter(p=>p.category===category);
  const selectedPlan=findPackage(category,slug);
  const activeAvailability=date!==availability.date?{state:'loading',slots:[]}:availability;
  const validDate=Boolean(date&&bookableDate(date));
  async function submit(event){
    event.preventDefault();
    if(busy)return;
    const data=Object.fromEntries(new FormData(event.currentTarget));
    setError('');setBusy(true);
    try{
      const r=await fetch(isAppointment?'/api/appointments':'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,consent:data.consent==='on',cart})});
      const resp=await r.json().catch(()=>null);
      if(!r.ok||!resp?.id){
        if(r.status===409&&isAppointment){setSlot('');setAvailability({date:'',state:'idle',slots:[]});setRefresh(n=>n+1);}
        throw Error(resp?.error||'The service is temporarily unavailable. Please try again or contact us on WhatsApp.');
      }
      setResult(resp);
    }catch(err){setError(err.message==='Failed to fetch'?'Unable to connect. Please try again or contact us on WhatsApp.':err.message);}
    finally{setBusy(false);}
  }
  return <div className="form-layout">
    <section className="form-card" id={isAppointment?'appointment':'enquiry'}><h2>{isAppointment?'Your appointment details':'Tell us what you need'}</h2>
    {result?(isAppointment?<BookingResult item={result}/>:<div className="stack"><div className="form-success" role="status"><CircleCheck size={17}/> Your enquiry has been sent.</div><WhatsAppLink message={'Hello WDB, I sent an enquiry'+(selectedPlan?' about '+selectedPlan.name:'')+'. My reference is '+result.id+'.'}>Continue on WhatsApp</WhatsAppLink></div>):
    <form onSubmit={submit}><div className="form-fields">
      <FormField label={isAppointment?'Full name':'Name'}><input name="name" required minLength={2} maxLength={100} autoComplete="name"/></FormField>
      <FormField label="Phone (+91)"><input name="phone" type="tel" required maxLength={22} autoComplete="tel" placeholder="+91"/><span className="field-hint">Indian mobile number</span></FormField>
      <FormField label="Email"><input name="email" type="email" required maxLength={150} autoComplete="email"/></FormField>
      <FormField label="Service category"><select name="category" value={category} required onChange={e=>{setSelection({category:e.target.value,slug:''});setInitialized(true);}}><option value="">Select a category</option>{categories.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></FormField>
      <FormField label="Package"><select name="package" value={slug} disabled={!matching.length} onChange={e=>setSelection({category,slug:e.target.value})}><option value="">No package selected</option>{matching.map(p=><option key={p.slug} value={p.slug}>{p.name} – {priceLabel(p)}</option>)}</select></FormField>
      {isAppointment&&<><FormField label="Appointment type"><select required name="type" defaultValue=""><option value="">Select a type</option>{appointmentTypes.map(type=><option key={type}>{type}</option>)}</select></FormField>
      <FormField label="Preferred date"><input name="date" type="date" required min={bounds.min} max={bounds.max} value={date} onChange={e=>{setDate(e.target.value);setSlot('');setAvailability({date:'',state:'idle',slots:[]});}}/>{date&&!validDate&&<span className="field-hint">This date is outside the booking window or the office is closed.</span>}</FormField>
      <FormField label="Preferred time slot"><select name="slot" required disabled={!validDate||activeAvailability.state!=='ready'||!activeAvailability.slots.length} value={slot} onChange={e=>setSlot(e.target.value)}><option value="">Select a time slot</option>{slots.filter(s=>activeAvailability.slots.includes(s.id)).map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
        <span className="field-hint" aria-live="polite">{validDate?(activeAvailability.state==='loading'?'Checking availability…':activeAvailability.state==='error'?'Availability could not be checked.':activeAvailability.slots.length?'India Standard Time (IST)':'No slots available on this date.'):'India Standard Time (IST)'}</span></FormField>
      <FormField label="Business name (optional)"><input name="business" maxLength={120} autoComplete="organization"/></FormField></>}
      <FormField label={isAppointment?'Budget range':'Budget'}><select name="budget" defaultValue=""><option value="">Select a budget</option>{booking.budgets.map(b=><option key={b}>{b}</option>)}</select></FormField>
      <FormField label="Message" wide><textarea required={!isAppointment} name="message" rows="4" maxLength={2000}/></FormField>
    </div>
    <label className="honeypot" aria-hidden="true">Leave this field empty <input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="consent"><input name="consent" type="checkbox" required/> I agree that WDB may contact me about this request.</label>
    {error&&<div className="form-error" role="alert">{error}</div>}
    {isAppointment&&validDate&&activeAvailability.state==='error'&&<button type="button" className="btn ghost" onClick={()=>{setAvailability({date:'',state:'idle',slots:[]});setRefresh(n=>n+1);}}>Retry availability</button>}
    <button type="submit" className="btn primary" disabled={busy||(isAppointment&&(!slot||!validDate||activeAvailability.state!=='ready'))}>{isAppointment?<CalendarDays size={17}/>:<Send size={16}/>} {busy?'Submitting…':isAppointment?'Book Appointment':cart.length?'Submit Quote Request':'Send Enquiry'}<ArrowUpRight size={16}/></button>
    </form>}
    </section>
    <div className="form-aside"><section className="content-card"><h2>{isAppointment?'Appointment summary':'Enquiry summary'}</h2>
      <dl className="side-note"><dt>Service</dt><dd>{categories.find(([id])=>id===category)?.[1]||'Choose a service category'}</dd>
      {selectedPlan&&<><dt>Package</dt><dd>{selectedPlan.name} · {priceLabel(selectedPlan)}</dd></>}{date&&isAppointment&&<><dt>Preferred date</dt><dd>{formatDate(date)}</dd></>}{slot&&isAppointment&&<><dt>Preferred time</dt><dd>{slots.find(s=>s.id===slot)?.label} (Asia/Kolkata)</dd></>}</dl>
      {cart.length>0&&<><h3 className="mt-4">Quote Cart</h3><ul className="mt-2 list-disc pl-5">{cart.map(item=><li key={item.slug}>{findPackage(item.category,item.slug)?.name} × {item.quantity}</li>)}</ul><Estimate lines={cart}/></>}
      {!isAppointment&&<div className="link-row profile-links"><a className="inline-link" href={'tel:+91'+site.phone}>+91 {site.phone}</a><a className="inline-link" href={'mailto:'+site.email}>{site.email}</a></div>}
    </section>{map}</div>
  </div>;
}
export function EnquiryForm(props){return <IntakeForm {...props}/>;}
export function AppointmentForm(props){return <IntakeForm {...props} isAppointment/>;}
