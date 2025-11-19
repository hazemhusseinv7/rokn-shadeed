import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

let cachedData: ApiResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function getCachedData() {
  const now = Date.now();

  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const response = await fetch(`${APPS_SCRIPT_URL}?type=all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Apps Script API responded with status: ${response.status}`,
    );
  }

  const data: ApiResponse = await response.json();

  cachedData = data;
  cacheTimestamp = now;

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const locale = searchParams.get("locale") || "en";

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
      });
    }

    const data = await getCachedData();

    if (!data.success) {
      throw new Error(data.error || "Unknown error from Apps Script");
    }

    const allItems = [
      ...(data.data.companies || []).map((company) => ({
        ...company,
        type: "company" as const,
      })),
      ...(data.data.subCompanies || []).map((subCompany) => ({
        ...subCompany,
        type: "sub-company" as const,
      })),
    ];

    const searchResults = allItems.filter((item) => {
      const searchableText =
        item.type === "company"
          ? `${item.name.en || ""} ${item.name.ar || ""} ${item.description.en || ""} ${item.description.ar || ""}`.toLowerCase()
          : `${item.brand || ""} ${item.company || ""}`.toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });

    const formattedResults = searchResults
      .map((item, index) => {
        if (item.type === "company") {
          return {
            id: `company-${index}`,
            type: "company" as const,
            name:
              locale === "ar"
                ? item.name.ar || item.name.en
                : item.name.en || item.name.ar,
            description:
              locale === "ar"
                ? item.description.ar || item.description.en
                : item.description.en || item.description.ar,
            tier: item.tier || "",
            logo: item.logo || "",
          };
        } else {
          return {
            id: `subcompany-${index}`,
            type: "sub-company" as const,
            name: item.brand || "",
            company: item.company || "",
            tier: item.tier || "",
            logo: item.logo || "",
          };
        }
      })
      .filter((item) => item.name);

    return NextResponse.json({
      success: true,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching data from Apps Script:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
        results: [],
      },
      { status: 500 },
    );
  }
}
