import type { Availability, Residence, ResidenceKind } from "@/lib/types";

/**
 * Representative architectural photographs from Unsplash, used as the
 * fictional Artitec collection. They are not listings of these houses.
 * photo-1600585154340-be6161a56a0c, photo-1600607687939-ce8a6c25118c,
 * photo-1600607687920-4e2a09cf159d, photo-1600585152220-90363fe7e115,
 * photo-1613490493576-7fde63acd811, photo-1613977257363-707ba9348227,
 * photo-1600573472592-401b489a3cdc, photo-1600566753086-00f18fb6b3ea,
 * photo-1600585153490-76fb20a32601, photo-1600566753190-17f0baa2a6c3
 */
export const residences: Residence[] = [
  {
    slug: "the-grove-house",
    name: "The Grove House",
    kind: "villa",
    location: "Southern Highlands",
    region: "Among tall trees",
    summary:
      "A two-storey timber and glass house, held in a garden of mature trees and lit from within at dusk.",
    description: [
      "The Grove House is the signature of the collection: a modern two-storey volume in warm timber and long glass, set back from a deep lawn. The upper rooms sit among the canopy. The lower rooms open to a covered court for slow evenings.",
      "Arrival is quiet. A single tree stands in front of the facade, and the interior light does the rest. It is a house for people who want architecture to feel inhabited, not displayed.",
    ],
    priceGuide: 4850000,
    suites: 4,
    baths: 3,
    areaSqm: 420,
    landSqm: 1800,
    parking: 2,
    availability: "Available",
    images: [
      {
        src: "/images/grove-exterior.jpg",
        alt: "Modern two-storey timber and glass house among tall trees at dusk, with a lit living room opening to the lawn",
      },
      {
        src: "/images/grove-living.jpg",
        alt: "Open living room with a pale sofa, timber wall, and black-framed glass looking onto a deck",
      },
      {
        src: "/images/grove-dining.jpg",
        alt: "Dining room with a dark table, stone wall, and a view through to a timber-lined kitchen",
      },
      {
        src: "/images/grove-kitchen.jpg",
        alt: "Kitchen with a pale stone island, oak stools, and timber cabinetry",
      },
    ],
    highlights: [
      "Two storeys of timber, glass, and deep eaves",
      "Garden court with a covered outdoor room",
      "Principal suite on the upper level",
      "Quiet arrival under existing trees",
    ],
  },
  {
    slug: "palm-court",
    name: "Palm Court",
    kind: "villa",
    location: "Gold Coast",
    region: "Eight minutes from the shore",
    summary:
      "A two-storey court of white volumes and timber soffits, organised around a long pool.",
    description: [
      "Palm Court is arranged as a series of white rooms around still water. Timber lines the soffits on both levels, so the shade feels warm even in full sun. Glass slides away and the ground floor becomes one room with the terrace.",
      "The upper balcony is open to the air and held by a fine glass rail. It is the most ceremonial house in the collection, and viewings are arranged privately.",
    ],
    priceGuide: 6400000,
    suites: 5,
    baths: 5,
    areaSqm: 510,
    landSqm: 960,
    parking: 3,
    availability: "By request",
    images: [
      {
        src: "/images/palm-court.jpg",
        alt: "Two-storey white villa with timber soffits, a glass balcony, and a reflecting pool in front",
      },
    ],
    highlights: [
      "Timber-lined double-height court",
      "Pool aligned with the main rooms",
      "Five suites, each with its own outlook",
      "Short drive to the shore",
    ],
  },
  {
    slug: "calma-house",
    name: "Calma House",
    kind: "villa",
    location: "Costa Blanca",
    region: "A bright garden court",
    summary:
      "White volumes, a turquoise pool, and a garden room that stays open through the warm months.",
    description: [
      "Calma House is a study in shade and white plaster. The pool sits forward of the living room, with a planted court between them. Sliding glass and a deep porch keep the interior cool without closing the house.",
      "It suits a household that lives outside for half the year and wants the architecture to feel effortless rather than ornate.",
    ],
    priceGuide: 3950000,
    suites: 4,
    baths: 4,
    areaSqm: 380,
    landSqm: 1100,
    parking: 2,
    availability: "Available",
    images: [
      {
        src: "/images/calma.jpg",
        alt: "White two-storey villa with a turquoise pool, lawn, and open living spaces facing the garden",
      },
    ],
    highlights: [
      "Pool court on axis with the living room",
      "Upper balcony with a glass rail",
      "Indoor and outdoor dining in one sequence",
      "Low, quiet garden planting",
    ],
  },
  {
    slug: "screen-house",
    name: "Screen House",
    kind: "residence",
    location: "Melbourne",
    region: "A screened courtyard",
    summary:
      "A courtyard residence with a perforated upper screen, a timber wall, and a pool along the deck.",
    description: [
      "Screen House turns its best face inward. A white perforated screen shades the upper rooms, while a timber wall closes the court. The pool runs the length of the deck, and the living room looks back across it.",
      "Inside, an open timber stair rises through a tall room of glass. It is a city-edge house with the manners of a private court.",
    ],
    priceGuide: 2750000,
    suites: 3,
    baths: 2,
    areaSqm: 240,
    landSqm: 620,
    parking: 2,
    availability: "Available",
    images: [
      {
        src: "/images/screen-exterior.jpg",
        alt: "Modern courtyard house with a perforated white screen, timber wall, and a pool deck",
      },
      {
        src: "/images/screen-living.jpg",
        alt: "Living room with a pale sofa, an open timber stair, and glass walls toward the garden",
      },
    ],
    highlights: [
      "Perforated screen for the afternoon sun",
      "Internal court with a lap pool",
      "Open stair in the main room",
      "Compact plan, generous light",
    ],
  },
  {
    slug: "the-lantern",
    name: "The Lantern",
    kind: "residence",
    location: "Sydney",
    region: "An evening house",
    summary:
      "A dark upper room floating on a pale base, with light held in tall, narrow openings.",
    description: [
      "The Lantern is most itself after sunset. The upper volume is a deep charcoal box, cut by vertical windows that glow onto the lawn. Below, a pale plinth and a timber screen mark the entrance.",
      "It is a smaller residence, composed for a single household that wants drama without scale. The garden is simple: grass, a few trees, and the light from the house.",
    ],
    priceGuide: 2480000,
    suites: 3,
    baths: 2,
    areaSqm: 210,
    landSqm: 540,
    parking: 1,
    availability: "Available",
    images: [
      {
        src: "/images/lantern.jpg",
        alt: "Two-storey house at dusk with a dark upper volume, glowing vertical windows, and a timber entrance",
      },
    ],
    highlights: [
      "Upper living room with tall slots of light",
      "Timber-lined entrance",
      "Compact three-suite plan",
      "Garden kept deliberately simple",
    ],
  },
  {
    slug: "hill-house",
    name: "Hill House",
    kind: "residence",
    location: "Mornington Peninsula",
    region: "A stepped arrival",
    summary:
      "Timber and glass arranged for a gentle slope, with a sheltered entry and rooms that rise toward the light.",
    description: [
      "Hill House steps with the site. A timber-clad entry sits low, then the plan rises to a glass upper room and a roof terrace. The materials stay few: pale timber, black metal, and clear glass.",
      "It is a family residence with a calm arrival and a strong sense of shelter. The garden is already in place, and the architecture sits inside it rather than clearing it.",
    ],
    priceGuide: 3150000,
    suites: 4,
    baths: 3,
    areaSqm: 290,
    landSqm: 740,
    parking: 2,
    availability: "Available",
    images: [
      {
        src: "/images/hill-house.jpg",
        alt: "Stepped timber and glass house with a sheltered entry and an upper storey set back from the street",
      },
    ],
    highlights: [
      "Plan that follows the slope",
      "Timber entry and black metal screen",
      "Upper room open to the north light",
      "Four suites across two levels",
    ],
  },
];

export function getResidence(slug: string): Residence | undefined {
  return residences.find((residence) => residence.slug === slug);
}

export function formatGuidePrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function kindLabel(kind: ResidenceKind): string {
  switch (kind) {
    case "villa":
      return "Villa";
    case "residence":
      return "Residence";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function availabilityNote(status: Availability): string {
  switch (status) {
    case "Available":
      return "Open to a private introduction";
    case "By request":
      return "Introduced by request only";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export const heroStats = [
  { value: "3–6", label: "Suites" },
  { value: "8 min", label: "To the shore" },
  { value: "180–420", suffix: "m²", label: "House scale" },
  { value: "Private", label: "Garden plots" },
] as const;

export const navLinks = [
  { href: "/#why", label: "Why Artitec" },
  { href: "/#villas", label: "Villas" },
  { href: "/#residences", label: "Residences" },
  { href: "/#practice", label: "Practice" },
  { href: "/#contact", label: "Contact" },
] as const;
