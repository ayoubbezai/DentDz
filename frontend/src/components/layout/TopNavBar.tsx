"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useGlobalUI } from "@/context/GlobalUIContext";

import {
  Users,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  Settings,
  ChevronDown,
  Globe,
  Maximize,
  Minimize,
} from "lucide-react";
export default function ToppNavBar({
  title,
  search_placeholder,
}: {
  title: string;
  search_placeholder: string;
}) {
  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
    { code: "AR", name: "العربية" },
  ];
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { isFullScreen, toggleFullscreen, language, setLanguage } =
    useGlobalUI();
  return (
    <div className="flex items-center justify-between mb-3 ">
      <div className="flex items-center ">
        <h1 className="text-lg font-semibold text-foreground mr-3">{title}</h1>
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={search_placeholder}
            className="w-full pl-8 py-1 text-xs text-primary-black bg-background/90 rounded-md border-neutral-300 focus-visible:ring-1 focus-visible:ring-neutral-200 h-7 placeholder:text-xs placeholder:text-neutral-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Language Selector */}
        <div className="relative">
          <button
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded-md hover:bg-neutral-100"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="text-xs">{language}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-border overflow-hidden z-10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`w-full text-left px-2 py-1 text-xs hover:bg-neutral-100 transition-colors flex items-center ${
                    language === lang.code
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground"
                  }`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageDropdown(false);
                  }}
                >
                  <span className="w-5 text-xs font-mono">{lang.code}</span>
                  <span className="ml-1 truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider Line */}
        <div className="h-5 w-[1.5px] bg-border"></div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isFullScreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>

        {/* Divider Line */}
        <div className="h-5 w-[1.5px] bg-border"></div>

        {/* Settings Icon */}
        <button className="p-1 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors">
          {}
          <Settings className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1.5px] bg-border"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Image
              src="/me.jpg"
              alt="User profile"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover border border-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-green-500 border border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground leading-tight">
              Ayoub Bezai
            </span>
            <span className="text-[0.65rem] text-muted-foreground leading-tight">
              Dentist
            </span>
          </div>
          <ChevronDown className="h-5 w-5  text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
