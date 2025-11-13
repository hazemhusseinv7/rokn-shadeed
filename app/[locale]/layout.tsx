import { Alexandria } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Header from "@/components/Header";
import { Providers } from "@/app/[locale]/providers";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin", "arabic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
) {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <body className={cn(alexandria.variable, "font-alexandria antialiased")}>
        <NextIntlClientProvider>
          <Providers
            themeProps={{
              attribute: "class",
              defaultTheme: "dark",
              enableSystem: true,
            }}
          >
            <Header />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
