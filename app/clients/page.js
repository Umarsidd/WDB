import { ClientCard, ClientGrid } from '@/components/ClientCard';
import { PageIntro } from '@/components/UI';
import { SwarmIntro } from '@/components/SwarmIntro';
import { projects, projectCategories } from '@/data/projects';
import { pageMeta } from '@/lib/seo';
export const metadata=pageMeta('Happy Clients & Projects','Explore websites, portfolios and business software, including DAN ERP in Iraq.','/clients');
export default function Clients(){return <><PageIntro eyebrow="Selected work" title="Happy Clients & Projects" description={metadata.description} items={[[ 'Clients','/clients' ]]}/><SwarmIntro home/><section className="shell section"><ClientCard project={projects.find(p=>p.featured)} featured/><ClientGrid projects={projects} categories={projectCategories}/></section></>;}
