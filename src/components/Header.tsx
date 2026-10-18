"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/properties";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    let solid = false;

    const measure = () => {
      frame = 0;
      const hero = document.getElementById("hero-sequence");
      const next =
        pathname === "/" && hero
          ? hero.getBoundingClientRect().bottom <= window.innerHeight + 1
          : window.scrollY > 24;
      if (next !== solid) {
        solid = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || pathname !== "/" || open;

  function scrollToHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("/#") || pathname !== "/") {
      setOpen(false);
      return;
    }

    const target = document.getElementById(href.slice(2));
    if (!target) {
      return;
    }

    event.preventDefault();
    setOpen(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`absolute inset-x-0 top-0 h-[4.5rem] transition-colors duration-500 ${
          solid ? "bg-charcoal/95 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.8)] backdrop-blur-md" : "bg-transparent"
        }`}
      />
      <div className="relative z-50 mx-auto flex h-[4.5rem] max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Artitec home" className="relative z-10">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => scrollToHash(event, link.href)}
              className="text-[11px] uppercase tracking-[0.22em] text-paper/80 transition hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            onClick={(event) => scrollToHash(event, "/#contact")}
            className="hidden border border-white/15 bg-charcoal px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-paper transition duration-300 hover:border-gold hover:text-gold-soft sm:inline-flex"
          >
            Enquire
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-charcoal px-6 py-10 lg:hidden">
          <nav className="flex flex-col gap-6" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => scrollToHash(event, link.href)}
                className="font-display text-5xl text-paper"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-4 inline-flex w-fit bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-charcoal"
            >
              Enquire
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
