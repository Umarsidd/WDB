import screenshots from './project-screenshots.json' with { type: 'json' };

export const projectCategories = ['All','ERP & Business Software','E-commerce & Fashion','Corporate & Services','Hospitality & Events','Catalogue & Retail','Manufacturing','Personal & Professional Portfolios'];
// Fill the confirmation values after verifying the stack or scope with the client.
export const confirmations = {
  danInvoice: '',
  danRtl: '',
  danDashboardImages: [],
  influencerCollaboration: '',
  techStacks: { 'dazzling-threads':[], 'fatima-international':[], 'lulu-galaxy':[], 'old-is-gold':[], 'deepak-kumar-srivastava':[], 'faiz-sheikh-interiors':[] },
};

export const projects = [
  {
    slug:'dan-erp', name:'DAN ERP', url:'https://dan-erp.com', category:'ERP & Business Software',
    description:'A full-stack ERP platform for Iraq.', country:'Iraq', featured:true,
    features:['Inventory management','Invoice generation','Analytics dashboard with operational trends','1,000+ daily transactions',...(confirmations.danInvoice ? [confirmations.danInvoice] : [])],
    techStack:['ReactJS','Node.js','Apollo GraphQL','PostgreSQL','Prisma ORM','Docker','OpenAI API','AWS S3 / Cloudinary'],
    problem:'Bring inventory, invoice generation and operational analytics into one ERP platform.',
    solution:'Apollo GraphQL subscriptions provide real-time updates. OpenAI API supports AI-based invoice insights, and AWS S3 / Cloudinary stores documents.',
    result:'1,000+ daily transactions.', period:'Aug – Dec 2025',
  },
  {
    slug:'si-bella-home', name:'Si_bella Home', url:'https://clever-genie-072797.netlify.app/', category:'Manufacturing', filters:['Catalogue & Retail'], categoryBadge:'Manufacturing & Catalogue',
    description:'School, college & office furniture manufacturer in Lucknow with 35+ years of experience and a 10-year warranty.',
    features:["Modular, group series, storage, single-seater and metal furniture","Lab/library/staffroom, teacher's furniture, podium and reception counter","Office table & cabinet","Trusted-clients marquee","Service-area WhatsApp links (Lucknow, Varanasi, Prayagraj, Azamgarh, Gorakhpur, Basti)","Google rating testimonial on the live site","Downloadable PDF catalogue","WhatsApp callback"],
    techStack:['Next.js'], hosting:'Netlify',
  },
  {
    slug:'dazzling-threads', name:'Dazzling Threads (Dulha Dulhan House)', url:'https://dazzlingthreads.netlify.app', category:'E-commerce & Fashion',
    captureSkipIntro:true,
    description:'Luxury Indian bridal and groom wear: sherwanis, tuxedos, bridal lehengas, heirloom sarees.',
    features:['Sherwanis','Tuxedos','Bridal lehengas','Heirloom sarees','Dark luxury theme (#0A0A0A)'], hosting:'Netlify',
  },
  {
    slug:'fatima-international', name:'Fatima International', url:'https://fatimainternational.netlify.app', category:'Corporate & Services',
    description:'Registered overseas manpower recruitment consultancy connecting Indian talent with Saudi Arabia, UAE, Qatar, Oman and the Gulf.',
    features:['Reg No. B-1670/DEL/COM/1000+/5/10276/2023','Visa stamping','Document attestation services','Delhi'], hosting:'Netlify',
  },
  {
    slug:'lulu-galaxy', name:'Lulu Galaxy Banquet Hall & Hotel', url:'https://lulu-galaxy.vercel.app/', canonical:'https://lulugalaxybanquet.com/', category:'Hospitality & Events',
    description:'Premium weddings, birthdays, corporate events and family celebrations in Balrampur.',
    features:['2000–2500 guest capacity','Indoor + outdoor','Full AC','Generator backup','SEO-optimized with Open Graph tags'], hosting:'Vercel',
  },
  {
    slug:'old-is-gold', name:'OLD IS GOLD', url:'https://oldis-gold.netlify.app/', category:'Catalogue & Retail',
    description:'Verified mobile-phone stock catalogue in Balrampur with price enquiries on WhatsApp.',
    features:['Apple, Samsung, OPPO, Vivo, Realme, OnePlus and more','Price enquiries on WhatsApp'], hosting:'Netlify',
  },
  {
    slug:'deepak-kumar-srivastava', name:'Deepak Kumar Srivastava', url:'https://deepak-kumar-srivastava.vercel.app/', category:'Personal & Professional Portfolios', categoryBadge:'Personal & Professional Portfolio',
    description:'Executive portfolio of a senior business and operations leader.',
    features:['Overview','Experience timeline','Leadership competencies','Case studies','Strategic initiatives','Credentials','Philosophy','Contact form','LinkedIn link','Dark theme (#070B14)'], hosting:'Vercel',
  },
  {
    slug:'faiz-sheikh-interiors', name:'Mohd Faiz Sheikh Interiors', url:'https://faiz-shaikh-interior.netlify.app/', canonical:'https://mohdfaizsheikh-interiors.com/', category:'Personal & Professional Portfolios',
    description:'Luxury interiors and complete turnkey home projects in Balrampur.',
    features:['Modular kitchens','Luxury interiors','False ceiling','TV units','Wardrobes','Home renovation','Turnkey projects'], hosting:'Netlify',
  },
  {
    slug:'umar-siddiqui', name:'Umar Siddiqui Developer Portfolio', url:'https://mohdumarsiddiqui.netlify.app/', category:'Personal & Professional Portfolios', categoryBadge:'Personal Portfolio',
    description:'Personal developer portfolio.', features:['MERN','Cloud','Docker','Kubernetes'], techStack:['MERN','Docker','Kubernetes'], hosting:'Netlify',
  },
].map(project => ({
  country:'India', featured:false, hosting:'', problem:'', solution:'', result:'',
  testimonial:'Client testimonial coming soon',
  techStack:confirmations.techStacks[project.slug] || [],
  screenshotDesktop:null, screenshotMobile:null, screenshotFull:null, canFrame:false, verified:false,
  ...project, ...screenshots[project.slug],
}));
