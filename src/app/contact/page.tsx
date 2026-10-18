import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Prepare a private introduction for an Artitec residence. Nothing is sent from this demonstration.",
};

export default function ContactPage() {
  return (
    <div className="bg-paper pt-10">
      <ContactSection />
    </div>
  );
}
