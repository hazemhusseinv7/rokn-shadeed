"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "motion/react";
import { Search, Send, Loader2, AlertTriangle } from "lucide-react";
import useDebounce from "@/hooks/use-debounce";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

interface SearchResultItem {
  id: string;
  type: "company" | "sub-company";
  name: string;
  brand?: string;
  description?: string;
  company?: string;
  tier?: string;
  logo?: string;
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  },
} as const;

function ActionSearchBar({
  defaultOpen = false,
  searchInputs = [],
}: {
  defaultOpen?: boolean;
  searchInputs?: { label: string }[];
}) {
  const t = useTranslations("Search");

  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const searchCompanies = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`,
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Search failed. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchCompanies();
  }, [debouncedQuery, isMounted, locale]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setActiveIndex(-1);

      if (!isFocused) {
        setIsFocused(true);
      }
    },
    [isFocused],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (results.length > 0) {
            setActiveIndex((prev) =>
              prev < results.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (results.length > 0) {
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : results.length - 1,
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            const link = document.getElementById(
              `result-${results[activeIndex].id}`,
            ) as HTMLAnchorElement;
            if (link) {
              link.click();
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsFocused(false);
          setActiveIndex(-1);
          setQuery("");
          break;
      }
    },
    [results, activeIndex],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setActiveIndex(-1);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setActiveIndex(-1);
    }, 150);
  }, []);

  const getResultUrl = (result: SearchResultItem) => {
    return `/boycott/${result.name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const placeholderStrings = searchInputs.map((p) => p.label);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative flex min-h-[300px] flex-col items-center justify-start px-4">
        <div className="sticky top-0 z-10 w-full max-w-lg pt-4 pb-1">
          <div className="relative">
            <div
              className="flex flex-col items-center justify-center"
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-expanded={isFocused}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0
                  ? `action-${results[activeIndex]?.id}`
                  : undefined
              }
              id="search"
            >
              <PlaceholdersAndVanishInput
                placeholders={placeholderStrings}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
            <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" /> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="mt-1 w-full overflow-hidden rounded-md border bg-white shadow-xs dark:border-gray-800 dark:bg-black"
                variants={ANIMATION_VARIANTS.container}
                role="listbox"
                aria-label="Search results"
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul role="none" className="max-h-80 overflow-y-auto">
                  {/* Loading State */}
                  {loading && (
                    <motion.li
                      className="flex items-center justify-center rounded-md px-3 py-4 opacity-70"
                      variants={ANIMATION_VARIANTS.item}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-500">
                          {t("messages.searching")}
                        </span>
                      </div>
                    </motion.li>
                  )}
                  {/* Error State */}
                  {error && !loading && (
                    <motion.li
                      className="flex items-center justify-center rounded-md px-3 py-4 opacity-70"
                      variants={ANIMATION_VARIANTS.item}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-500">
                          {t("messages.search-unavailable")}
                        </span>
                      </div>
                    </motion.li>
                  )}
                  {/* No Results State */}
                  {!loading &&
                    !error &&
                    results.length === 0 &&
                    query.length >= 2 && (
                      <motion.li
                        className="flex items-center justify-center rounded-md px-3 py-4 opacity-70"
                        variants={ANIMATION_VARIANTS.item}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {t("messages.no-results")}
                          </span>
                        </div>
                      </motion.li>
                    )}
                  {/* Initial State - Type to search */}
                  {!loading &&
                    !error &&
                    results.length === 0 &&
                    query.length < 2 && (
                      <motion.li
                        className="flex items-center justify-center rounded-md px-3 py-4 opacity-70"
                        variants={ANIMATION_VARIANTS.item}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        <span className="text-sm text-gray-500">
                          {t("messages.type-to-search")}
                        </span>
                      </motion.li>
                    )}
                  {/* Search Results */}
                  {results.map((result, index) => (
                    <motion.li
                      key={result.id}
                      id={`result-${result.id}`}
                      className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-zinc-900 ${
                        activeIndex === index
                          ? "bg-gray-100 dark:bg-zinc-800"
                          : ""
                      }`}
                      variants={ANIMATION_VARIANTS.item}
                      // layout
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <Link
                        href={getResultUrl(result)}
                        className="flex w-full items-center justify-between gap-2"
                        target="_blank"
                      >
                        <div className="flex items-center gap-2">
                          {result.logo && (
                            <img
                              src={result.logo}
                              className="size-4 text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {result.name}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "size-4 rounded-full",
                            result.tier?.charAt(0) === "1"
                              ? "bg-[#ff5861]"
                              : result.tier?.charAt(0) === "2"
                                ? "bg-[#fb923c]"
                                : result.tier?.charAt(0) === "3"
                                  ? "bg-[#fde047]"
                                  : result.tier?.charAt(0) === "4"
                                    ? "bg-[#00a96e]"
                                    : "bg-gray-400",
                          )}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-2 border-t border-gray-100 px-3 py-2 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {/* Tier 1 - Financial support */}
                    <div className="flex items-center gap-1">
                      <div className="size-3 rounded-full bg-[#ff5861]"></div>
                      <span>{t("indicator.type-1")}</span>
                    </div>
                    {/* Tier 2 - Moral support */}
                    <div className="flex items-center gap-1">
                      <div className="size-3 rounded-full bg-[#fb923c]"></div>
                      <span>{t("indicator.type-2")}</span>
                    </div>
                    {/* Tier 3 - Indirect support */}
                    <div className="flex items-center gap-1">
                      <div className="size-3 rounded-full bg-[#fde047]"></div>
                      <span>
                        <span>{t("indicator.type-3")}</span>
                      </span>
                    </div>
                    {/* Tier 4 - Safe */}
                    <div className="flex items-center gap-1">
                      <div className="size-3 rounded-full bg-[#00a96e]"></div>
                      <span>{t("indicator.type-4")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ActionSearchBar;
