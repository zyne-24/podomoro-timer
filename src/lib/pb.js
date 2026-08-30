import PocketBase from 'pocketbase';

let pbInstance = null;

export function getPb() {
  if (!pbInstance) {
    const url = import.meta.env.PUBLIC_PB_URL || process.env.PUBLIC_PB_URL || 'http://127.0.0.1:8090';
    pbInstance = new PocketBase(url);
    pbInstance.autoCancellation(false);
  }
  return pbInstance;
}

export function fileUrl(record, filename) {
  if (!filename) return '';
  const url = import.meta.env.PUBLIC_PB_URL || process.env.PUBLIC_PB_URL || 'http://127.0.0.1:8090';
  return `${url}/api/files/${record.collectionId || record.collectionName}/${record.id}/${filename}`;
}
