import fs from 'fs';

export function createFolder(folderName: string) {
  fs.mkdirSync(folderName, { recursive: true });
}
