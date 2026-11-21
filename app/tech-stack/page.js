import { PageIntro, TechStack } from '@/components/UI';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Technology Stack','Explore the frontend, backend, database and deployment technologies used at WDB.','/tech-stack');
export default function Page(){return <><PageIntro eyebrow="Under the hood" title="Technology Stack" description={metadata.description} items={[[ 'Tech Stack','/tech-stack' ]]}/><section className="shell section" aria-label="Technology stack"><TechStack/></section></>;}
