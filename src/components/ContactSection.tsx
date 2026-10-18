import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/Reveal";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-paper px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Contact</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-6xl">
            Request a private introduction.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-stone">
            Tell us which house you want to understand, and how you hope to live in it. Viewings are by appointment. Artitec does not publish a street address.
          </p>
          <dl className="mt-10 space-y-5 border-t border-line pt-8 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">Studio</dt>
              <dd className="mt-2 text-ink">By appointment only</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">Correspondence</dt>
              <dd className="mt-2 text-ink">Prepared in the form, never sent from this demo</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={0.08}>
          <EnquiryForm id="home-enquiry" />
        </Reveal>
      </div>
    </section>
  );
}
