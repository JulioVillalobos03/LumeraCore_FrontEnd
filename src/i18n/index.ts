import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";

const LANG_KEY = "lumera_lang";

const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.languages?.[0];
  if (!lang) return "es";

  const short = lang.split("-")[0];
  return ["es", "en"].includes(short) ? short : "es";
};

const saved = localStorage.getItem(LANG_KEY);
const lng = saved ?? getBrowserLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    lng,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    }
  });

export const setLanguage = (lang: "es" | "en") => {
  i18n.changeLanguage(lang);
  localStorage.setItem(LANG_KEY, lang);
};

export default i18n;
