const PHRASE =
  "Teak  ·  Limestone  ·  Bronze  ·  Garden courts  ·  Still water  ·  Long glass  ·  Private arrival  ·  ";

export function Marquee() {
  const line = `${PHRASE}${PHRASE}`;

  return (
    <div className="overflow-hidden border-y border-line bg-paper py-4">
      <p className="marquee-track flex w-max text-[11px] uppercase tracking-[0.42em] text-stone">
        <span>{line}</span>
        <span aria-hidden="true">{line}</span>
      </p>
    </div>
  );
}
