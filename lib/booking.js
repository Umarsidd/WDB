import { booking, slots } from '../data/site.js';
const day = 86400000;
const parts = new Intl.DateTimeFormat('en-CA',{timeZone:booking.timezone,year:'numeric',month:'2-digit',day:'2-digit'});
export function dateKey(date = new Date()){return parts.format(date);}
export function parseDay(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const d=new Date(value+'T00:00:00Z');
  return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===value?d:null;
}
export function bookingBounds(now = new Date()){
  const min=dateKey(now);
  return {min,max:new Date(+parseDay(min)+booking.horizon*day).toISOString().slice(0,10)};
}
export function bookableDate(date, now = new Date()){
  const parsed=parseDay(date), {min,max}=bookingBounds(now);
  return Boolean(parsed&&date>=min&&date<=max&&!booking.closedWeekdays.includes(parsed.getUTCDay())&&!booking.closedDates.includes(date));
}
export function upcomingSlot(date,slot,now=new Date()){
  const time=slot?.start;
  return Boolean(time&&parseDay(date)&&new Date(date+'T'+time.slice(0,2)+':'+time.slice(2,4)+':00+05:30')>now);
}
const simpleDate=new Intl.DateTimeFormat('en-IN',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'});
export function formatDate(date){const parsed=parseDay(date);return parsed?simpleDate.format(parsed):date;}
export function calendarLinks(item){
  const slot=slots.find(s=>s.id===item.slot);
  const compact=item.date.replaceAll('-','');
  const title='WDB consultation · '+item.service;
  const safe=text=>String(text).replaceAll('\\','\\\\').replaceAll('\r','').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
  const utc=time=>new Date(item.date+'T'+time.slice(0,2)+':'+time.slice(2,4)+':00+05:30').toISOString().replace(/[-:]|\.\d{3}/g,'');
  const query=new URLSearchParams({action:'TEMPLATE',text:title,dates:compact+'T'+slot.start+'/'+compact+'T'+slot.end,ctz:booking.timezone,details:'Booking ID: '+item.id});
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WDB//Appointment//EN','BEGIN:VEVENT','UID:'+safe(item.id)+'@wdb','DTSTAMP:'+new Date().toISOString().replace(/[-:]|\.\d{3}/g,''),'DTSTART:'+utc(slot.start),'DTEND:'+utc(slot.end),'SUMMARY:'+safe(title),'DESCRIPTION:'+safe('Booking ID: '+item.id),'END:VEVENT','END:VCALENDAR',''].join('\r\n');
  return { google:'https://calendar.google.com/calendar/render?'+query, ics:'data:text/calendar;charset=utf-8,'+encodeURIComponent(ics) };
}
