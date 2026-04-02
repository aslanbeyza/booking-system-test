import Image from "next/image";

export type SocialLink = {
  href: string;
  ariaLabel: string;
  iconSrc: string;
};

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="flex items-center gap-[10px]" dir="ltr">
      {links.map((link) => (
        <a
          key={`${link.ariaLabel}-${link.href}`}
          href={link.href}
          aria-label={link.ariaLabel}
          className="grid h-6 w-6 place-items-center text-black/70"
          target="_blank"
          rel="noreferrer"
        >
          <Image src={link.iconSrc} alt="" width={24} height={24} />
        </a>
      ))}
    </div>
  );
}

