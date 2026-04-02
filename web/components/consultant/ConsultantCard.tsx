import type { ReactNode } from "react";

import ConsultantBio from "./ConsultantBio";
import ConsultantHeader, { type ConsultantHeaderProps } from "./ConsultantHeader";
import SocialLinks, { type SocialLink } from "../social/SocialLinks";

export type ConsultantCardProps = ConsultantHeaderProps & {
  name: string;
  subtitle?: string;
  socialLinks?: SocialLink[];
  availabilityText?: string;
  introTitle?: string;
  introText?: ReactNode;
  adviceTitle?: string;
  adviceItems?: string[];
  footerText?: ReactNode;
};

export default function ConsultantCard({
  name,
  subtitle,
  avatarSrc,
  socialLinks = [],
  availabilityText,
  introTitle,
  introText,
  adviceTitle,
  adviceItems = [],
  footerText,
}: ConsultantCardProps) {
  return (
    <section className="flex w-full min-w-0 max-w-none flex-col rounded-2xl border border-black/10 bg-[#F7F7F7] shadow-sm">
      <div className="shrink-0 px-5 pt-6 pb-5">
        <div dir="ltr" className="flex min-w-0 items-start justify-between gap-6">
          <div dir="rtl" className="min-w-0 flex-1 wrap-break-word">
            <div className="text-right text-[18px] font-black tracking-[0] text-[#1C1C1C] [font-family:var(--font-avenir-arabic)]">
              {name}
            </div>
            {subtitle ? (
              <div className="text-right text-sm leading-6 text-black/70 wrap-break-word [font-family:var(--font-avenir-arabic)]">
                {subtitle}
              </div>
            ) : null}

            {socialLinks.length ? (
              <div className="mt-4 flex justify-start">
                <SocialLinks links={socialLinks} />
              </div>
            ) : null}

            {availabilityText ? (
              <div className="mt-6 text-right text-[14px] leading-none font-extrabold tracking-[0] text-black/90 [font-family:var(--font-avenir-arabic)]">
                {availabilityText}
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <ConsultantHeader avatarSrc={avatarSrc} />
          </div>
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-black/10" />

      <div className="px-6 pb-6 pt-5">
        {introTitle ? (
          <div className="text-right text-[14px] leading-none font-extrabold tracking-[0] text-black/90 [font-family:var(--font-avenir-arabic)]">
            {introTitle}
          </div>
        ) : null}
        {introText ? <ConsultantBio>{introText}</ConsultantBio> : null}

        {adviceTitle ? (
          <div className="mt-6 text-right text-[14px] leading-none font-extrabold tracking-[0] text-black/90 [font-family:var(--font-avenir-arabic)]">
            {adviceTitle}
          </div>
        ) : null}
        {adviceItems.length ? (
          <ul className="mt-3 space-y-2 text-sm text-black/75">
            {adviceItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {footerText ? (
          <div className="mt-6 text-sm leading-6 text-black/70">{footerText}</div>
        ) : null}
      </div>
    </section>
  );
}

