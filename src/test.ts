import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {unzip} from './index';

async function testAndroidCommandLineTools() {
  const url = 'https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip';
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unzip-test-'));

  console.log(`Testing unzip of Android Command Line Tools...`);
  console.log(`URL: ${url}`);
  console.log(`Target: ${targetDir}`);

  try {
    await unzip(url, targetDir);

    // Verify extraction
    const files = fs.readdirSync(targetDir, {recursive: true}) as string[];
    console.log(`Extracted ${files.length} files/directories`);

    // Check for expected structure (cmdline-tools directory)
    const hasCmdlineTools = files.some(f => f.toString().includes('cmdline-tools'));
    if (!hasCmdlineTools) {
      throw new Error('Expected cmdline-tools directory not found');
    }

    console.log('Test passed!');
  } finally {
    // Cleanup
    fs.rmSync(targetDir, {recursive: true, force: true});
    console.log('Cleaned up temp directory');
  }
}

testAndroidCommandLineTools().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
