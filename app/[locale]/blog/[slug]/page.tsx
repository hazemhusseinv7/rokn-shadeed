import Image from "next/image";
import { PortableText } from "@portabletext/react";

import { getBlogPost, getBlogPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

import Author from "../Author";
import Category from "../Category";
import { getLocale } from "next-intl/server";

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(800).height(600).url()}
            alt={value.alt || "Blog image"}
            width={800}
            height={600}
            className="mx-auto rounded-lg"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
};

// Generate static params for SSG
export async function generateStaticParams() {
  const languages = ["en", "ar"];
  const allPosts = [];

  for (const locale of languages) {
    const posts = await getBlogPosts(locale);
    if (posts) {
      allPosts.push(
        ...posts.map((post) => ({
          slug: post.slug.current,
        })),
      );
    }
  }

  return allPosts;
}

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();

  const post = await getBlogPost(slug, locale);

  if (!post) return;

  return (
    <main className="min-h-screen">
      {/* Blog Article */}
      <div className="mx-auto max-w-3xl px-4 py-42 sm:px-6 lg:px-8 lg:py-48">
        <div className="max-w-2xl">
          {/* Content */}
          <div className="space-y-5 md:space-y-8">
            <h1 className="text-3xl font-bold lg:text-5xl dark:text-white">
              {post.title}
            </h1>

            {post.publishedAt && (
              <span className="block text-xs text-zinc-800 sm:text-sm dark:text-zinc-200">
                {new Date(post.publishedAt).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            </article>

            {post.author && (
              // Avatar Media
              <Author
                className="flex items-center justify-between"
                name={post.author.name}
                image={post.author.image}
                bio={post.author.bio}
              />
              // End Avatar Media
            )}

            {post.categories && (
              <div className="flex flex-col gap-y-5 lg:flex-row lg:items-center lg:justify-between lg:gap-y-0">
                {/* Categories Tags */}
                <div>
                  {post.categories.map((category, i) => (
                    <Category
                      key={i}
                      className="rounded-full"
                      title={category.title}
                      description={category.description}
                    />
                  ))}
                </div>
                {/* End Categories Tags */}
              </div>
            )}
          </div>
          {/* End Content */}
        </div>
      </div>
      {/* End Blog Article */}
    </main>
  );
}
