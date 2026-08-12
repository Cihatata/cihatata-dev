import type { Locale } from '~/i18n/utils';

export type VideoEntry = {
  /** Stable id, also used as the React-less list key. */
  id: string;
  /** Canonical watch URL (YouTube, conference site, etc.). */
  url: string;
  /** ISO date used for ordering. */
  publishedAt: string;
  /** Absolute thumbnail URL; YouTube ids resolve automatically when omitted. */
  thumbnail?: string;
  /** YouTube video id, used to derive the thumbnail when none is given. */
  youtubeId?: string;
  duration?: string;
} & Record<Locale, { title: string; description: string }>;

/**
 * Videos are curated by hand. Add an entry here and it shows up under
 * Contents → Videos in both languages.
 */
export const VIDEOS: VideoEntry[] = [];

export function getVideos(): VideoEntry[] {
  return VIDEOS.slice().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function thumbnailFor(video: VideoEntry): string | undefined {
  if (video.thumbnail) return video.thumbnail;
  if (video.youtubeId) return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return undefined;
}
