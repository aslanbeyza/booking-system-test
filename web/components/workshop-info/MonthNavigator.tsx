type MonthNavigatorProps = {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function MonthNavigator({
  label,
  onPrev,
  onNext,
}: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        aria-label="الشهر التالي"
        onClick={onNext}
        className="grid h-8 w-8 place-items-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-black"
      >
        <ChevronRightIcon />
      </button>
      <div className="text-sm font-semibold text-black/90">{label}</div>
      <button
        type="button"
        aria-label="الشهر السابق"
        onClick={onPrev}
        className="grid h-8 w-8 place-items-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-black"
      >
        <ChevronLeftIcon />
      </button>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6L9 12l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
