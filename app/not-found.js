import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/UI';
export default function NotFound(){return <><PageIntro eyebrow="404" title="Page not found" description="The page you requested is unavailable."/><div className="shell section"><Link href="/services" className="btn primary">Explore services <ArrowRight size={16}/></Link></div></>;}
