import { Reveal } from "@/components/Reveal";
import { residences } from "@/lib/properties";

export function Intro() {
  const villas = residences.filter((residence) => residence.kind === "villa").length;
  const homes = residences.filter((residence) => residence.kind === "residence").length;

  return (
    <section id="why" className="scroll-mt-24 bg-paper px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Why Artitec</p>
          <h2 className="mt-5 font-display text-5xl leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
            Houses with the quiet of a gallery.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="max-w-xl space-y-6 text-base leading-8 text-stone lg:pt-16">
            <p>
              Artitec keeps a short list. Each villa and courtyard residence is chosen for proportion, the way light enters, and how the garden meets the room. Nothing here is arranged as a catalogue of everything on the market.
            </p>
            <p>
              The current collection holds {villas} villas and {homes} residences. Viewings are private. Figures shown beside each house are guides for this demonstration, not published offers.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="font-display text-4xl text-ink">{String(residences.length).padStart(2, "0")}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone">Houses</dd>
            </div>
            <div>
              <dt className="font-display text-4xl text-ink">01</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone">Introduction</dd>
            </div>
            <div>
              <dt className="font-display text-4xl text-moss">{String(villas).padStart(2, "0")}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone">Villas</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
