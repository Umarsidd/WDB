import { PageIntro, Process } from '@/components/UI';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Our Process','Five steps from discussing your needs to launch and support.','/process');
export default function Page(){return <><PageIntro eyebrow="How we work" title="Our Process" description={metadata.description} items={[[ 'Process','/process' ]]}/><section className="shell section" aria-label="Our process timeline"><Process/></section></>;}
