type BookSessionButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function BookSessionButton({
  label = "حجز جلسة",
  onClick,
}: BookSessionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 [font-family:var(--font-avenir-arabic)]"
    >
      {label}
    </button>
  );
}
