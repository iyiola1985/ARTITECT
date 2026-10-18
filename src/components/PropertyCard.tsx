import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Ruler } from "lucide-react";
import {
  availabilityNote,
  formatGuidePrice,
  kindLabel,
} from "@/lib/properties";
import type { Availability, Residence } from "@/lib/types";

function statusDot(status: Availability): string {
  switch (status) {
    case "Available":
      return "bg-moss";
    case "By request":
      return "bg-gold";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function PropertyCard({ residence }: { residence: Residence }) {
  const image = residence.images[0];

  return (
    <article className="group">
      <Link href={`/residences/${residence.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep shadow-[0_24px_50px_-36px_rgba(20,19,17,0.7)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-charcoal/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-paper backdrop-blur-sm">
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusDot(residence.availability)}`}
              aria-hidden="true"
            />
            {residence.availability}
          </div>
        </div>
        <div className="pt-5">
          <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone">
            <span>{kindLabel(residence.kind)}</span>
            <span>{residence.location}</span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h3 className="font-display text-3xl leading-none text-ink transition-colors duration-300 group-hover:text-moss-deep">
              {residence.name}
            </h3>
            <ArrowUpRight
              className="mt-1 h-5 w-5 shrink-0 text-gold transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-stone">
            {residence.summary}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
            <div className="inline-flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-gold" aria-hidden="true" />
              <dt className="sr-only">Suites</dt>
              <dd>{residence.suites}</dd>
            </div>
            <div className="inline-flex items-center gap-2">
              <Bath className="h-4 w-4 text-gold" aria-hidden="true" />
              <dt className="sr-only">Baths</dt>
              <dd>{residence.baths}</dd>
            </div>
            <div className="inline-flex items-center gap-2">
              <Ruler className="h-4 w-4 text-gold" aria-hidden="true" />
              <dt className="sr-only">Area</dt>
              <dd>{residence.areaSqm} m²</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm tracking-wide text-ink">
            <span className="text-stone">Guide </span>
            {formatGuidePrice(residence.priceGuide)}
          </p>
          <p className="sr-only">{availabilityNote(residence.availability)}</p>
        </div>
      </Link>
    </article>
  );
}
