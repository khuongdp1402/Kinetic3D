"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>("EN");

  useEffect(() => {
    // Check google translate cookie to set initial language
    const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (cookie) {
      const val = cookie.split('=')[1];
      if (val.includes('/vi')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentLang("VI");
      }
    }
  }, []);

  const handleLangChange = (lang: string) => {
    // Google Translate uses googtrans cookie: /en/vi
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang.toLowerCase()}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${lang.toLowerCase()}; path=/`;
    setCurrentLang(lang);
    window.location.reload();
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 font-mono text-sm uppercase tracking-widest text-primary hover:text-accent-cyan transition-colors">
        <Globe className="w-4 h-4" />
        {currentLang}
      </button>
      <div className="absolute top-full right-0 mt-2 w-24 bg-primary border border-border-color shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto flex flex-col z-50">
        <button 
          onClick={() => handleLangChange("EN")}
          className={`px-4 py-2 text-sm font-mono hover:bg-secondary text-left transition-colors ${currentLang === "EN" ? "text-accent-cyan" : "text-primary"}`}
        >
          EN
        </button>
        <button 
          onClick={() => handleLangChange("VI")}
          className={`px-4 py-2 text-sm font-mono hover:bg-secondary text-left transition-colors ${currentLang === "VI" ? "text-accent-cyan" : "text-primary"}`}
        >
          VI
        </button>
      </div>
    </div>
  );
}
