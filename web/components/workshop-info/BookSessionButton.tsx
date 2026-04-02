type BookSessionButtonProps = {
  label?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function BookSessionButton({
  label = "حجز جلسة",
  onClick,
  loading = false,
  disabled = false,
}: BookSessionButtonProps) {
  const busy = loading || disabled;

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2]/40 disabled:cursor-not-allowed disabled:opacity-60 [font-family:var(--font-avenir-arabic)]"
    >
      <span className="inline-flex min-h-[1.25rem] items-center justify-center gap-2">
        <span
          className={`inline-block h-4 w-4 shrink-0 rounded-full border-2 border-white border-t-transparent ${
            loading ? "animate-spin" : "invisible"
          }`}
          aria-hidden
        />
        <span>{label}</span>
      </span>
    </button>
  );
}
