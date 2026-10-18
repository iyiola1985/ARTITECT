import { Collection } from "@/components/Collection";
import { ContactSection } from "@/components/ContactSection";
import { Featured } from "@/components/Featured";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Marquee } from "@/components/Marquee";
import { Practice } from "@/components/Practice";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <Collection />
      <Featured />
      <Practice />
      <Services />
      <ContactSection />
    </>
  );
}
