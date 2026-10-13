import JSZip from 'jszip';
import { MARKDOWN_FILES, MarkdownFile } from '../data/markdownFiles';

export function downloadSingleFile(file: MarkdownFile) {
  const blob = new Blob([file.content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(onProgress?: (percent: number) => void) {
  const zip = new JSZip();
  const folder = zip.folder('cadence-campus-pulse-screens');

  MARKDOWN_FILES.forEach(file => {
    if (folder) {
      folder.file(file.filename, file.content);
    } else {
      zip.file(file.filename, file.content);
    }
  });

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent);
    }
  });

  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cadence-campus-pulse-screens-md.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
