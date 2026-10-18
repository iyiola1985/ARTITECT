import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatGuidePrice, getResidence } from "@/lib/properties";

export function Featured() {
  const residence = getResidence("palm-court");
  if (!residence) {
    return null;
  }

  const image = residence.images[0];

  return (
    <section className="relative min-h-[78vh] bg-charcoal text-paper" aria-labelledby="featured-title">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/35 to-charcoal/10" />
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1500px] flex-col justify-end px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-soft">Featured villa</p>
        <h2 id="featured-title" className="mt-4 max-w-xl font-display text-6xl leading-[0.9] sm:text-7xl">
          {residence.name}
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-paper/80">{residence.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <p className="text-sm tracking-wide">
            <span className="text-paper/60">Guide </span>
            {formatGuidePrice(residence.priceGuide)}
          </p>
          <Link
            href={`/residences/${residence.slug}`}
            className="inline-flex items-center gap-2 border border-paper/30 px-5 py-3 text-[11px] uppercase tracking-[0.2em] transition hover:border-gold hover:text-gold-soft"
          >
            View Palm Court
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
