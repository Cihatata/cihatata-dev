import type { Locale } from '~/i18n/utils';

export type ExperienceRole = {
  title: string;
  start: string;
  end: string | null;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  /** Overall employment start (ISO month: YYYY-MM). */
  start: string;
  /** Overall employment end; null means present. */
  end: string | null;
  roles: ExperienceRole[];
} & Record<Locale, { summary: string }>;

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'ga-telesis',
    company: 'GA Telesis',
    start: '2025-03',
    end: null,
    roles: [
      { title: 'Senior Frontend Engineer', start: '2026-01', end: null },
      { title: 'Frontend Engineer', start: '2025-03', end: '2026-01' },
    ],
    en: {
      summary:
        'Responsible for end-to-end frontend development of an aviation enterprise product, from UI components through cloud deployment. The day-to-day stack is React, TypeScript, and Vite, with React Query, Playwright, Sentry, and AWS in the delivery path — and once again I am getting to build from 0 to 1.',
    },
    tr: {
      summary:
        'Havacılık odaklı bir enterprise ürünün uçtan uca frontend geliştirme sürecinden sorumluyum; UI bileşenlerinden cloud deployment’a kadar. Günlük stack React, TypeScript ve Vite; teslim sürecinde React Query, Playwright, Sentry ve AWS kullanıyorum — ve yeniden 0’dan 1’e ürün üretmeyi deniyorum.',
    },
  },
  {
    id: 'trendyol',
    company: 'Trendyol Group',
    start: '2024-01',
    end: '2025-02',
    roles: [{ title: 'Software Engineer', start: '2024-01', end: '2025-02' }],
    en: {
      summary:
        "On the storefront team at Turkey's largest e-commerce platform — handling millions of requests — I built features for a high-traffic microfrontend application. I also led Developer Experience for the team and resolved a critical incident that had recurred three times a year for the previous three years.",
    },
    tr: {
      summary:
        'Türkiye’nin en büyük e-ticaret platformunun storefront ekibinde, günlük milyonlarca request alan yüksek trafikli microfrontend uygulamalarına özellik geliştirdim. Developer Experience alanında takıma lead ettim ve son üç yıldır yılda üç kez tekrarlayan kritik bir incident’ı çözüme kavuşturdum.',
    },
  },
  {
    id: 'resmo',
    company: 'Resmo',
    start: '2022-01',
    end: '2023-12',
    roles: [{ title: 'Frontend Developer', start: '2022-01', end: '2023-12' }],
    en: {
      summary:
        'As one of the early engineers I helped build a cloud security SaaS from 0 to 1 and took on a wide range of responsibilities across the product. Resmo gained strong momentum and was acquired by JumpCloud within two years.',
    },
    tr: {
      summary:
        'Ekibin ilk geliştiricilerinden biri olarak cloud security alanında 0’dan 1’e bir SaaS ürünü geliştirmeye katkı sağladım ve geniş bir sorumluluk alanı üstlendim. Resmo büyük bir ivme yakalayarak iki yıl içinde JumpCloud tarafından satın alındı.',
    },
  },
  {
    id: 'getir',
    company: 'Getir',
    start: '2021-03',
    end: '2021-12',
    roles: [{ title: 'Frontend Web Developer', start: '2021-03', end: '2021-12' }],
    en: {
      summary:
        "I was part of the team that launched Getir's website, shipping frontend features through a high-traffic pandemic period. I also helped accelerate expansion into new countries and built a large CMS system to support that growth.",
    },
    tr: {
      summary:
        'Getir’in websitesini açan ekibin içinde yer aldım ve pandemi döneminde yüksek trafik alan ürün için frontend özellikleri geliştirdim. Yeni ülkelere açılma süreçlerini hızlandıracak çalışmalar yaptım ve büyümeyi destekleyen büyük bir CMS sistemi geliştirdim.',
    },
  },
  {
    id: 'gais',
    company: 'Gais Cyber Security',
    start: '2020-07',
    end: '2021-02',
    roles: [{ title: 'Frontend Developer', start: '2020-07', end: '2021-02' }],
    en: {
      summary:
        'Developed frontend interfaces for cybersecurity products and collaborated closely with the broader product team. The focus was shipping clear, reliable web experiences for security workflows.',
    },
    tr: {
      summary:
        'Siber güvenlik ürünleri için frontend arayüzleri geliştirdim ve ürün ekibiyle yakın çalıştım. Güvenlik iş akışları için net ve güvenilir web deneyimleri üretmeye odaklandım.',
    },
  },
];
