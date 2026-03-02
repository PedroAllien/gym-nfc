import { extractVideoId } from './youtube';

export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url);
}

export function isYouTubeOrVimeoUrl(url: string): boolean {
  return isYouTubeUrl(url) || isVimeoUrl(url);
}

export function parseYouTubeId(url: string): string | null {
  return extractVideoId(url);
}

export function parseVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

const TARGET_VIDEO_SIZE = 20 * 1024 * 1024;

export async function compressVideo(file: File): Promise<File> {
  if (file.size <= TARGET_VIDEO_SIZE) return file;
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    const name = 'input' + (file.name.match(/\.[^.]+$/)?.[0] || '.mp4');
    await ffmpeg.writeFile(name, await fetchFile(file));
    await ffmpeg.exec([
      '-i', name,
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      'out.mp4',
    ]);
    const data = await ffmpeg.readFile('out.mp4');
    await ffmpeg.deleteFile(name);
    await ffmpeg.deleteFile('out.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    return new File([blob], file.name.replace(/\.[^.]+$/, '.mp4'), { type: 'video/mp4' });
  } catch {
    return file;
  }
}
