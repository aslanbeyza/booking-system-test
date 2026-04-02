import Image from "next/image";

export type IconButtonProps = {
  ariaLabel: string;
  iconSrc: string;
  onClick?: () => void;
};

export function IconButton({ ariaLabel, iconSrc, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="grid h-6 w-6 place-items-center bg-transparent text-black/70 transition hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
    >
      <Image src={iconSrc} alt="" width={24} height={24} className="opacity-80" />
    </button>
  );
}
