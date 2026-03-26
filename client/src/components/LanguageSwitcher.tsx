import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 bg-[oklch(0.12_0.02_260)] rounded-lg p-1 border border-[oklch(0.2_0.03_260)]">
      {(["zh", "en"] as const).map((lang) => (
        <Button
          key={lang}
          onClick={() => setLanguage(lang)}
          variant={language === lang ? "default" : "ghost"}
          size="sm"
          className={`text-xs font-medium ${
            language === lang
              ? "bg-[oklch(0.72_0.22_240)] text-white"
              : "text-[oklch(0.6_0.02_240)] hover:text-white"
          }`}
        >
          {lang === "zh" ? "中文" : "English"}
        </Button>
      ))}
    </div>
  );
}
