// Genera el PDF imprimible (A4 apaisado) a partir de libro.html
// Uso: node libro-paella/build.mjs [carpeta-de-capturas]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const shots = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
await page.goto('file://' + path.join(dir, 'libro.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const report = await page.evaluate(() => ({
  fonts: ['Playfair Display', 'Lora', 'Montserrat'].map(f => f + ':' + document.fonts.check(`12px "${f}"`)),
  pages: document.querySelectorAll('.page').length,
  overflow: [...document.querySelectorAll('.page')].flatMap((p, i) => {
    const pr = p.getBoundingClientRect();
    return [...p.querySelectorAll('p,h1,h2,h3,table,dl,ul,.card,.box,.tl,.quote')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.bottom > pr.bottom - 55 || r.right > pr.right - 20; })
      .map(e => `p${i + 1}: ${e.tagName} "${e.textContent.trim().slice(0, 30)}"`);
  }),
}));
console.log(JSON.stringify(report, null, 1));

await page.pdf({
  path: path.join(dir, 'La-Paella-Agostina-Lucas-Magenta.pdf'),
  width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true,
});
if (shots) {
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(shots, `p${String(i + 1).padStart(2, '0')}.png`) });
}
await browser.close();
