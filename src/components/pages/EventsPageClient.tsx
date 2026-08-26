"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SearchIcon } from "lucide-react";
import debounce from "lodash.debounce";
import { useCategories, useEvents } from "@/lib/queries/events";
import { useAuthStore } from "@/lib/store/auth.store";
import { useFilterStore } from "@/lib/store/filter.store";
import EventCard from "@/components/EventCard";
import EventGridSkeleton from "@/components/skeletons/EventGridSkeleton";
import CategoryChipsSkeleton from "@/components/skeletons/CategoryChipsSkeleton";
import NumberedPagination from "@/components/NumberedPagination";
import { cn, formatPrice, IMAGE_PLACEHOLDER } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SEARCH_DEBOUNCE_MS = 400;

export default function EventsPageClient() {
  const t = useTranslations("EventsPage");
  const common = useTranslations("Common");
  const [page, setPage] = useState(1);

  const { isAuthenticated } = useAuthStore();
  const { categoryId, searchQuery, setCategory, setSearchQuery } =
    useFilterStore();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
      }, SEARCH_DEBOUNCE_MS),
    [setSearchQuery],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [debouncedSetSearchQuery]);

  const { data, isLoading, isError, error } = useEvents(
    page,
    12,
    categoryId,
    searchQuery,
  );

  const handleCategoryChange = (value: string | null) => {
    setCategory(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSetSearchQuery(value);
  };

  const showcaseFeatured =
    page === 1 && !categoryId && !searchQuery && !isLoading && !isError;
  const featured = showcaseFeatured ? (data?.data.slice(0, 3) ?? []) : [];

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-2xl font-bold text-red-600">{t("errorTitle")}</p>
        <p className="mt-2 text-ink-500">
          {error?.message ?? t("errorFallback")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero band with a floating search/category panel overlapping its edge */}
      <section className="hero-blue">
        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 sm:pb-28 lg:px-8">
          <h1 className="max-w-xl text-4xl font-extrabold text-white sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-lg text-blue-100">{t("heroSubtitle")}</p>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="floating-panel relative -top-14 p-4 sm:-top-16 sm:p-5">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-auto w-full rounded-xl border-line bg-surface-alt py-3 pr-4 pl-11 text-base text-ink-900 placeholder:text-ink-400 focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-0"
              />
            </div>

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {categoriesLoading ? (
                <CategoryChipsSkeleton />
              ) : (
                <>
                  <Button
                    variant={!categoryId ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => handleCategoryChange(null)}
                    className={cn(
                      "shrink-0 rounded-full",
                      categoryId && "bg-surface-sunken text-ink-500",
                    )}
                  >
                    {t("categoryAll")}
                  </Button>
                  {categories.map((c) => (
                    <Button
                      key={c.id}
                      variant={categoryId === c.id ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => handleCategoryChange(c.id)}
                      className={cn(
                        "shrink-0 rounded-full",
                        categoryId !== c.id && "bg-surface-sunken text-ink-500",
                      )}
                    >
                      {c.name}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-ink-900">
              {t("trendingNow")}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:auto-rows-[15rem]">
              {featured.map((event, i) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={cn(
                    "card-shadow group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl p-4 transition-shadow hover:shadow-lg sm:h-auto",
                    i === 0 && "sm:col-span-2 sm:row-span-2",
                  )}
                >
                  <Image
                    src={event.image_url || IMAGE_PLACEHOLDER}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/20 to-transparent" />
                  <span className="relative z-[2] mb-1 inline-block w-fit rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                    {event.category.name}
                  </span>
                  <h3 className="relative z-[2] line-clamp-2 text-xl font-bold text-white">
                    {event.title}
                  </h3>
                  <span className="relative z-[2] mt-1 text-sm font-semibold text-green-400">
                    {formatPrice(event.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="mb-6 text-2xl font-bold text-ink-900">
          {t("allEvents")}
        </h2>

        {isLoading ? (
          <EventGridSkeleton />
        ) : (
          <>
            {data?.data.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-xl font-semibold text-ink-700">
                  {t("noEventsFound")}
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  {t("tryAnotherCategory")}
                </p>
              </div>
            ) : (
              <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    canPurchase={isAuthenticated}
                    priority={i === 0 && !showcaseFeatured}
                  />
                ))}
              </div>
            )}

            {data && data.pagination.total_pages > 1 && (
              <NumberedPagination
                page={page}
                totalPages={data.pagination.total_pages}
                onPageChange={setPage}
                prevLabel={common("prev")}
                nextLabel={common("next")}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
