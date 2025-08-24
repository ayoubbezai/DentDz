// contexts/GlobalUIContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface GlobalUIContextType {
  isFullScreen: boolean;
  toggleFullscreen: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(
  undefined
);

interface GlobalUIProviderProps {
  children: ReactNode;
}

export const GlobalUIProvider: React.FC<GlobalUIProviderProps> = ({
  children,
}) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("EN");

  // Initialize with current fullscreen state
  useEffect(() => {
    setIsFullScreen(!!document.fullscreenElement);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) =>
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        );
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) =>
          console.error(`Error attempting to exit fullscreen: ${err.message}`)
        );
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <GlobalUIContext.Provider
      value={{
        isFullScreen,
        toggleFullscreen,
        language,
        setLanguage,
      }}
    >
      {children}
    </GlobalUIContext.Provider>
  );
};

export const useGlobalUI = (): GlobalUIContextType => {
  const context = useContext(GlobalUIContext);
  if (context === undefined) {
    throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  }
  return context;
};
