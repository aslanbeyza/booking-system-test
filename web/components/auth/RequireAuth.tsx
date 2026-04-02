"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "./AuthProvider";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center text-sm text-black/60 [font-family:var(--font-avenir-arabic)]"
        dir="rtl"
      >
        جاري التحقق من الجلسة…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
