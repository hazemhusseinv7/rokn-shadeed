import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const REVALIDATE_DURATION = 24 * 60 * 60;

export async function generateStaticParams() {
  try {
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
    const response = await fetch(`${APPS_SCRIPT_URL}?type=all`, {
      next: { revalidate: REVALIDATE_DURATION },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.success) return [];

    const companySlugs =
      data.data.companies?.map((company: Company) => ({
        slug: company.name.en
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      })) || [];

    const subCompanySlugs =
      data.data.subCompanies?.map((sub: SubCompany) => ({
        slug: sub.brand
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      })) || [];

    return [...companySlugs, ...subCompanySlugs];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale(); // Get the current locale

  const result = await getBoycottCompany(slug);

  if (!result) {
    notFound();
  }

  const {
    type,
    data: boycottCompany,
  }: { type: "company" | "sub-company"; data: Company | SubCompany } = result;
  const t = await getTranslations("Search");

  // Helper functions to get localized content
  const getName = () => {
    if (type === "company") {
      const company = boycottCompany as Company;
      return locale === "ar"
        ? company.name.ar || company.name.en
        : company.name.en || company.name.ar;
    } else {
      const subCompany = boycottCompany as SubCompany;
      return subCompany.brand;
    }
  };

  const getDescription = () => {
    if (type === "company") {
      const company = boycottCompany as Company;
      return locale === "ar"
        ? company.description.ar || company.description.en
        : company.description.en || company.description.ar;
    }
    return null;
  };

  const getCompanyName = () => {
    if (type === "sub-company") {
      const subCompany = boycottCompany as SubCompany;
      return subCompany.company;
    }
    return null;
  };

  return (
    <main className="min-h-screen px-10 py-40">
      <h1 className="mx-auto mb-10 w-fit text-2xl font-bold lg:text-4xl">
        {t("title")}
      </h1>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex gap-4">
          <div className="size-20 overflow-hidden rounded-md border border-zinc-700 lg:size-40">
            {boycottCompany.logo ? (
              <img
                src={boycottCompany.logo}
                className="size-full object-contain"
              />
            ) : (
              <div className="size-full bg-zinc-900" />
            )}
          </div>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex gap-4 max-lg:flex-col">
              <div className="text-lg font-semibold lg:text-2xl">
                {getName()}
              </div>

              <div
                className={cn(
                  "flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white",
                  boycottCompany.tier?.charAt(0) === "1"
                    ? "bg-[#ff5861]"
                    : boycottCompany.tier?.charAt(0) === "2"
                      ? "bg-[#fb923c]"
                      : boycottCompany.tier?.charAt(0) === "3"
                        ? "bg-[#fde047]"
                        : boycottCompany.tier?.charAt(0) === "4"
                          ? "bg-[#00a96e]"
                          : "bg-gray-400",
                )}
              >
                <span>
                  {boycottCompany.tier?.charAt(0) === "1"
                    ? t("indicator.type-1")
                    : boycottCompany.tier?.charAt(0) === "2"
                      ? t("indicator.type-2")
                      : boycottCompany.tier?.charAt(0) === "3"
                        ? t("indicator.type-3")
                        : boycottCompany.tier?.charAt(0) === "4"
                          ? t("indicator.type-4")
                          : "Unknown Tier"}
                </span>
              </div>
            </div>
            <div className="font-light">{boycottCompany.category}</div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            {t("description.item-1")}
          </h2>
          <div className="rounded-lg bg-zinc-200 p-6 dark:bg-zinc-800">
            {type === "company" && getDescription() && (
              <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                {getDescription()}
              </p>
            )}

            {type === "sub-company" && (
              <p className="text-zinc-700 dark:text-zinc-300">
                {t("description.item-2")}{" "}
                <Link
                  href={getResultUrl(getCompanyName()!)}
                  target="_blank"
                  className="transition-colors duration-300 hover:text-zinc-50"
                >
                  <strong>{getCompanyName()}</strong>
                </Link>
              </p>
            )}
          </div>
        </div>

        <Link
          className="mt-8 w-fit"
          href={boycottCompany.proof || "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="cursor-pointer px-8 py-5">{t("proof")}</Button>
        </Link>
      </div>
    </main>
  );
}

async function getBoycottCompany(slug: string) {
  try {
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

    const response = await fetch(`${APPS_SCRIPT_URL}?type=all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: REVALIDATE_DURATION },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch data");
    }

    const company = data.data.companies?.find(
      (comp: Company) =>
        comp.name.en
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") === slug ||
        comp.name.ar
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") === slug,
    );

    if (company) {
      return {
        type: "company" as const,
        data: company,
      };
    }

    const subCompany = data.data.subCompanies?.find(
      (sub: SubCompany) =>
        sub.brand
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") === slug,
    );

    if (subCompany) {
      return {
        type: "sub-company" as const,
        data: subCompany,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching company data:", error);
    return null;
  }
}

const getResultUrl = (result: string) => {
  return `/boycott/${result
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")}`;
};
