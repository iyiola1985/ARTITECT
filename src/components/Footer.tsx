import Link from "next/link";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/properties";

export function Footer() {
  return (
    <footer className="bg-charcoal px-5 py-16 text-paper sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-7 text-paper/65">
              Designer residences, composed with landscape, light, and a short list of materials.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.18em] text-paper/70 transition hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/residences"
              className="text-[11px] uppercase tracking-[0.18em] text-paper/70 transition hover:text-paper"
            >
              Index
            </Link>
            <Link
              href="/contact"
              className="text-[11px] uppercase tracking-[0.18em] text-paper/70 transition hover:text-paper"
            >
              Enquiry desk
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3 text-xs leading-6 text-paper/45 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl">
            Artitec is a fictional property house. This website is a demonstration by SholaTech. Guide prices are placeholders. The enquiry form does not contact a server. Photography from Unsplash.
          </p>
          <p>SholaTech demo · Artitec</p>
        </div>
      </div>
    </footer>
  );
}
