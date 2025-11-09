import { sanityClient } from "@/lib/sanity/client";

export async function getHeroData(
  lang: string = "en",
): Promise<HeroType | null> {
  const query = `*[_type == "main"][0] {
    "title": title[_key == $lang][0].value,
    searchInputs[] {
      "label": label[_key == $lang][0].value
    }
  }`;

  try {
    return await sanityClient.fetch(
      query,
      { lang },
      {
        next: { revalidate: 3600, tags: ["hero", "content"] },
      },
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}
