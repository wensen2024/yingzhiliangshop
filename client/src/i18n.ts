import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './lib/i18n';

// Wrap translations in 'translation' namespace which is the default in i18next
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = {
    translation: translations[lang as keyof typeof translations]
  };
  return acc;
}, {} as any);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
