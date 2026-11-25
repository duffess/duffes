import { mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

// Run npm run bake:ink after changing the signature or its dimensions.
const server = await createServer({ server: { host: '127.0.0.1', port: 0, open: false } });
let browser;
try {
  await server.listen();
  browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0] + '@vite/client');
  const directory = new URL('../src/v4/scene/ink-assets/', import.meta.url);
  await mkdir(directory, { recursive: true });
  for (const mode of ['lite', 'full']) {
    const { shape, bytes } = await page.evaluate(async (lite) => {
      const { bakeInk } = await import('/scripts/bake-ink.ts');
      const { shape, half } = bakeInk(lite);
      const reader = new FileReader();
      const encoded = new Promise((resolve) => { reader.onload = () => resolve(reader.result); });
      reader.readAsDataURL(new Blob([half]));
      return { shape, bytes: await encoded };
    }, mode === 'lite');
    const decode = (url) => Buffer.from(url.split(',')[1], 'base64');
    await writeFile(new URL(mode + '.png', directory), decode(shape));
    await writeFile(new URL(mode + '.ink', directory), gzipSync(decode(bytes), { level: 9 }));
  }
} finally {
  await browser?.close();
  await server.close();
}
