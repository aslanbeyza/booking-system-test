import type { ReactNode } from "react";

export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-[1320px] px-4 sm:px-6 lg:px-16 xl:px-20 ${className}`}
    >
      {children}
    </div>
  );
}

