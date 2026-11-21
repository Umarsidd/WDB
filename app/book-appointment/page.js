import { MapCard, PageIntro } from '@/components/UI';
import AppointmentForm from '@/components/AppointmentForm';
import { prefill } from '@/lib/prefill';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Book Appointment','Choose an available consultation slot and discuss your business requirements with WDB.','/book-appointment');
export default async function Book({searchParams}){const values=prefill(await searchParams);return <><PageIntro eyebrow="Let’s talk" title="Book Appointment" description="Choose a consultation type and a time that works for you." items={[[ 'Book Appointment','/book-appointment' ]]}/><div className="shell section"><AppointmentForm key={values.initialCategory+':'+values.initialPackage} {...values} map={<MapCard/>}/></div></>;}
