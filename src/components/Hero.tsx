"use client";

import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { heroStats } from "@/lib/properties";

const FRAME_COUNT = 300;
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const MAX_FETCH = 6;
const MAX_DECODE = 3;
const DECODE_AHEAD = 8;
const DECODE_BEHIND = 2;

type Chapter = "drawing" | "structure" | "model" | "house";

function frameSrc(index: number): string {
  return `/frames/frame_${String(index + 1).padStart(4, "0")}.webp`;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const chapterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const blobs = new Map<number, Blob>();
    const decoded = new Map<number, ImageBitmap>();
    const fetching = new Set<number>();
    const decoding = new Set<number>();
    let queue: number[] = [];
    let fetchActive = 0;
    let decodeActive = 0;
    let disposed = false;
    let raf = 0;
    let current = 0;
    let shown = -1;
    let distance = 0;
    let context: CanvasRenderingContext2D | null = null;

    function drawingContext(): CanvasRenderingContext2D | null {
      if (context) {
        return context;
      }
      const canvas = canvasRef.current;
      if (!canvas) {
        return null;
      }
      context = canvas.getContext("2d", { desynchronized: true }) ?? canvas.getContext("2d");
      return context;
    }

    function paintFrame(index: number) {
      if (shown === index) {
        return;
      }
      const bitmap = decoded.get(index);
      const ctx = drawingContext();
      if (!bitmap || !ctx) {
        return;
      }
      if (bitmap.width !== ctx.canvas.width || bitmap.height !== ctx.canvas.height) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      ctx.drawImage(bitmap, 0, 0, ctx.canvas.width, ctx.canvas.height);
      shown = index;
    }

    function nearestReady(target: number): number {
      let best = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const index of decoded.keys()) {
        const gap = Math.abs(index - target);
        if (gap < bestDistance) {
          bestDistance = gap;
          best = index;
        }
      }
      return best;
    }

    function paint() {
      if (decoded.has(current)) {
        paintFrame(current);
        return;
      }
      if (shown >= 0 && shown !== current) {
        const direction = Math.sign(current - shown);
        let next = shown;
        for (const index of decoded.keys()) {
          const towardTarget = direction > 0 ? index > next && index < current : index < next && index > current;
          if (towardTarget) {
            next = index;
          }
        }
        if (next !== shown) {
          paintFrame(next);
          return;
        }
      }
      const fallback = nearestReady(current);
      if (fallback < 0) {
        return;
      }
      if (shown < 0 || Math.abs(fallback - current) + 6 < Math.abs(shown - current)) {
        paintFrame(fallback);
      }
    }

    function releaseDistantBitmaps(center: number) {
      const keep = DECODE_AHEAD + DECODE_BEHIND + 2;
      for (const index of decoded.keys()) {
        if (index !== shown && Math.abs(index - center) > keep) {
          decoded.get(index)?.close();
          decoded.delete(index);
        }
      }
    }

    function startDecode(index: number) {
      const blob = blobs.get(index);
      if (!blob || decoded.has(index) || decoding.has(index) || disposed) {
        return;
      }
      decoding.add(index);
      decodeActive += 1;
      createImageBitmap(blob)
        .then((bitmap) => {
          if (disposed || Math.abs(index - current) > DECODE_AHEAD + DECODE_BEHIND + 4) {
            bitmap.close();
            return;
          }
          decoded.set(index, bitmap);
          paint();
        })
        .catch(() => undefined)
        .finally(() => {
          decoding.delete(index);
          decodeActive -= 1;
          if (!disposed) {
            fillDecoded(current);
          }
        });
    }

    function fillDecoded(center: number) {
      const wanted: number[] = [];
      for (let offset = 0; offset <= DECODE_AHEAD; offset += 1) {
        wanted.push(center + offset);
        if (offset > 0 && offset <= DECODE_BEHIND) {
          wanted.push(center - offset);
        }
      }
      for (const index of wanted) {
        if (decodeActive >= MAX_DECODE) {
          break;
        }
        if (index < 0 || index >= FRAME_COUNT) {
          continue;
        }
        startDecode(index);
      }
      releaseDistantBitmaps(center);
    }

    function pump() {
      while (fetchActive < MAX_FETCH && queue.length > 0 && !disposed) {
        const index = queue.shift();
        if (index === undefined || blobs.has(index) || fetching.has(index)) {
          continue;
        }
        fetching.add(index);
        fetchActive += 1;
        fetch(frameSrc(index))
          .then((response) => {
            if (!response.ok) {
              throw new Error("missing frame");
            }
            return response.blob();
          })
          .then((blob) => {
            if (!disposed) {
              blobs.set(index, blob);
            }
          })
          .catch(() => undefined)
          .finally(() => {
            fetching.delete(index);
            fetchActive -= 1;
            if (disposed) {
              return;
            }
            pump();
            fillDecoded(current);
            paint();
          });
      }
    }

    function prioritize(center: number) {
      const next: number[] = [];
      for (let offset = 0; offset < FRAME_COUNT; offset += 1) {
        const ahead = center + offset;
        const behind = center - offset;
        if (ahead < FRAME_COUNT && !blobs.has(ahead) && !fetching.has(ahead)) {
          next.push(ahead);
        }
        if (offset > 0 && behind >= 0 && !blobs.has(behind) && !fetching.has(behind)) {
          next.push(behind);
        }
      }
      queue = next;
      pump();
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

    function measure() {
      const section = sectionRef.current;
      distance = section ? Math.max(section.offsetHeight - window.innerHeight, 0) : 0;
    }

    function update() {
      const section = sectionRef.current;
      if (!section) {
        return;
      }
      const traveled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), distance);
      const progress = distance <= 0 ? 0 : traveled / distance;
      current = Math.round(progress * (FRAME_COUNT - 1));
      prioritize(current);
      fillDecoded(current);
      paint();
      syncOverlays(progress);
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    function onResize() {
      measure();
      update();
    }

    function release() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      for (const bitmap of decoded.values()) {
        bitmap.close();
      }
      decoded.clear();
      blobs.clear();
    }

    if (prefersReducedMotion()) {
      const section = sectionRef.current;
      if (section) {
        section.style.height = "100svh";
      }
      current = FRAME_COUNT - 1;
      syncOverlays(1);
      prioritize(current);
      return release;
    }

    measure();
    prioritize(0);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return release;
  }, []);

  return (
    <section
      id="hero-sequence"
      ref={sectionRef}
      className="relative h-[calc(100svh+4800px)] bg-charcoal"
      aria-label="Introduction"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/frames/frame_0001.webp)" }}
      >
        <canvas
          ref={canvasRef}
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
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
