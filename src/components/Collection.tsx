"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { formatGuidePrice, kindLabel, residences } from "@/lib/properties";
import type { Residence, ResidenceKind } from "@/lib/types";

type KindFilter = "all" | ResidenceKind;
type SortKey = "featured" | "price" | "suites";
type ViewMode = "gallery" | "index";

type CollectionProps = {
  variant?: "home" | "catalogue";
};

const filters: { id: KindFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "villa", label: "Villas" },
  { id: "residence", label: "Residences" },
];

function matchesQuery(residence: Residence, query: string): boolean {
  const haystack = `${residence.name} ${residence.location} ${residence.region} ${residence.summary}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function sortResidences(list: Residence[], sort: SortKey): Residence[] {
  const next = [...list];
  switch (sort) {
    case "featured":
      return next;
    case "price":
      return next.sort((a, b) => b.priceGuide - a.priceGuide);
    case "suites":
      return next.sort((a, b) => b.suites - a.suites);
    default: {
      const exhaustive: never = sort;
      return exhaustive;
    }
  }
}

export function Collection({ variant = "home" }: CollectionProps) {
  const [filter, setFilter] = useState<KindFilter>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("gallery");

  const visible = useMemo(() => {
    const filtered = residences.filter((residence) => {
      const kindMatch = filter === "all" ? true : residence.kind === filter;
      return kindMatch && matchesQuery(residence, query);
    });
    return sortResidences(filtered, sort);
  }, [filter, query, sort]);

  const villas = visible.filter((residence) => residence.kind === "villa");
  const homes = visible.filter((residence) => residence.kind === "residence");

  function reset() {
    setFilter("all");
    setSort("featured");
    setQuery("");
    setView("gallery");
  }

  return (
    <section id={variant === "home" ? "collection" : undefined} className="bg-paper px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">The collection</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-6xl">
              {variant === "home" ? "Six houses, offered quietly." : "The full index."}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone">
              Guide prices are placeholders for this demonstration. They are not offers, and the houses are fictional placements of architectural photography.
            </p>
          </div>
          <p className="font-display text-5xl text-ink/15 lg:text-7xl">
            {String(visible.length).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {filters.map((item) => {
              const selected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item.id)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
                    selected ? "bg-charcoal text-paper" : "bg-transparent text-stone hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block min-w-[220px] flex-1">
              <span className="sr-only">Search residences</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or place"
                className="w-full border border-line bg-transparent py-2.5 pl-10 pr-3 text-sm text-ink outline-none placeholder:text-stone/70 focus:border-gold"
              />
            </label>
            <label className="text-sm text-stone">
              <span className="sr-only">Sort residences</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-gold sm:w-auto"
              >
                <option value="featured">Featured order</option>
                <option value="price">Guide price</option>
                <option value="suites">Suites</option>
              </select>
            </label>
            {variant === "catalogue" ? (
              <div className="flex border border-line" role="group" aria-label="Change layout">
                <ViewButton current={view} mode="gallery" onSelect={setView} label="Gallery" />
                <ViewButton current={view} mode="index" onSelect={setView} label="Index" />
              </div>
            ) : null}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-4xl text-ink">Nothing matches that search.</p>
            <p className="mt-3 text-stone">Try another place, or clear the filters.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 border border-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition hover:bg-charcoal hover:text-paper"
            >
              Clear filters
            </button>
          </div>
        ) : variant === "catalogue" && view === "index" ? (
          <IndexList residences={visible} />
        ) : variant === "home" ? (
          <div className="mt-14 space-y-20">
            <Group id="villas" title="Villas" items={villas} />
            <Group id="residences" title="Residences" items={homes} />
          </div>
        ) : (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((residence) => (
              <PropertyCard key={residence.slug} residence={residence} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ViewButton({
  current,
  mode,
  label,
  onSelect,
}: {
  current: ViewMode;
  mode: ViewMode;
  label: string;
  onSelect: (mode: ViewMode) => void;
}) {
  const selected = current === mode;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(mode)}
      className={`px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] ${
        selected ? "bg-charcoal text-paper" : "text-stone"
      }`}
    >
      {label}
    </button>
  );
}

function Group({ id, title, items }: { id: string; title: string; items: Residence[] }) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h3 className="font-display text-4xl text-ink">{title}</h3>
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
          {items.length} {items.length === 1 ? "house" : "houses"}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="border border-dashed border-line px-6 py-10 text-stone">
          No {title.toLowerCase()} match the current search.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((residence) => (
            <PropertyCard key={residence.slug} residence={residence} />
          ))}
        </div>
      )}
    </div>
  );
}

function IndexList({ residences: rows }: { residences: Residence[] }) {
  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {rows.map((residence) => (
        <Link
          key={residence.slug}
          href={`/residences/${residence.slug}`}
          className="grid gap-3 py-5 transition hover:bg-paper-deep/60 sm:grid-cols-[1.4fr_1fr_0.7fr_0.6fr_0.9fr] sm:items-center sm:px-2"
        >
          <span className="font-display text-3xl text-ink">{residence.name}</span>
          <span className="text-sm text-stone">{residence.location}</span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-stone">
            {kindLabel(residence.kind)}
          </span>
          <span className="text-sm text-ink">{residence.suites} suites</span>
          <span className="text-sm text-ink">{formatGuidePrice(residence.priceGuide)}</span>
        </Link>
      ))}
    </div>
  );
}
