import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export function Practice() {
  return (
    <section id="practice" className="scroll-mt-24 bg-paper px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-paper-deep shadow-[0_30px_70px_-40px_rgba(20,19,17,0.8)]">
          <Image
            src="/images/grove-living.jpg"
            alt="A calm living room with timber, stone, and glass opening to a deck"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Practice</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-6xl">
            A house is read before it is offered.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-8 text-stone">
            <p>
              Artitec works as a small practice around a private collection. We look at structure, arrival, and the life of the garden before a conversation turns to a figure. The aim is a residence that feels inevitable on its site.
            </p>
            <p>
              Materials stay few. Timber, stone, metal, and glass are asked to age rather than perform. The rooms are generous, and the circulation is short.
            </p>
          </div>
          <ul className="mt-10 space-y-4 border-t border-line pt-8">
            {[
              "Private introductions, never an open house",
              "A written reading of light, plan, and landscape",
              "Guide figures stated plainly, then set aside",
            ].map((item) => (
              <li key={item} className="flex gap-4 text-sm leading-6 text-ink">
                <span className="mt-2 h-px w-6 shrink-0 bg-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
