export const LOCALES = ['en', 'tr'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
};

export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  tr: 'tr_TR',
};

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.contents': 'Contents',
    'nav.dailies': 'Dailies',
    'nav.tools': 'Tools',
    'nav.about': 'About',
    'nav.label': 'Main navigation',

    'hero.bio':
      "I'm a Software Engineer at GA Telesis, based in Ankara. I mostly work with JavaScript technologies, care about product-minded teams, and enjoy sharing what I learn along the way.",
    'hero.findMeOn': 'Find me on',
    'hero.avatarAlt': 'Illustrated portrait of Cihat ATA',

    'home.title': 'Home',
    'home.description':
      'Software Engineer based in Ankara. Writing about JavaScript, web development, teams and the things I learn along the way.',
    'home.latestPosts': 'Latest posts',
    'home.latestPhotos': 'Latest photos',
    'home.allPosts': 'All posts',
    'home.allPhotos': 'All photos',

    'contents.title': 'Contents',
    'contents.description':
      'Everything I publish in one place: blog posts, videos and photography.',
    'contents.blogs': 'Blogs',
    'contents.videos': 'Videos',
    'contents.photos': 'Photos',
    'contents.blogsDescription': 'Long-form writing about software, teams and life.',
    'contents.videosDescription': 'Talks and recordings.',
    'contents.photosDescription': 'A selection of my photography, published on Unsplash.',

    'blog.title': 'Blog',
    'blog.description': 'Writing about software engineering, JavaScript, teams and life.',
    'blog.readingTime': '{n} min read',
    'blog.backToBlog': 'Back to all posts',
    'blog.tags': 'Tags',
    'blog.empty': 'No posts yet.',
    'blog.tagged': 'Posts tagged “{tag}”',
    'blog.translationTitle': 'This post is not translated yet',
    'blog.translationBody':
      'The full English version is still being written. You can read the complete post in Turkish in the meantime.',
    'blog.translationCta': 'Read in Turkish',

    'videos.empty': 'No videos yet. Coming soon.',
    'videos.watch': 'Watch',

    'photos.viewOnUnsplash': 'View on Unsplash',
    'photos.by': 'Photo by',
    'photos.on': 'on',
    'photos.empty': 'No photos yet.',
    'photos.fallbackAlt': 'Photograph by Cihat ATA',

    'dailies.title': 'Dailies',
    'dailies.description':
      'Short daily notes about what I am building, reading and learning. Coming soon.',
    'dailies.comingSoon': 'Coming soon',
    'dailies.body':
      'Short, unfiltered notes about what I am building, reading and learning each day. I am still shaping the format, so this page is intentionally empty for now.',

    'tools.title': 'Tools',
    'tools.description':
      'The hardware and gear I use on my desk every day, plus the things I would like to try next.',
    'tools.using': 'What I use',
    'tools.wishlist': 'What I want',
    'tools.usingIntro': 'These are the tools I use at my desk every day.',
    'tools.wishlistIntro': 'And these are the ones I would like to add some day.',

    'about.title': 'About',
    'about.description':
      'Software Engineer at GA Telesis, based in Ankara. Here is a little more about me.',

    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'lang.switch': 'Change language',
    'lang.switchTo': 'Türkçe',

    'notFound.title': 'Page not found',
    'notFound.body': 'The page you are looking for does not exist or has moved.',
    'notFound.cta': 'Go home',

    'footer.rights': 'All rights reserved.',
    'footer.rss': 'RSS',
    'skip.content': 'Skip to content',
  },
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.contents': 'İçerikler',
    'nav.dailies': 'Günlükler',
    'nav.tools': 'Araçlar',
    'nav.about': 'Hakkımda',
    'nav.label': 'Ana menü',

    'hero.bio':
      'GA Telesis’te Software Engineer olarak çalışıyorum, Ankara’da yaşıyorum. Ağırlıklı olarak JavaScript teknolojileriyle ilgileniyor, ürün odaklı takımlarda çalışmayı seviyor ve öğrendiklerimi paylaşmaya çalışıyorum.',
    'hero.findMeOn': 'Bana ulaşın',
    'hero.avatarAlt': 'Cihat ATA’nın illüstrasyon portresi',

    'home.title': 'Ana Sayfa',
    'home.description':
      'Ankara’da yaşayan bir Software Engineer. JavaScript, web geliştirme, takımlar ve öğrendiklerim üzerine yazıyorum.',
    'home.latestPosts': 'Son yazılar',
    'home.latestPhotos': 'Son fotoğraflar',
    'home.allPosts': 'Tüm yazılar',
    'home.allPhotos': 'Tüm fotoğraflar',

    'contents.title': 'İçerikler',
    'contents.description':
      'Ürettiğim her şey tek bir yerde: blog yazıları, videolar ve fotoğraflar.',
    'contents.blogs': 'Bloglar',
    'contents.videos': 'Videolar',
    'contents.photos': 'Fotoğraflar',
    'contents.blogsDescription': 'Yazılım, takımlar ve hayat üzerine uzun yazılar.',
    'contents.videosDescription': 'Konuşmalar ve kayıtlar.',
    'contents.photosDescription': 'Unsplash’te yayımladığım fotoğraflardan bir seçki.',

    'blog.title': 'Blog',
    'blog.description':
      'Yazılım mühendisliği, JavaScript, takımlar ve hayat üzerine yazılarım.',
    'blog.readingTime': '{n} dk okuma',
    'blog.backToBlog': 'Tüm yazılara dön',
    'blog.tags': 'Etiketler',
    'blog.empty': 'Henüz yazı yok.',
    'blog.tagged': '“{tag}” etiketli yazılar',
    'blog.translationTitle': 'Bu yazı henüz çevrilmedi',
    'blog.translationBody':
      'İngilizce versiyonu hâlâ hazırlanıyor. Bu sırada yazının tamamını Türkçe okuyabilirsiniz.',
    'blog.translationCta': 'Türkçe oku',

    'videos.empty': 'Henüz video yok. Çok yakında.',
    'videos.watch': 'İzle',

    'photos.viewOnUnsplash': 'Unsplash’te gör',
    'photos.by': 'Fotoğraf:',
    'photos.on': '·',
    'photos.empty': 'Henüz fotoğraf yok.',
    'photos.fallbackAlt': 'Cihat ATA tarafından çekilmiş fotoğraf',

    'dailies.title': 'Günlükler',
    'dailies.description':
      'Her gün ne yaptığıma, ne okuduğuma ve ne öğrendiğime dair kısa notlar. Çok yakında.',
    'dailies.comingSoon': 'Çok yakında',
    'dailies.body':
      'Her gün ne geliştirdiğime, ne okuduğuma ve ne öğrendiğime dair kısa notlar paylaşacağım. Formatı hâlâ şekillendiriyorum, bu yüzden burası şimdilik bilinçli olarak boş.',

    'tools.title': 'Araçlar',
    'tools.description':
      'Her gün masamda kullandığım donanımlar ve bir gün denemek istediklerim.',
    'tools.using': 'Kullandıklarım',
    'tools.wishlist': 'Kullanmak istediklerim',
    'tools.usingIntro': 'Çalışma masamda kullandığım araçları aşağıda görebilirsiniz.',
    'tools.wishlistIntro': 'Bunlar da bir gün listeme eklemek istediklerim.',

    'about.title': 'Hakkımda',
    'about.description':
      'GA Telesis’te Software Engineer, Ankara’da yaşıyorum. Kendimden biraz daha bahsedeyim.',

    'theme.toggle': 'Temayı değiştir',
    'theme.light': 'Açık',
    'theme.dark': 'Koyu',
    'lang.switch': 'Dili değiştir',
    'lang.switchTo': 'English',

    'notFound.title': 'Sayfa bulunamadı',
    'notFound.body': 'Aradığınız sayfa mevcut değil ya da taşınmış olabilir.',
    'notFound.cta': 'Ana sayfaya dön',

    'footer.rights': 'Tüm hakları saklıdır.',
    'footer.rss': 'RSS',
    'skip.content': 'İçeriğe geç',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof (typeof ui)['en'];
