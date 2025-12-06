import { getRedirectPath } from "@/lib/sanity/queries";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Wait for params to resolve
  const { slug } = await params;
  const searchParamsObj = await searchParams;

  // Join the slug array into a path string
  const path = slug ? `/${slug.join("/")}` : "/";
  const redirectPath = path.replace(/^\/|\/$/g, "");

  // Get redirect data for this path
  const redirectData = await getRedirectPath(redirectPath);

  if (redirectData) {
    // Build the destination URL with query parameters
    const destinationUrl = new URL(redirectData.destination);

    // Add any query parameters from the original request
    Object.entries(searchParamsObj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => destinationUrl.searchParams.append(key, v));
      } else if (value) {
        destinationUrl.searchParams.set(key, value);
      }
    });

    // Perform the redirect
    redirect(destinationUrl.toString());
  }

  // If no redirect found, return a 404 page
  return (
    <main className="dark:bg-primary-2/40 bg-primary-1/70 relative flex min-h-screen w-full flex-row justify-center p-6 md:min-w-[960px]">
      <div className="text-center">
        <div className="from-waterloo to-charade absolute top-0 left-0 z-0 w-full bg-linear-to-r bg-clip-text text-center text-8xl lg:text-[400px] leading-[600px] font-bold opacity-10">
          404
        </div>
        <div className="light:bg-[radial-gradient(circle,rgba(224,224,232,0.3)_2%,rgba(247,247,250,1)_80%)] absolute top-0 left-0 h-full w-full dark:bg-[radial-gradient(circle,rgba(36,36,66,0.3)_2%,rgba(2,2,15,1)_80%)]" />
        <div className="flex h-full flex-col justify-center gap-3">
          <div className="grow" />
          <div className="text-text-primary relative z-10 text-5xl! font-bold">
            We lost this page
          </div>
          <div className="dark:text-waterloo light:text-charade relative z-10 opacity-80">
            The page you are looking for doesnt exist or has been moved.
          </div>

          <div className="flex grow flex-col justify-center"></div>
        </div>
      </div>
    </main>
  );
}
