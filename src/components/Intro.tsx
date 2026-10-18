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
          <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-line pt-8 sm:gap-6">
            <div className="min-w-0">
              <dt className="font-display text-3xl text-ink sm:text-4xl">{String(residences.length).padStart(2, "0")}</dt>
              <dd className="mt-2 text-[10px] uppercase tracking-[0.12em] text-stone sm:text-[11px] sm:tracking-[0.18em]">Houses</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-display text-3xl text-ink sm:text-4xl">01</dt>
              <dd className="mt-2 text-[10px] uppercase tracking-[0.12em] text-stone sm:text-[11px] sm:tracking-[0.18em]">Introduction</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-display text-3xl text-moss sm:text-4xl">{String(villas).padStart(2, "0")}</dt>
              <dd className="mt-2 text-[10px] uppercase tracking-[0.12em] text-stone sm:text-[11px] sm:tracking-[0.18em]">Villas</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
