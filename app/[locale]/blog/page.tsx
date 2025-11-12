import { Timeline } from "@/components/ui/timeline";
import { getBlogPosts } from "@/lib/sanity/queries";

export default async function page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  const posts: BlogPost[] | null = await getBlogPosts(locale);

  if (!posts) return;

  return (
    <main className="min-h-screen">
      <div className="relative w-full overflow-clip">
        <Timeline data={posts} />
      </div>
    </main>
  );
}
