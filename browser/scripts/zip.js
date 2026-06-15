import fs from 'fs';
import archiver from 'archiver';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const folderPath = 'dist';
const outPath = `${pkg.name}.zip`;

async function zipDist() {
  try {
    console.log(`ZIP the folder "${folderPath}" into "${outPath}"...`);

    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => { throw err; });
    output.on('close', () => {
      console.log(`ZIP created: ${outPath} (${archive.pointer()} bytes)`);
    });

    archive.pipe(output);
    archive.directory(folderPath, false);

    await archive.finalize();
  } catch (error) {
    console.error(`Error during the ZIP creation: ${error}`);
    process.exit(1);
  }
}

zipDist();
