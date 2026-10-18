import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-start justify-center bg-paper px-5 pt-24 sm:px-8 lg:px-12">
      <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Missing</p>
      <h1 className="mt-4 font-display text-6xl text-ink sm:text-7xl">This page is not in the collection.</h1>
      <p className="mt-5 max-w-md text-base leading-7 text-stone">
        The address does not match a residence or a section of the Artitec site.
      </p>
      <Link
        href="/"
        className="mt-8 bg-charcoal px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-paper transition hover:bg-moss-deep"
      >
        Return home
      </Link>
    </div>
  );
}
