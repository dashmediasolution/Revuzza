"use client";

import { useTranslation } from "@/components/shared/translation-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
}

export function LanguageSelector({ variant = 'header' }: LanguageSelectorProps) {
  const { targetLang, setTargetLang } = useTranslation();
  const currentLang = LANGUAGES.find(l => l.code === targetLang) || LANGUAGES[0];

  const isFooter = variant === 'footer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-9 px-3 gap-2 font-bold text-[11px] uppercase tracking-widest transition-all rounded-none border",
            isFooter 
              ? "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-10" 
              : "bg-transparent border-transparent text-gray-600 hover:bg-gray-100"
          )}
        >
          <Globe className={cn("h-3.5 w-3.5", isFooter ? "text-white" : "text-[#0892A5]")} />
          
          {/* ✅ HEADER: Shows 'EN' | FOOTER: Shows 'English' */}
          <span>
            {isFooter ? currentLang.name : currentLang.code}
          </span>
          
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={isFooter ? "center" : "end"} 
        className="w-48 p-1 bg-white border border-gray-100 rounded-none shadow-xl z-[100]"
      >
        <div className="px-3 py-2 border-b border-gray-50 mb-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Select Language
          </p>
        </div>

        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setTargetLang(lang.code)}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-none cursor-pointer transition-colors",
              targetLang === lang.code 
                ? "bg-[#0892A5]/5 text-[#0892A5]" 
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            {/* ✅ DROPDOWN: Always shows Flag + Full Name */}
            <div className="flex items-center gap-3">
              <span className="text-base">{lang.flag}</span>
              <span className="text-xs font-bold uppercase tracking-tight">{lang.name}</span>
            </div>
            
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}