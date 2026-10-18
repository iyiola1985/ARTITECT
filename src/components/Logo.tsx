type LogoProps = {
  tone?: "light" | "dark";
};

export function Logo({ tone = "light" }: LogoProps) {
  const color = tone === "light" ? "text-paper" : "text-ink";

  return (
    <span className={`inline-flex items-center gap-3 ${color}`}>
      <span className="h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
      <span className="font-display text-[1.35rem] leading-none tracking-[0.28em]">
        ARTITEC
      </span>
    </span>
  );
}
