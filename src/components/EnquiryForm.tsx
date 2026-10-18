"use client";

import { useState, type FormEvent } from "react";
import { emptyEnquiry, enquirySummary, validateEnquiry } from "@/lib/enquiry";
import { residences } from "@/lib/properties";
import type { EnquiryErrors, EnquiryStatus, EnquiryValues } from "@/lib/types";

type EnquiryFormProps = {
  lockedSlug?: string;
  id?: string;
};

const fields: (keyof EnquiryValues)[] = ["name", "email", "phone", "residence", "message"];

export function EnquiryForm({ lockedSlug, id = "enquiry-form" }: EnquiryFormProps) {
  const locked = residences.find((residence) => residence.slug === lockedSlug);
  const [values, setValues] = useState<EnquiryValues>({
    ...emptyEnquiry,
    residence: locked?.slug ?? "",
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<EnquiryStatus>("editing");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  function update<K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValues = locked ? { ...values, residence: locked.slug } : values;
    const nextErrors = validateEnquiry(nextValues);
    setErrors(nextErrors);

    const firstInvalid = fields.find((field) => nextErrors[field]);
    if (firstInvalid) {
      const node = document.getElementById(`${id}-${firstInvalid}`);
      node?.focus();
      setStatus("editing");
      return;
    }

    setValues(nextValues);
    setCopied(false);
    setCopyError(false);
    setStatus("prepared");
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(enquirySummary(values));
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  if (status === "prepared") {
    const residence = residences.find((item) => item.slug === values.residence);
    return (
      <div className="bg-charcoal px-6 py-8 text-paper sm:px-8 sm:py-10" role="status">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-soft">Prepared on this page</p>
        <h3 className="mt-4 font-display text-4xl leading-none">Enquiry prepared, not sent.</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-paper/75">
          Artitec is a fictional house in this SholaTech demonstration. These details were checked in your browser and were not sent to a server.
        </p>
        <dl className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
          <SummaryRow label="Name" value={values.name.trim()} />
          <SummaryRow label="Email" value={values.email.trim()} />
          <SummaryRow label="Phone" value={values.phone.trim() || "Not given"} />
          <SummaryRow label="Residence" value={residence?.name ?? "Not selected"} />
          <SummaryRow label="Note" value={values.message.trim()} />
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatus("editing")}
            className="border border-white/20 px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition hover:border-gold hover:text-gold-soft"
          >
            Edit details
          </button>
          <button
            type="button"
            onClick={() => void copySummary()}
            className="bg-gold px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-charcoal transition hover:bg-gold-soft"
          >
            {copied ? "Summary copied" : "Copy summary"}
          </button>
        </div>
        {copyError ? (
          <p className="mt-4 text-sm text-gold-soft">
            Copying was blocked by the browser. The summary above is still on this page.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="bg-charcoal px-6 py-8 text-paper sm:px-8 sm:py-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          label="Name"
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => update("name", value)}
        />
        <Field
          id={`${id}-email`}
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={(value) => update("email", value)}
        />
        <Field
          id={`${id}-phone`}
          label="Phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          autoComplete="tel"
          hint="Optional"
          onChange={(value) => update("phone", value)}
        />
        <div>
          <label htmlFor={`${id}-residence`} className="text-[11px] uppercase tracking-[0.22em] text-gold-soft">
            Residence
          </label>
          {locked ? (
            <p id={`${id}-residence`} className="mt-3 border-b border-white/20 py-3 text-paper">
              {locked.name}
            </p>
          ) : (
            <select
              id={`${id}-residence`}
              value={values.residence}
              onChange={(event) => update("residence", event.target.value)}
              aria-invalid={Boolean(errors.residence)}
              aria-describedby={errors.residence ? `${id}-residence-error` : undefined}
              className="mt-3 w-full border-b border-white/20 bg-transparent py-3 text-paper outline-none focus:border-gold"
            >
              <option value="" className="text-ink">
                Select a residence
              </option>
              {residences.map((residence) => (
                <option key={residence.slug} value={residence.slug} className="text-ink">
                  {residence.name}
                </option>
              ))}
            </select>
          )}
          {errors.residence ? (
            <p id={`${id}-residence-error`} className="mt-2 text-sm text-[#e7b2a4]">
              {errors.residence}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor={`${id}-message`} className="text-[11px] uppercase tracking-[0.22em] text-gold-soft">
          Note
        </label>
        <textarea
          id={`${id}-message`}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className="mt-3 w-full resize-y border-b border-white/20 bg-transparent py-3 text-paper outline-none focus:border-gold"
        />
        {errors.message ? (
          <p id={`${id}-message-error`} className="mt-2 text-sm text-[#e7b2a4]">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-charcoal transition hover:bg-gold-soft"
        >
          Review enquiry
        </button>
        <p className="max-w-xs text-xs leading-5 text-paper/55">
          Review checks the form in your browser. It does not contact anyone.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-gold-soft">
        {label}
        {hint ? <span className="tracking-[0.14em] text-paper/40">{hint}</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full border-b border-white/20 bg-transparent py-3 text-paper outline-none focus:border-gold"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#e7b2a4]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-gold-soft">{label}</dt>
      <dd className="whitespace-pre-wrap text-paper">{value}</dd>
    </div>
  );
}
