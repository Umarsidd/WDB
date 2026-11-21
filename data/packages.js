const plan = (category, slug, name, amount, bestFor, cta, color, features, options = {}) => ({
  category, slug, name, amount, bestFor, cta, color, features, billing: 'one-time', ...options,
});
export const packages = [
  plan('websites','starter-website','STARTER WEBSITE',4999,'Best for small businesses and individuals','Get Started','green',[
    '1 Page (One-page Website)','Responsive Design (Mobile & Desktop)','Contact Details (Call/WhatsApp)','WhatsApp Button','Basic Enquiry Form','Basic SEO Setup','Deployment Support',
  ],{ tab:'Starter' }),
  plan('websites','business-website','BUSINESS WEBSITE',9999,'Best for shops, service providers and growing businesses','Best Value for Money','blue',[
    'Up to 5 Pages','Responsive & Modern Design','Enquiry / Contact Form','WhatsApp Integration','Google Maps Link (Business Location)','Basic SEO Setup','Analytics Setup','Deployment Support',
  ],{ tab:'Business', popular:true }),
  plan('websites','growth-website','GROWTH WEBSITE',17999,'Best for established businesses and multiple services','For Better Brand Presence','orange',[
    'Up to 8 Pages','Custom UI/UX Design','CMS / Admin Panel (Basic)','SEO Setup (On-page)','Analytics & Tracking','Performance Optimization','Enquiry / Lead Management','Deployment Support',
  ],{ tab:'Growth' }),
  plan('websites','e-commerce-website','E-COMMERCE WEBSITE',24999,'Best for online stores and product businesses','Start Selling Online','purple',[
    'Product Catalogue (Up to 50)','Shopping Cart & Checkout','Payment Gateway Setup (Razorpay / UPI / Cards)','Order Management (Basic)','Inventory Management','Responsive Design','SEO Setup','Deployment Support',
  ],{ tab:'E-commerce' }),
  plan('websites','premium-website','PREMIUM WEBSITE',39999,'For large businesses & custom needs','Get Custom Quote','navy',[
    'Custom Design & Features','Unlimited Pages','Advanced CMS / Multi-User','API Integrations','Advanced SEO & Speed','Performance & Security','Dedicated Support','Ongoing Maintenance (Optional)',
  ],{ tab:'Premium', startsAt:true }),
  plan('social-media','basic-smm','BASIC SMM',999,'For startups & small brands','Get Started','blue',[
    '12 Creative Posts / Month','Post Scheduling','Basic Graphic Design','Captions & Hashtags','Monthly Performance Report',
  ],{ billing:'month' }),
  plan('social-media','standard-smm','STANDARD SMM',2999,'For growing businesses','Grow Your Brand','purple',[
    '20 Creative Posts / Month','Reels / Short Videos (4)','Content Calendar & Planning','Community Engagement (Comments & DMs)','Monthly Report & Insights',
  ],{ billing:'month' }),
  plan('social-media','premium-smm','PREMIUM SMM',9999,'For brands & e-commerce','Maximize Your Reach','navy',[
    '30 Creative Posts / Month','Reels / Short Videos (8)','Influencer Collaboration*','Content Strategy & Campaigns','Monthly Report + Growth Plan',
  ],{ billing:'month' }),
  plan('paid-promotion','basic-ads','BASIC ADS',2999,'For local reach & small budget','Start Advertising','green',[
    'Ad Setup & Targeting','1 Ad Creative (Design)','Meta (Facebook & Instagram) or Google Ads','Budget Management','Performance Report',
  ],{ billing:'campaign' }),
  plan('paid-promotion','standard-ads','STANDARD ADS',5999,'For better engagement & sales','Get More Leads','blue',[
    'Ad Setup & Targeting','3 Ad Creatives (Design)','A/B Testing','Budget Management','Weekly Performance Report','Meta + Google Ads',
  ],{ billing:'campaign' }),
  plan('paid-promotion','premium-ads','PREMIUM ADS',9999,'For maximum reach & ROI','Scale Your Business','purple',[
    'Advanced Targeting (Interest + Lookalike)','5 Ad Creatives (Design + Video)','A/B Testing & Optimization','Detailed Analytics Report','Meta + Google + YouTube Ads',
  ],{ billing:'campaign' }),
  plan('design-branding','graphic-design-branding','Graphic Design & Branding',null,'','Get Quote','purple',[]),
  plan('content-creation','content-creation','Content Creation (Posts / Reels / Videos)',null,'','Get Quote','orange',[]),
  plan('add-ons','additional-page-design','Additional Page Design',1000,'','Get Quote','blue',[],{unit:'per page'}),
  plan('add-ons','content-writing','Content Writing (Per Page)',500,'','Get Quote','blue',[],{unit:'per page'}),
  plan('add-ons','image-editing','Image Editing / Banner Design',500,'','Get Quote','purple',[],{unit:'per image'}),
  plan('add-ons','multilingual-support','Multilingual Support',2000,'','Get Quote','purple',[],{unit:'onwards',startsAt:true}),
  plan('add-ons','website-maintenance','Website Maintenance (AMC)',3000,'','Get Quote','navy',[],{unit:'per year',billing:'year'}),
  plan('add-ons','support-maintenance','Support & Maintenance',null,'','Get Quote','navy',[]),
];
export const findPackage = (category, slug) => packages.find(p => p.category === category && p.slug === slug);
export const addonPackages = packages.filter(p => p.category === 'add-ons' && p.amount !== null);
export const money = amount => '₹' + amount.toLocaleString('en-IN');
export const priceLabel = p => p.amount === null ? 'Get Quote' : money(p.amount) + (p.startsAt && !p.unit ? '+' : '') + (p.unit ? ' ' + p.unit : p.billing === 'one-time' ? '' : ' / ' + p.billing);
export const packageHref = p => `/services/${p.category}/${p.slug}`;
export const enquiryHref = p => `/contact?category=${p.category}&package=${p.slug}#enquiry`;
export const appointmentHref = p => `/book-appointment?category=${p.category}&package=${p.slug}`;
