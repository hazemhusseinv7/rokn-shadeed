import { sanityClient } from "@/lib/sanity/client";

const REVALIDATE_TIME =
  process.env.NODE_ENV === "production"
    ? Number(process.env.REVALIDATE_TIME) || 3600
    : 0;

export async function getSettingsData(): Promise<SettingsType | null> {
  const query = `*[_type == "settings"][0]{
    email,
    phone, 
    twitter,
    linkedin,
    tiktok,
    telegram,
    snapchat,
    whatsapp,
    facebook,
    youtube,
    instagram
  }`;

  try {
    return await sanityClient.fetch(
      query,
      {},
      {
        next: {
          revalidate: REVALIDATE_TIME,
          tags: ["settings"],
        },
      },
    );
  } catch (error) {
    console.error("Error fetching settings data:", error);
    return null;
  }
}

export async function getHeroData(
  lang: string = "en",
): Promise<HeroType | null> {
  const query = `*[_type == "main"][0] {
    "title": title[][_key == $lang][0].value,
    searchInputs[] {
      "label": label[_key == $lang][0].value
    }
  }`;

  try {
    return await sanityClient.fetch(
      query,
      { lang },
      {
        next: { revalidate: REVALIDATE_TIME, tags: ["hero", "content"] },
      },
    );
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

export async function getBlogPosts(
  lang: string = "en",
): Promise<BlogPost[] | null> {
  const query = `*[_type == "blog"] | order(publishedAt desc) {
    _id,
    "title": title[][_key == $lang][0].value,
    slug,
    mainImage,
    publishedAt,
    "author": author->{
      "name": name[][_key == $lang][0].value,
      image, 
      bio
    },
    "categories": categories[]->{
      "title": title[][_key == $lang][0].value,
      description
    },
    "body": select(
      $lang == "en" => bodyEn,
      $lang == "ar" => bodyAr
    )
  }`;

  try {
    return await sanityClient.fetch(
      query,
      { lang },
      {
        next: { revalidate: REVALIDATE_TIME, tags: ["blog", "content"] },
      },
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPost(
  slug: string,
  lang: string = "en",
): Promise<BlogPost | null> {
  const query = `*[_type == "blog" && slug.current == $slug][0] {
    _id,
    "title": title[][_key == $lang][0].value,
    slug,
    mainImage,
    publishedAt,
    "author": author->{
      "name": name[][_key == $lang][0].value,
      image, 
      bio
    },
    "categories": categories[]->{
      "title": title[][_key == $lang][0].value,
      description
    },
    "body": select(
      $lang == "en" => bodyEn,
      $lang == "ar" => bodyAr
    )
  }`;

  try {
    return await sanityClient.fetch(
      query,
      { slug, lang },
      {
        next: {
          revalidate: REVALIDATE_TIME,
          tags: [`blog-post-${slug}`, "content"],
        },
      },
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function getFooterData(
  lang: string = "en",
): Promise<FooterType | null> {
  const query = `*[_type == "footer"][0] {
    "globeButton": globeButton[][_key == $lang][0].value,
    globeButtonLink,
    "globeTitleLine1": globeTitleLine1[][_key == $lang][0].value,
    "globeTitleLine2": globeTitleLine2[][_key == $lang][0].value,
    "globeDescriptionLine1": globeDescriptionLine1[][_key == $lang][0].value,
    "globeDescriptionLine2": globeDescriptionLine2[][_key == $lang][0].value,
    "cardDescription": cardDescription[][_key == $lang][0].value
  }`;

  try {
    return await sanityClient.fetch(
      query,
      { lang },
      {
        next: {
          revalidate: REVALIDATE_TIME,
          tags: ["footer", "content"],
        },
      },
    );
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}
