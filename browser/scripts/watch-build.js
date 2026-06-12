import { execSync } from 'child_process';

const INTERVAL_MS = 1 * 60 * 1000; // n minutes

function build() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Starting build...`);
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`[${new Date().toLocaleTimeString()}] Build completed successfully.\n`);
  } catch {
    console.error(`[${new Date().toLocaleTimeString()}] Build failed.\n`);
  }
}

build();
setInterval(build, INTERVAL_MS);
