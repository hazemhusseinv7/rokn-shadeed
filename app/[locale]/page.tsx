import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getSettingsData } from "@/lib/sanity/queries";

import Hero from "@/components/Hero";
import LatestNews from "@/components/LatestNews";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale as Locale);

  const settings: SettingsType | null = await getSettingsData();

  return (
    <main>
      <Hero params={params} />
      <LatestNews settings={settings} />
    </main>
  );
}
