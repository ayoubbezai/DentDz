import { Button } from "@/components/ui/button";
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
import { HeaderProps } from "../types";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header({
  activeView,
  viewMode,
  onViewChange,
  onViewModeChange,
  patientCounts,
  onAddPatient = () => {},
  onFilterClick = () => {},
}: HeaderProps) {
  const [language, setLanguage] = useState("EN");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
    { code: "AR", name: "العربية" },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) =>
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        );
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) =>
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        );
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-foreground mr-3">
            Patients List
          </h1>
          <div className="relative w-52">
            <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
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
            {isFullscreen ? (
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
      <hr className="my-3 border-border" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-start space-x-4">
          <button
            onClick={() => onViewChange("active")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "active"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Active Patients
          </button>
          <button
            onClick={() => onViewChange("archive")}
            className={`text-xs font-medium pb-1.5 transition-all duration-200 ${
              activeView === "archive"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            Archive Patients
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1.5 py-1">
        <div className="flex items-center gap-1.5 ">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">
            <span className="font-semibold text-[0.95rem]">
              {activeView === "active"
                ? patientCounts.active
                : patientCounts.archive}
            </span>{" "}
            Total Patients
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-7 text-xs border-border text-muted-foreground/70 hover:text-foreground hover:bg-neutral-100 transition-colors"
            onClick={onFilterClick}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>

          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-[5px] relative transition-colors ${
                viewMode === "grid"
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {viewMode === "grid" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all"></div>
              )}
              <Grid className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-border"></div>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-[5px] relative transition-colors ${
                viewMode === "list"
                  ? "text-primary"
                  : "text-muted-foreground/70 hover:text-foreground"
              }`}
            >
              {viewMode === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all"></div>
              )}
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            className="flex items-center rounded-[4px] gap-1.5 h-7 text-xs transition-colors"
            onClick={onAddPatient}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Patient
          </Button>
        </div>
      </div>
    </>
  );
}
