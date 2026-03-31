import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import i18n from "@/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { code: "zh", name: "中文" },
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "it", name: "Italiano" },
  ];

  return (
    <div className="flex gap-1 bg-[oklch(0.12_0.02_260)] rounded-lg p-1 border border-[oklch(0.2_0.03_260)]">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang.code as Language)}
          variant={language === lang.code ? "default" : "ghost"}
          size="sm"
          className={`text-xs font-medium ${
            language === lang.code
              ? "bg-[oklch(0.72_0.22_240)] text-white"
              : "text-[oklch(0.6_0.02_240)] hover:text-white"
          }`}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
