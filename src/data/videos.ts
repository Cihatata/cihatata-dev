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
export const VIDEOS: VideoEntry[] = [
  {
    id: 'frontend-egitimi-2',
    url: 'https://www.youtube.com/watch?v=tJOxAb_LdQk',
    youtubeId: 'tJOxAb_LdQk',
    publishedAt: '2024-12-15',
    duration: '1:49:52',
    en: {
      title: 'Front-End Training — Day 2',
      description:
        'Second day of the front-end training hosted by Ankara University Computer Society.',
    },
    tr: {
      title: 'Front-End Eğitimi — 2. Gün',
      description: 'Ankara Üniversitesi Computer Society bünyesinde verdiğim front-end eğitiminin ikinci günü.',
    },
  },
  {
    id: 'frontend-egitimi-1',
    url: 'https://www.youtube.com/watch?v=c2Nknn6spjY',
    youtubeId: 'c2Nknn6spjY',
    publishedAt: '2024-11-22',
    duration: '1:38:56',
    en: {
      title: 'Front-End Training — Day 1',
      description:
        'First day of the front-end training hosted by Ankara University Computer Society.',
    },
    tr: {
      title: 'Front-End Eğitimi — 1. Gün',
      description: 'Ankara Üniversitesi Computer Society bünyesinde verdiğim front-end eğitiminin birinci günü.',
    },
  },
];

export function getVideos(): VideoEntry[] {
  return VIDEOS.slice().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function thumbnailFor(video: VideoEntry): string | undefined {
  if (video.thumbnail) return video.thumbnail;
  if (video.youtubeId) return `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return undefined;
}
