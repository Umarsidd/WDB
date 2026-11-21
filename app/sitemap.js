import { origin } from '@/lib/seo';
import { services } from '@/data/services';
import { packages, packageHref } from '@/data/packages';
import { projects } from '@/data/projects';
export default function sitemap(){return ['/','/services','/clients','/about','/tech-stack','/process','/book-appointment','/contact',...services.map(s=>'/services/'+s.slug),...packages.map(packageHref),...projects.map(p=>'/clients/'+p.slug)].map(path=>({url:origin+path}));}
