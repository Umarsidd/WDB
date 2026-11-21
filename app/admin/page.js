import { Admin } from '@/components/Admin';
import { PageIntro } from '@/components/UI';
import { pageMeta } from '@/lib/seo';
export const metadata={...pageMeta('Admin','WDB appointments, leads and quotes.','/admin'),robots:{index:false,follow:false}};
export default function Page(){return <><PageIntro eyebrow="WDB workspace" title="Admin" items={[[ 'Admin','/admin' ]]}/><div className="shell section"><Admin/></div></>;}
