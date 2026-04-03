"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Container from "@/components/Container";
import TopBar from "@/components/TopBar";

const NO_TOPBAR_PATHS = new Set(["/login", "/register"]);

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showTopBar = !NO_TOPBAR_PATHS.has(pathname);

  return (
    <main
      className={
        showTopBar
          ? "flex-1 pt-[100px]"
          : "flex min-h-dvh flex-1 flex-col"
      }
    >
      <Container
        className={
          showTopBar
            ? ""
            : "flex flex-1 flex-col items-center justify-center py-8 sm:py-10"
        }
      >
        {showTopBar && <TopBar />}
        {children}
      </Container>
    </main>
  );
}
