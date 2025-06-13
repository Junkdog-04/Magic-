import { watch } from 'fs';
import path from 'path';

const fs = require('fs');
const isProduction = Bun.argv.includes('--prod');
const outputDir = 'calvaria';
const port = 3000;

const cleanOutput = () => {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
};

const copyFolder = (src: string, dest: string) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const copyStaticAssets = () => {
  fs.copyFileSync('./arche/index.html', `${outputDir}/index.html`);
  copyFolder('./arche/styles', `${outputDir}/styles`);
  copyFolder('./arche/images', `${outputDir}/images`);
};

const buildMagic = async () => {
  const componentDirs = fs.readdirSync('./arche/components');
  const componentEntries = componentDirs.map((name: string) =>
    `arche/components/${name}/munus.ts`
  );

  const entrypoints = [
    'arche/core/LIBRIS.ts',
    ...componentEntries
  ];

  await Bun.build({
    entrypoints,
    outdir: outputDir,
    target: 'browser',
    minify: isProduction
  });

  copyStaticAssets();
  console.log('✨ MAGIC build complete.');
};

const startWatcher = () => {
  watch('./arche', { recursive: true }, async (_eventType, filename) => {
    if (!filename) {
      console.warn('🧐 fs.watch triggered but no filename was provided.');
      return;
    }

    if (
      filename.endsWith('.ts') ||
      filename.endsWith('.html') ||
      filename.endsWith('.css')
    ) {
      console.log(`🔁 Change detected in: ${filename}`);
      await buildMagic();
    }
  });

  console.log('👁 fs.watch is running and listening for changes...');
};

const startServer = () => {
  Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      let pathName = `${outputDir}${url.pathname}`;
      if (pathName.endsWith('/')) pathName += 'index.html';

      try {
        return new Response(Bun.file(pathName));
      } catch {
        return new Response('404 Not Found', { status: 404 });
      }
    }
  });

  console.log(`🧙 MAGIC Nexus running at http://localhost:${port} (${isProduction ? 'PROD' : 'DEV'})`);
};

// 🚀 Run everything
cleanOutput();
await buildMagic();
if (!isProduction) startWatcher();
startServer();
