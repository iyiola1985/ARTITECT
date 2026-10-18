export type ResidenceKind = "villa" | "residence";

export type Availability = "Available" | "By request";

export type ResidenceImage = {
  src: string;
  alt: string;
};

export type Residence = {
  slug: string;
  name: string;
  kind: ResidenceKind;
  location: string;
  region: string;
  summary: string;
  description: string[];
  priceGuide: number;
  suites: number;
  baths: number;
  areaSqm: number;
  landSqm: number;
  parking: number;
  availability: Availability;
  images: ResidenceImage[];
  highlights: string[];
};

export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  residence: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export type EnquiryStatus = "editing" | "prepared";
