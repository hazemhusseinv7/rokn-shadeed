"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";

interface TelegramPostProps {
  width?: string;
  showUserpic?: boolean;
  settings?: SettingsType | null;
}

const TelegramPost = ({
  width = "100%",
  showUserpic = true,
  settings,
}: TelegramPostProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [initialTheme, setInitialTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const postUrl = useMemo(() => {
    if (!settings?.telegramPost) return "";

    const url = settings.telegramPost;
    const match = url.match(/t\.me\/(.+)/);
    return match ? match[1] : url;
  }, [settings?.telegramPost]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme) {
        if (storedTheme === "light" || storedTheme === "dark") {
          setInitialTheme(storedTheme);
        } else if (storedTheme === "system") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          setInitialTheme(prefersDark ? "dark" : "light");
        }
      }
    }
  }, []);

  const currentTheme = useMemo(() => {
    if (!mounted) return initialTheme;

    if (resolvedTheme) {
      return resolvedTheme;
    }

    if (theme && theme !== "system") {
      return theme;
    }

    return initialTheme;
  }, [resolvedTheme, theme, initialTheme, mounted]);

  const isDarkMode = currentTheme === "dark";

  useEffect(() => {
    if (!mounted || !postUrl) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", postUrl);
    script.setAttribute("data-width", width);
    script.setAttribute("data-userpic", showUserpic.toString());
    script.setAttribute("data-dark", isDarkMode ? "1" : "0");

    const container = document.getElementById("telegram-post-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [postUrl, width, showUserpic, isDarkMode, mounted]);

  if (!settings?.telegramPost) {
    return null;
  }

  return (
    <section id="telegram-post-container" className="w-full px-10 py-20" />
  );
};

export default TelegramPost;
