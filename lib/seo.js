import { site } from '../data/site.js';
export const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/,'');
export function pageMeta(title, description, path = '/', image = '/brand/social.png') {
  return {
    title, description, alternates:{canonical:path},
    openGraph:{title,description,url:path,siteName:site.name,images:[{url:image,alt:site.name}],type:'website',locale:'en_IN'},
    twitter:{card:'summary_large_image',title,description,images:[image]},
  };
}
export const schema = (type, values) => ({'@context':'https://schema.org','@type':type,...values});
export const localBusiness = schema('LocalBusiness',{
  name:site.business, '@id':origin+'/#business', url:origin, image:origin+'/brand/social.png', telephone:'+91'+site.phone, email:site.email,
  address:{'@type':'PostalAddress',streetAddress:'Near Pani Tanki',addressLocality:'Balrampur',addressRegion:'Uttar Pradesh',postalCode:'271201',addressCountry:'IN'},
  hasMap:site.maps, sameAs:['https://www.instagram.com/'+site.instagram+'/'],
});
