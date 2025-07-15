import fs from 'fs';

export async function createFolder(folderName: string) {
  fs.mkdirSync(folderName, { recursive: true });
}
