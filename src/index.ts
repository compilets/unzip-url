import fs from 'node:fs';
import stream from 'node:stream';
import * as Throttle from 'promise-parallel-throttle';

import {ZipReader, ZipFileEntry, HttpReader, Uint8ArrayWriter} from '../lib/zip.js';

export async function unzip(url: string, targetDir: string) {
  fs.mkdirSync(targetDir, {recursive: true});

  const zip = new ZipReader(new HttpReader(url));
  try {
    const tasks = [];
    for (const entry of await zip.getEntries()) {
      if (entry.directory) {
        fs.mkdirSync(`${targetDir}/${entry.filename}`, {recursive: true});
      } else {
        tasks.push(() => writeFile(entry, targetDir));
      }
    }
    await Throttle.all(tasks);
  } finally {
    await zip.close();
  }
}

async function writeFile(entry: any, targetDir: string) {
  const mode = (entry.externalFileAttribute >>> 16) & 0o777;
  const file = fs.createWriteStream(`${targetDir}/${entry.filename}`, {mode});
  await entry.getData(stream.Writable.toWeb(file));
}
