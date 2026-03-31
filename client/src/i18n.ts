import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './lib/i18n';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translations,
    lng: 'zh', // default language
    fallbackLng: 'en', // fallback language if translation not found

    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;
