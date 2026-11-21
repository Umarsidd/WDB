import { notFound } from 'next/navigation';
import { PageIntro, JsonLd } from '@/components/UI';
import { Catalogue } from '@/components/Catalogue';
import { SwarmIntro } from '@/components/SwarmIntro';
import { domainNotice, services } from '@/data/services';
import { packages } from '@/data/packages';
import { pageMeta, schema, origin } from '@/lib/seo';
export function generateStaticParams(){return services.map(s=>({category:s.slug}));}
const find=slug=>services.find(s=>s.slug===slug);
export async function generateMetadata({params}){const s=find((await params).category);if(!s)notFound();return pageMeta(s.heading,s.subtitle||s.summary,'/services/'+s.slug);}
const icons=['instagram','facebook','youtube','linkedin','x'];
export default async function Category({params}){
  const s=find((await params).category);if(!s)notFound();
  const path='/services/'+s.slug;
  return <><JsonLd value={schema('Service',{name:s.heading,description:s.subtitle||s.summary,url:origin+path,provider:{'@id':origin+'/#business'}})}/>
    <PageIntro eyebrow="Service catalogue" title={s.heading} description={s.subtitle||s.summary} items={[[ 'Services','/services' ],[s.heading,path]]}>
      {s.slug==='websites'&&<div className="domain-notice" data-build="line"><span aria-hidden="true">🇮🇳</span>{domainNotice}</div>}
      {s.platforms&&<div className="platform-label">Platforms Covered: {s.platforms.map((x,i)=><span key={x}><img src={'/tech/'+icons[i]+'.svg'} alt="" width="13" height="13"/>{x}</span>)}</div>}
    </PageIntro><SwarmIntro/><Catalogue plans={packages.filter(p=>p.category===s.slug)} website={s.slug==='websites'}/></>;
}
