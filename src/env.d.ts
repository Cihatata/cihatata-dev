/// <reference types="astro/client" />

type ThemeName = 'light' | 'dark';

interface Window {
  __setTheme?: (theme: ThemeName) => void;
  __themeBound?: boolean;
}

interface ImportMetaEnv {
  readonly UNSPLASH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
