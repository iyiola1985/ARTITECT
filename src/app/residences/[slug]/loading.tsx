export default function ResidenceLoading() {
  return (
    <div className="bg-paper pt-[4.5rem]" aria-busy="true" aria-live="polite">
      <div className="h-[72vh] min-h-[520px] animate-pulse bg-charcoal-soft" />
      <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="h-4 w-32 animate-pulse bg-paper-deep" />
        <div className="mt-6 h-14 w-2/3 animate-pulse bg-paper-deep" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse bg-paper-deep" />
          <div className="h-28 animate-pulse bg-paper-deep" />
          <div className="h-28 animate-pulse bg-paper-deep" />
        </div>
        <p className="mt-8 text-sm text-stone">Opening the residence…</p>
      </div>
    </div>
  );
}
