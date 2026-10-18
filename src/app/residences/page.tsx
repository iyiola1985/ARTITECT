import type { Metadata } from "next";
import { Collection } from "@/components/Collection";

export const metadata: Metadata = {
  title: "The collection",
  description: "The Artitec index of fictional villas and courtyard residences.",
};

export default function ResidencesPage() {
  return (
    <div className="bg-paper pt-[4.5rem]">
      <Collection variant="catalogue" />
    </div>
  );
}
