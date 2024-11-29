import fs from 'fs';

export function deleteFolder(folderName: string) {
  fs.rmSync(folderName, { force: true, recursive: true });
}
