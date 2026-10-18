import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PropertyCard } from "@/components/PropertyCard";
import { ResidenceHero } from "@/components/ResidenceHero";
import { getResidence, residences } from "@/lib/properties";

type ResidencePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return residences.map((residence) => ({ slug: residence.slug }));
}

export async function generateMetadata({ params }: ResidencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const residence = getResidence(slug);
  if (!residence) {
    return { title: "Residence" };
  }

  return {
    title: residence.name,
    description: residence.summary,
  };
}

export default async function ResidencePage({ params }: ResidencePageProps) {
  const { slug } = await params;
  const residence = getResidence(slug);

  if (!residence) {
    notFound();
  }

  const others = residences.filter((item) => item.slug !== residence.slug).slice(0, 3);
  const specs = [
    { label: "Suites", value: String(residence.suites) },
    { label: "Baths", value: String(residence.baths) },
    { label: "House", value: `${residence.areaSqm} m²` },
    { label: "Land", value: `${residence.landSqm.toLocaleString("en-US")} m²` },
    { label: "Parking", value: String(residence.parking) },
    { label: "Setting", value: residence.region },
  ];

  return (
    <article>
      <ResidenceHero residence={residence} />
      <div className="bg-paper px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">The house</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-stone">
              {residence.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-10 space-y-4">
              {residence.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-4 text-sm leading-6 text-ink">
                  <span className="mt-2 h-px w-6 shrink-0 bg-gold" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid grid-cols-2 gap-px self-start bg-line">
            {specs.map((spec) => (
              <div key={spec.label} className="min-w-0 bg-paper p-4 sm:p-6">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-stone sm:tracking-[0.2em]">{spec.label}</dt>
                <dd className="mt-3 break-words font-display text-2xl leading-tight text-ink sm:text-3xl">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="enquire" className="mx-auto mt-20 grid max-w-[1500px] gap-10 scroll-mt-28 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Enquire</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
              Ask about {residence.name}.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-stone">
              The note stays in this browser. Use it to rehearse an introduction. It will not be delivered.
            </p>
          </div>
          <EnquiryForm lockedSlug={residence.slug} id={`${residence.slug}-enquiry`} />
        </div>

        <div className="mx-auto mt-24 max-w-[1500px]">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-ink">Other houses</h2>
            <Link href="/residences" className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink">
              Full index
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {others.map((item) => (
              <PropertyCard key={item.slug} residence={item} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
