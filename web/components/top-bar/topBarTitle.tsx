import type { ReactNode } from "react";

export default function TopBarTitle({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="text-base font-semibold tracking-tight text-black/90">
      {children}
    </div>
  );
}