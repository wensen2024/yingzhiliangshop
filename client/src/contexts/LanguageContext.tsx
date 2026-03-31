import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import i18n from "@/i18n";
import type { Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem("language") as Language | null;
    if (saved && (saved === "zh" || saved === "en" || saved === "de" || saved === "fr" || saved === "es" || saved === "it")) return saved;
    
    // Try to detect from browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) return "zh";
    if (browserLang.startsWith("de")) return "de";
    if (browserLang.startsWith("fr")) return "fr";
    if (browserLang.startsWith("es")) return "es";
    if (browserLang.startsWith("it")) return "it";
    return "en";
  });

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
