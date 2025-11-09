import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import Hero from "@/components/Hero";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return (
    <main className="min-h-[200vh]">
      <Hero params={params} />
    </main>
  );
}
