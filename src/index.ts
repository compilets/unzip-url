import fs from 'node:fs';
import stream from 'node:stream';

import {ZipReader, HttpReader} from '../lib/zip.js';
import {newQueue} from '@henrygd/queue';

export async function unzip(url: string, targetDir: string) {
  fs.mkdirSync(targetDir, {recursive: true});

  const zip = new ZipReader(new HttpReader(url));
  try {
    const queue = newQueue(5);
    for (const entry of await zip.getEntries()) {
      if (entry.directory) {
        fs.mkdirSync(`${targetDir}/${entry.filename}`, {recursive: true});
      } else {
        queue.add(() => writeFile(entry, targetDir));
      }
    }
    await queue.done();
  } finally {
    await zip.close();
  }
}

async function writeFile(entry: any, targetDir: string) {
  const mode = (entry.externalFileAttribute >>> 16) & 0o777;
  const file = fs.createWriteStream(`${targetDir}/${entry.filename}`, {mode});
  await entry.getData(stream.Writable.toWeb(file));
}
