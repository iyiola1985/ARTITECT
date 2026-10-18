import { Compass, Handshake, PenLine, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const services: { number: string; title: string; text: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "Private search",
    text: "A conversation about how you want the day to feel, followed by a short list rather than a flood of options.",
    icon: Compass,
  },
  {
    number: "02",
    title: "Architectural reading",
    text: "Proportion, structure, and the path of light are walked through before anyone discusses a guide figure.",
    icon: PenLine,
  },
  {
    number: "03",
    title: "Landscape and arrival",
    text: "The approach, the court, and the planting are treated as part of the house, not a border around it.",
    icon: Trees,
  },
  {
    number: "04",
    title: "A discreet introduction",
    text: "When a house is right, the introduction is private. There is no public board and no theatre around the sale.",
    icon: Handshake,
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-moss-deep px-5 py-24 text-paper sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold-soft">Services</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] sm:text-6xl">
            How an introduction proceeds.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.number} delay={index * 0.06} className="bg-moss-deep p-8">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-8 font-display text-3xl text-gold-soft">{service.number}</p>
                <h3 className="mt-4 font-display text-3xl leading-none">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-paper/70">{service.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
