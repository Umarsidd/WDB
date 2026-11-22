import '@fontsource-variable/manrope';
import '@fontsource-variable/space-grotesk';
import './globals.css';
import './reference-theme.css';
import Script from 'next/script';
import { site } from '@/data/site';
import { localBusiness, origin, pageMeta } from '@/lib/seo';
import { Closing, Footer, JsonLd } from '@/components/UI';
import { SiteProvider, Navbar, WhatsAppFab } from '@/components/SiteClient';
export const metadata = {...pageMeta(site.name,site.tagline),title:{default:site.name,template:'%s | WDB'},metadataBase:new URL(origin)};
export default function RootLayout({children}){
  const ga=process.env.NEXT_PUBLIC_GA_ID;
  const analytics=ga&&/^G-[A-Z0-9]+$/.test(ga);
  return <html lang="en" suppressHydrationWarning><body>
    <a href="#main" className="skip-link">Skip to content</a><JsonLd value={localBusiness}/>
    <SiteProvider><Navbar/><main id="main">{children}</main><Closing/><Footer/><WhatsAppFab/></SiteProvider>
    {analytics&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload"/><Script id="google-analytics" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga)});`}</Script></>}
  </body></html>;
}
