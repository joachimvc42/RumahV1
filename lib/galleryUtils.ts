export type MediaType = 'image' | 'video';

export type SortableGalleryItem = {
  id: string;
  previewSrc: string;
  mediaType: MediaType;
  file?: File;
};

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) {
    return arr;
  }
  const next = [...arr];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function getMediaType(url: string): MediaType {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext && ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v'].includes(ext)) return 'video';
  return 'image';
}

export function urlsToGalleryItems(imageUrls: string[], videoUrls: string[] = []): SortableGalleryItem[] {
  const images = imageUrls.map((url, i) => ({
    id: `img-${i}-${url.slice(-24)}`,
    previewSrc: url,
    mediaType: 'image' as MediaType,
  }));
  const videos = videoUrls.map((url, i) => ({
    id: `vid-${i}-${url.slice(-24)}`,
    previewSrc: url,
    mediaType: 'video' as MediaType,
  }));
  return [...images, ...videos];
}

export function splitGalleryItems(items: SortableGalleryItem[]): {
  imageUrls: string[];
  videoUrls: string[];
} {
  return {
    imageUrls: items.filter((i) => i.mediaType === 'image').map((i) => i.previewSrc),
    videoUrls: items.filter((i) => i.mediaType === 'video').map((i) => i.previewSrc),
  };
}