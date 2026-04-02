"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "./AuthProvider";

export default function AuthNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  async function handleLogout() {
    setErr(null);
    try {
      await logout();
      router.push("/login");
    } catch {
      setErr("تعذر تسجيل الخروج");
    }
  }

  if (loading) {
    return (
      <span className="text-xs text-black/50 [font-family:var(--font-avenir-arabic)]">
        …
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-black underline-offset-4 hover:underline [font-family:var(--font-avenir-arabic)]"
      >
        تسجيل الدخول
      </Link>
    );
  }

  return (
    <div className="flex max-w-[min(100%,220px)] flex-col items-end gap-1">
      <span
        className="truncate text-xs text-black/70 [font-family:var(--font-avenir-arabic)]"
        title={user.email}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="text-sm text-black/80 underline-offset-4 hover:underline [font-family:var(--font-avenir-arabic)]"
      >
        خروج
      </button>
      {err ? (
        <span className="text-xs text-red-600 [font-family:var(--font-avenir-arabic)]">
          {err}
        </span>
      ) : null}
    </div>
  );
}
