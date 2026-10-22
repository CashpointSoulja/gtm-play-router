import { chromium } from 'playwright';
const b = await chromium.launch();
const d = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await d.goto('https://gtm-play-router.ayomideahmedcp.workers.dev/', { waitUntil: 'networkidle' });
await d.screenshot({ path: '/downloads/vercel-redo-desktop.png', fullPage: false });
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage();
await m.goto('https://gtm-play-router.ayomideahmedcp.workers.dev/', { waitUntil: 'networkidle' });
await m.screenshot({ path: '/downloads/vercel-redo-mobile.png', fullPage: false });
await b.close(); console.log('shots done');
