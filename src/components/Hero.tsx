"use client";

import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { heroStats } from "@/lib/properties";

const FRAME_COUNT = 300;
const KEYFRAME_STEP = 8;
const AHEAD = 24;
const BEHIND = 4;
const MAX_LOADING = 4;

type Chapter = "drawing" | "structure" | "model" | "house";

function frameSrc(index: number): string {
  return `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg?v=hq`;
}

function chapterFor(progress: number): Chapter {
  if (progress < 0.2) {
    return "drawing";
  }
  if (progress < 0.46) {
    return "structure";
  }
  if (progress < 0.72) {
    return "model";
  }
  return "house";
}

function chapterLabel(chapter: Chapter): string {
  switch (chapter) {
    case "drawing":
      return "The drawing";
    case "structure":
      return "The structure";
    case "model":
      return "The model";
    case "house":
      return "The house";
    default: {
      const exhaustive: never = chapter;
      return exhaustive;
    }
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const chapterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const queue: number[] = [];
    let active = 0;
    let disposed = false;
    let raf = 0;
    let current = 0;
    let shown = -1;

    function show(index: number) {
      const photo = photoRef.current;
      const image = cache.get(index);
      if (!photo || !image || shown === index) {
        return;
      }
      photo.src = image.src;
      shown = index;
    }

    function draw(target: number) {
      if (cache.has(target)) {
        show(target);
        return;
      }
      let bestIndex = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const index of cache.keys()) {
        const distance = Math.abs(index - target);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      }
      if (bestIndex < 0) {
        return;
      }
      if (shown >= 0 && Math.abs(shown - target) <= bestDistance) {
        return;
      }
      show(bestIndex);
    }

    function evict(center: number) {
      if (cache.size < 80) {
        return;
      }
      const disposable = [...cache.keys()]
        .filter((index) => index !== shown && index % KEYFRAME_STEP !== 0 && index !== FRAME_COUNT - 1)
        .sort((a, b) => Math.abs(b - center) - Math.abs(a - center));
      while (cache.size > 56 && disposable.length > 0) {
        const index = disposable.shift();
        if (index === undefined) {
          break;
        }
        const image = cache.get(index);
        if (image) {
          image.src = "";
        }
        cache.delete(index);
      }
    }

    function pump() {
      while (active < MAX_LOADING && queue.length > 0 && !disposed) {
        const index = queue.shift();
        if (index === undefined || cache.has(index) || loading.has(index)) {
          continue;
        }
        active += 1;
        loading.add(index);
        const image = new Image();
        image.decoding = "async";
        image.src = frameSrc(index);
        image.onload = () => {
          active -= 1;
          loading.delete(index);
          if (disposed) {
            return;
          }
          cache.set(index, image);
          if (Math.abs(index - current) <= 1 || shown < 0) {
            draw(current);
          }
          pump();
        };
        image.onerror = () => {
          active -= 1;
          loading.delete(index);
          pump();
        };
      }
    }

    function request(index: number) {
      if (index < 0 || index >= FRAME_COUNT || cache.has(index) || loading.has(index)) {
        return;
      }
      if (!queue.includes(index)) {
        queue.push(index);
      }
      pump();
    }

    function requestWindow(center: number) {
      request(center);
      for (let offset = 1; offset <= AHEAD; offset += 1) {
        request(center + offset);
      }
      for (let offset = 1; offset <= BEHIND; offset += 1) {
        request(center - offset);
      }
      evict(center);
    }

    function syncOverlays(progress: number) {
      const openingOpacity = progress < 0.08 ? 1 : Math.max(0, 1 - (progress - 0.08) / 0.12);
      const closingOpacity = progress < 0.78 ? 0 : Math.min(1, (progress - 0.78) / 0.12);
      const hintOpacity = progress < 0.04 ? 1 : Math.max(0, 1 - (progress - 0.04) / 0.08);
      if (openingRef.current) {
        openingRef.current.style.opacity = String(openingOpacity);
        openingRef.current.setAttribute("aria-hidden", openingOpacity < 0.2 ? "true" : "false");
      }
      if (closingRef.current) {
        closingRef.current.style.opacity = String(closingOpacity);
        closingRef.current.style.pointerEvents = closingOpacity > 0.45 ? "auto" : "none";
        closingRef.current.setAttribute("aria-hidden", closingOpacity < 0.2 ? "true" : "false");
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(hintOpacity);
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      const nextChapter = chapterFor(progress);
      const label = chapterRef.current;
      if (label && label.dataset.chapter !== nextChapter) {
        label.dataset.chapter = nextChapter;
        label.textContent = chapterLabel(nextChapter);
      }
    }

    function update() {
      const section = sectionRef.current;
      if (!section) {
        return;
      }
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      const traveled = Math.min(Math.max(-rect.top, 0), Math.max(distance, 0));
      const progress = distance <= 0 ? 0 : traveled / distance;
      current = Math.round(progress * (FRAME_COUNT - 1));
      requestWindow(current);
      draw(current);
      syncOverlays(progress);
    }

    if (prefersReducedMotion()) {
      const section = sectionRef.current;
      if (section) {
        section.style.height = "100svh";
      }
      request(FRAME_COUNT - 1);
      current = FRAME_COUNT - 1;
      syncOverlays(1);
      return () => {
        disposed = true;
      };
    }

    for (let index = 0; index < FRAME_COUNT; index += KEYFRAME_STEP) {
      request(index);
    }
    request(FRAME_COUNT - 1);
    requestWindow(0);
    update();

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      cache.clear();
    };
  }, []);

  return (
    <section
      id="hero-sequence"
      ref={sectionRef}
      className="relative h-[460vh] bg-charcoal lg:h-[560vh]"
      aria-label="Introduction"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/frames/frame_0001.jpg?v=hq)" }}
      >
        {/* The sequence must stay the original JPEG. next/image would resample it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={photoRef}
          src="/frames/frame_0001.jpg?v=hq"
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          fetchPriority="high"
        />
        <p className="sr-only">
          Scroll to move from the architectural drawing, through the structural model, to the finished house.
        </p>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-charcoal/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal/45 to-transparent" />

        <div
          ref={openingRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1500px] items-end justify-between gap-8 px-5 pb-24 sm:px-8 lg:px-12"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.38em] text-gold-soft">Designer residences</p>
            <h1 className="mt-3 font-display text-6xl leading-[0.85] text-paper sm:text-8xl lg:text-[8.2rem]">
              ARTITEC
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-paper/80 lg:block">
            Scroll and the drawing becomes the house.
          </p>
        </div>

        <div
          ref={closingRef}
          className="absolute inset-0 z-10 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <ClosingCopy heading={false} />
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.32em] text-paper/80">Scroll</span>
          <span className="h-10 w-px bg-gold" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
          <p ref={chapterRef} data-chapter="drawing" className="text-[11px] uppercase tracking-[0.28em] text-paper/85">
            The drawing
          </p>
          <span className="relative h-px flex-1 bg-white/20">
            <span ref={barRef} className="absolute inset-y-0 left-0 w-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>
      </div>
    </section>
  );
}

function ClosingCopy({ heading }: { heading: boolean }) {
  const Title = heading ? "h1" : "p";
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-5 pb-24 pt-28 sm:px-8 lg:px-12">
      <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.38em] text-gold-soft">The finished house</p>
          <Title className="mt-4 font-display text-6xl leading-[0.82] text-paper sm:text-8xl lg:text-[7.4rem]">
            ARTITEC
          </Title>
          <p className="mt-5 max-w-md text-base leading-7 text-paper/85 sm:text-lg">
            A private collection of villas and courtyard houses, composed with landscape, light, and material.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <Link
              href="/#contact"
              className="bg-paper px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-charcoal transition duration-300 hover:bg-gold"
            >
              Enquire about a residence
            </Link>
            <Link
              href="/#villas"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-paper transition hover:text-gold-soft"
            >
              View the collection
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4 lg:gap-x-10">
          {heroStats.map((stat) => (
            <div key={stat.label} className="min-w-[6.5rem] border-t border-white/25 pt-3">
              <dt className="font-display text-3xl leading-none text-paper sm:text-4xl">
                {stat.value}
                {"suffix" in stat ? (
                  <span className="ml-0.5 align-top text-sm tracking-normal">{stat.suffix}</span>
                ) : null}
              </dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.18em] text-paper/70">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
