export const site = {
  name:'WDB – Website Development for Business',
  business:'Website Development for Business',
  tagline:'Professional, Affordable and Scalable Digital Solutions',
  partner:'Your Digital Growth Partner',
  disciplines:['Web','App','Marketing','Branding'],
  hero:'Complete Digital Solutions for Businesses, Shops & Startups',
  chips:['Website','Social Media Marketing','Paid Promotion'],
  quote:'Get a Free Quote',
  closing:"Let's Build Your Digital Success Story Together!",
  phone:'9506425353',
  email:'mohdumar4253@gmail.com',
  instagram:'_umar_sidd_',
  address:'Website Development for Business, Near Pani Tanki, Balrampur, Uttar Pradesh – 271201',
  maps:'https://maps.app.goo.gl/5E58Zd1J5C2Fvrjg6?g_st=ac',
};
export const whatsapp = (message = 'Hello WDB, I would like to discuss digital solutions for my business.') => `https://wa.me/91${site.phone}?text=${encodeURIComponent(message)}`;
export const languages = { en:{ services:'Services', clients:'Clients', about:'About', tech:'Tech Stack', process:'Process', contact:'Contact', book:'Book Appointment' }, hi:{ services:'सेवाएँ', clients:'क्लाइंट', about:'हमारे बारे में', tech:'टेक स्टैक', process:'प्रक्रिया', contact:'संपर्क', book:'बातचीत बुक करें' } };
export const appointmentTypes = ['Free Consultation Call','WhatsApp Chat','Video Call (Google Meet)','Visit Office (Balrampur)'];
export const slots = [
  { id:'morning', label:'10:00 AM – 1:00 PM', start:'100000', end:'130000' },
  { id:'afternoon', label:'2:00 PM – 5:00 PM', start:'140000', end:'170000' },
  { id:'evening', label:'6:00 PM – 8:00 PM', start:'180000', end:'200000' },
];
// Budget labels and closures are editable business settings. Sunday is 0.
export const booking = { closedWeekdays:[], closedDates:[], horizon:60, timezone:'Asia/Kolkata', budgets:['Need guidance','Under ₹5,000','₹5,000 – ₹10,000','₹10,000 – ₹25,000','₹25,000+'] };
