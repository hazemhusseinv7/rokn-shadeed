"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: React.ComponentProps<typeof NextThemesProvider>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
