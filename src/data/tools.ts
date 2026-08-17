import airpods from '~/assets/tools/airpods-3.png';
import ikeaMarkus from '~/assets/tools/ikea-markus.png';
import lgUltrafine from '~/assets/tools/lg-ultrafine-ergo.png';
import macbookAir from '~/assets/tools/macbook-air-m1.png';
import magicKeyboard from '~/assets/tools/magic-keyboard.png';
import mxVertical from '~/assets/tools/mx-vertical.jpg';
import nuphyAir from '~/assets/tools/nuphy-air75.webp';
import philipsHue from '~/assets/tools/philips-hue-play.png';
import standingDesk from '~/assets/tools/standing-desk.jpg';
import xboxSeriesX from '~/assets/tools/xbox-series-x.png';
import x100vi from '~/assets/tools/X100VI-gümüs.png';
import sennheiser from '~/assets/tools/sennheiser-accentum.png';


import type { Locale } from '~/i18n/utils';

export type Tool = {
  id: string;
  brand: string;
  /** Product images are optional; a few items never had one. */
  image?: ImageMetadata;
} & Record<Locale, { name: string }>;

/** Gear currently on the desk. */
export const CURRENT_TOOLS: Tool[] = [
  {
    id: 'macbook-air-m1',
    brand: 'Apple',
    image: macbookAir,
    tr: { name: 'Macbook Air M1 13”' },
    en: { name: 'MacBook Air M1 13”' },
  },
  {
    id: 'magic-keyboard',
    brand: 'Apple',
    image: magicKeyboard,
    tr: { name: 'Magic Keyboard' },
    en: { name: 'Magic Keyboard' },
  },
  {
    id: 'airpods-3',
    brand: 'Apple',
    image: airpods,
    tr: { name: 'AirPods 3. Nesil' },
    en: { name: 'AirPods 3rd generation' },
  },
  {
    id: 'lg-ultrafine-ergo',
    brand: 'LG',
    image: lgUltrafine,
    tr: { name: '32UN88AP-W UltraFine Ergo 32”' },
    en: { name: '32UN88AP-W UltraFine Ergo 32”' },
  },
  {
    id: 'mx-vertical',
    brand: 'Logitech',
    image: mxVertical,
    tr: { name: 'MX Vertical Mouse' },
    en: { name: 'MX Vertical mouse' },
  },
  {
    id: 'standing-desk',
    brand: 'Tischkoenig',
    image: standingDesk,
    tr: { name: '140x60 Kayın yükseklik ayarlı masa' },
    en: { name: '140x60 beech standing desk' },
  },
  {
    id: 'ikea-markus',
    brand: 'Ikea',
    image: ikeaMarkus,
    tr: { name: 'Markus' },
    en: { name: 'Markus chair' },
  },
  {
    id: 'xbox-series-x',
    brand: 'Microsoft',
    image: xboxSeriesX,
    tr: { name: 'Xbox Series X' },
    en: { name: 'Xbox Series X' },
  },
  {
    id: 'sennheiser-accentum',
    brand: 'Sennheiser',
    image: sennheiser,
    tr: { name: 'Sennheiser Accentum Kulaklık' },
    en: { name: 'Sennheiser Accentum Headphones' },
  },
  {
    id: 'philips-hue',
    brand: 'Philips',
    image: philipsHue,
    tr: { name: 'Hue Play & Ampul' },
    en: { name: 'Hue Play & bulbs' },
  },
  {
    id: 'whiteboard-paper',
    brand: 'Cengo',
    tr: { name: 'Şeffaf Tahta Kağıt' },
    en: { name: 'Transparent whiteboard sheet' },
  },
  {
    id: 'x100vi-gümüs',
    brand: 'Fujifilm',
    image: x100vi,
    tr: { name: 'Fujifilm X100VI Gümüş Kamera' },
    en: { name: 'Fujifilm X100VI Silver Camera' },
  },
];

/** Gear I would like to add. */
export const WISHLIST_TOOLS: Tool[] = [
  {
    id: 'nuphy-air-75',
    brand: 'Nuphy',
    image: nuphyAir,
    tr: { name: 'Nuphy Air 75 v3 Klavye' },
    en: { name: 'Nuphy Air 75 v3 keyboard' },
  },
  {
    id: 'mac-m5-max',
    brand: 'Apple',
    // image: nuphyAir,
    tr: { name: 'Macbook Pro 14 M5 Max' },
    en: { name: 'Macbook Pro 14 M5 Max' },
  },
];
