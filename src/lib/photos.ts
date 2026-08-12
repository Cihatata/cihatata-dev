import data from '~/data/unsplash.json';

export type UnsplashPhoto = {
  id: string;
  slug: string;
  createdAt: string;
  width: number;
  height: number;
  color: string;
  blurHash: string | null;
  description: string | null;
  altDescription: string | null;
  likes: number;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  link: string;
};

export type UnsplashProfile = {
  username: string;
  name: string;
  link: string;
  totalPhotos: number;
  totalLikes: number;
  bio: string | null;
};

const UTM = 'utm_source=cihatata.dev&utm_medium=referral';

export const profile = data.profile as UnsplashProfile;

export const photos = (data.photos as UnsplashPhoto[])
  .slice()
  .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

export function getPhotos(limit?: number): UnsplashPhoto[] {
  return limit ? photos.slice(0, limit) : photos;
}

/**
 * Unsplash requires images to stay hot-linked to their CDN, so sizing happens
 * through their imgix parameters rather than a local image service.
 */
export function photoUrl(photo: UnsplashPhoto, width: number): string {
  const url = new URL(photo.urls.raw);
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('q', '75');
  url.searchParams.set('w', String(width));
  return url.toString();
}

export function photoSrcSet(photo: UnsplashPhoto, widths: number[]): string {
  return widths.map((width) => `${photoUrl(photo, width)} ${width}w`).join(', ');
}

/** Attribution links must carry the referral parameters Unsplash asks for. */
export function attributionLink(url: string): string {
  return url.includes('?') ? `${url}&${UTM}` : `${url}?${UTM}`;
}

export const profileLink = attributionLink(profile.link);
