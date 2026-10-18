import { getResidence } from "@/lib/properties";
import type { EnquiryErrors, EnquiryValues } from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,20}$/;

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  phone: "",
  residence: "",
  message: "",
};

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (name.length < 2) {
    errors.name = "Enter the name we should use.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (phone.length > 0 && !PHONE_PATTERN.test(phone)) {
    errors.phone = "Use digits, spaces, and a leading + if you need one.";
  }

  if (!getResidence(values.residence)) {
    errors.residence = "Choose a residence from the collection.";
  }

  if (message.length < 20) {
    errors.message = "Write at least a short note, around twenty characters.";
  }

  return errors;
}

export function enquirySummary(values: EnquiryValues): string {
  const residence = getResidence(values.residence);
  const lines = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim() || "Not given"}`,
    `Residence: ${residence ? residence.name : values.residence}`,
    `Note: ${values.message.trim()}`,
  ];
  return lines.join("\n");
}
