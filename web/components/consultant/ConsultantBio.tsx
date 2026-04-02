import type { ReactNode } from "react";

export default function ConsultantBio({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 wrap-break-word text-right text-sm leading-6 text-black/70 [font-family:var(--font-avenir-arabic)]">
      {children}
    </div>
  );
}

