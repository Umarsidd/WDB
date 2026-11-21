import { MapCard, PageIntro } from '@/components/UI';
import EnquiryForm from '@/components/EnquiryForm';
import { prefill } from '@/lib/prefill';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Contact','Ask about a package, request a quote or get directions to the WDB office in Balrampur.','/contact');
export default async function Contact({searchParams}){const values=prefill(await searchParams);return <><PageIntro eyebrow="Contact Us Today" title="Get a Free Quote" description="Tell us about your business and the services you’re interested in." items={[[ 'Contact','/contact' ]]}/><div className="shell section"><EnquiryForm key={values.initialCategory+':'+values.initialPackage} {...values} map={<MapCard/>}/></div></>;}
