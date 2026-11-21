import { PageIntro, ServiceTiles } from '@/components/UI';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Services','Explore website development, social media marketing, paid promotion, graphic design, content creation and website maintenance.','/services');
export default function Services(){return <><PageIntro eyebrow="The catalogue" title="Explore our services" description={metadata.description} items={[[ 'Services','/services' ]]}/><section className="shell section" aria-label="Service categories"><ServiceTiles directory/></section></>;}
