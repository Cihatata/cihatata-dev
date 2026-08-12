import { NAV_ITEMS } from '~/config/site';
import type { IconName } from '~/components/ui/icons';
import { localizePath, type Locale, type TranslationKey } from '~/i18n/utils';

const NAV_ICONS: Record<string, IconName> = {
  home: 'home',
  contents: 'layers',
  dailies: 'calendar',
  tools: 'wrench',
  about: 'user',
};

export type ResolvedNavItem = {
  id: string;
  /** Locale-independent path, e.g. `/contents`. */
  path: string;
  href: string;
  labelKey: TranslationKey;
  icon: IconName;
  isActive: boolean;
};

/**
 * `currentPath` is the locale-independent path of the page being rendered, so
 * both language trees highlight the same entry.
 */
export function resolveNavItems(locale: Locale, currentPath: string): ResolvedNavItem[] {
  const normalized = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');

  return NAV_ITEMS.map((item) => ({
    id: item.id,
    path: item.path,
    href: localizePath(item.path, locale),
    labelKey: `nav.${item.id}` as TranslationKey,
    icon: NAV_ICONS[item.id] ?? 'sparkle',
    isActive:
      item.path === '/'
        ? normalized === '/'
        : normalized === item.path || normalized.startsWith(`${item.path}/`),
  }));
}
