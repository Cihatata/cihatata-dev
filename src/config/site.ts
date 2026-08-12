export const SITE_URL = 'https://cihatata.dev';

export const AUTHOR = {
  name: 'Cihat ATA',
  jobTitle: 'Software Engineer',
  company: 'GA Telesis',
  location: 'Ankara, Türkiye',
} as const;

export const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/cihatata' },
  { id: 'x', label: 'X', href: 'https://x.com/cihatata' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/cihat-ata' },
] as const;

/** Profiles that identify the author but are not rendered in the hero. */
export const EXTRA_PROFILES = [
  'https://unsplash.com/@cihatata',
  'https://cihatata.medium.com',
] as const;

export const X_HANDLE = '@cihatata';
export const UNSPLASH_USERNAME = 'cihatata';

export const NAV_ITEMS = [
  { id: 'home', path: '/' },
  { id: 'contents', path: '/contents' },
  { id: 'dailies', path: '/dailies' },
  { id: 'tools', path: '/tools' },
  { id: 'about', path: '/about' },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]['id'];
