"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { availabilityNote, formatGuidePrice, kindLabel } from "@/lib/properties";
import type { Residence } from "@/lib/types";

export function ResidenceHero({ residence }: { residence: Residence }) {
  const [index, setIndex] = useState(0);
  const image = residence.images[index] ?? residence.images[0];
  const hasGallery = residence.images.length > 1;

  function step(direction: -1 | 1) {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) {
        return residence.images.length - 1;
      }
      if (next >= residence.images.length) {
        return 0;
      }
      return next;
    });
  }

  return (
    <div className="bg-charcoal pt-[4.5rem] text-paper">
      <div className="relative h-[72vh] min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={image.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/10 to-charcoal/25" />
        {hasGallery ? (
          <div className="absolute bottom-28 right-5 z-10 flex gap-2 sm:right-8">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-white/25 bg-charcoal/40 text-paper backdrop-blur-sm transition hover:border-gold"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-white/25 bg-charcoal/40 text-paper backdrop-blur-sm transition hover:border-gold"
              aria-label="Next photograph"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 lg:px-12">
          <Link
            href="/#collection"
            className="text-[11px] uppercase tracking-[0.22em] text-paper/70 transition hover:text-paper"
          >
            Back to the collection
          </Link>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-gold-soft">
            {kindLabel(residence.kind)} · {residence.location}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.9] sm:text-7xl">{residence.name}</h1>
        </div>
      </div>

      <div className="relative z-10 -mt-6 bg-paper px-5 py-8 text-ink sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-stone">{availabilityNote(residence.availability)}</p>
            <p className="mt-2 font-display text-4xl text-ink">
              <span className="mr-3 text-base tracking-normal text-stone">Guide</span>
              {formatGuidePrice(residence.priceGuide)}
            </p>
            <p className="mt-2 text-xs text-stone">A placeholder figure for this demonstration. Not an offer.</p>
          </div>
          {hasGallery ? (
            <div className="flex gap-3" aria-label="Photographs">
              {residence.images.map((item, itemIndex) => {
                const selected = itemIndex === index;
                return (
                  <button
                    key={item.src}
                    type="button"
                    aria-label={`Show photograph ${itemIndex + 1}`}
                    aria-pressed={selected}
                    onClick={() => setIndex(itemIndex)}
                    className={`relative h-16 w-24 overflow-hidden border ${
                      selected ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={item.src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
