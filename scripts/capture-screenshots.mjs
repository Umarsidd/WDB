import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects } from '../data/projects.js';

const publicDir = fileURLToPath(new URL('../public/clients/', import.meta.url));
const manifest = fileURLToPath(new URL('../data/project-screenshots.json', import.meta.url));
await mkdir(publicDir, { recursive:true });
const browser = await chromium.launch();
const results = {};
const actualOrigin = process.env.SCREENSHOT_FRAME_ORIGIN;
function frameAllowed(headers, siteUrl, finalUrl) {
  const policy = headers['content-security-policy'] || '';
  const directives = [...policy.matchAll(/(?:^|[;,])\s*frame-ancestors\s+([^;,]+)/gi)];
  const xfo = headers['x-frame-options'];
  if (xfo && !/^sameorigin$/i.test(xfo.trim())) return false;
  if (xfo && (!actualOrigin || new URL(finalUrl).origin !== new URL(actualOrigin).origin)) return false;
  if (!directives.length) return !/frame-ancestors/i.test(policy) && new URL(siteUrl).protocol === 'https:' && new URL(finalUrl).protocol === 'https:';
  return directives.every(([, sources]) => sources.trim().split(/\s+/).some(source => {
    if (source === '*') return true;
    if (!actualOrigin) return false;
    if (source === "'self'") return new URL(actualOrigin).origin === new URL(finalUrl).origin;
    return source === new URL(actualOrigin).origin;
  }));
}
async function capture(project, suffix, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor:1, isMobile:suffix === 'mobile', hasTouch:suffix === 'mobile' });
  try {
    const response = await page.goto(project.url, { waitUntil:'domcontentloaded', timeout:25000 });
    if (!response?.ok()) throw new Error('HTTP ' + response?.status());
    if (project.captureSkipIntro) {
      const skip=page.getByRole('button',{ name:/skip intro/i }).first();
      if (await skip.waitFor({ state:'visible', timeout:4500 }).then(()=>true).catch(()=>false)) {
        await skip.click({timeout:2000}).catch(()=>{});
      }
    }
    await page.waitForLoadState('networkidle', { timeout:6500 }).catch(() => {});
    await page.evaluate(async () => {
      window.scrollBy({top:innerHeight * .85,behavior:'instant'});
      await new Promise(resolve => setTimeout(resolve, 500));
      window.scrollTo({top:0,behavior:'instant'});
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1000))]);
    });
    await page.waitForFunction(() => window.scrollY < 2, undefined, { timeout:1500 }).catch(() => {});
    await page.waitForTimeout(1750);
    if (!await page.locator('body').innerText().then(text => text.trim().length)) throw new Error('No publicly visible page content');
    const save = async (kind, fullPage) => {
      const name = `${project.slug}-${kind}.webp`;
      const shot = await page.screenshot({ fullPage, animations:'disabled', timeout:15000 });
      await sharp(shot).resize({ width:viewport.width, height:11000, fit:'inside', withoutEnlargement:true }).webp({ quality:78 }).toFile(publicDir + name);
      return '/clients/' + name;
    };
    const path = await save(suffix,false);
    return { path, canFrame:frameAllowed(response.headers(),project.url,page.url()), full:suffix === 'desktop' ? await save('full', true).catch(error => { console.warn(project.slug + ' full:', error.message.split('\n')[0]); return null; }) : null };
  } finally { await page.close(); }
}
try {
  for (let i = 0; i < projects.length; i += 3) {
    await Promise.all(projects.slice(i,i+3).map(async project => {
      const [desktop,mobile] = await Promise.allSettled([
        capture(project,'desktop',{width:1440,height:900}),
        capture(project,'mobile',{width:390,height:844}),
      ]);
      const d = desktop.value, m = mobile.value;
      for (const item of [desktop,mobile]) if (item.status === 'rejected') console.warn(project.slug + ':',item.reason.message.split('\n')[0]);
      results[project.slug] = { screenshotDesktop:d?.path || null, screenshotMobile:m?.path || null, screenshotFull:d?.full || null, canFrame:d?.canFrame === true, verified:Boolean(d || m) };
      console.log(project.slug, d ? 'desktop ✓' : 'desktop fallback', m ? 'mobile ✓' : 'mobile fallback');
    }));
  }
  await writeFile(manifest + '.tmp', JSON.stringify(Object.fromEntries(projects.map(p => [p.slug,results[p.slug]])),null,2)+'\n');
  await rename(manifest + '.tmp',manifest);
  if (Object.values(results).some(p => !p.screenshotDesktop || !p.screenshotMobile)) process.exitCode = 1;
} finally { await browser.close(); }
