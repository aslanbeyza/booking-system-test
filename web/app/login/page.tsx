"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthApiError } from "@/lib/auth/api";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  if (!loading && user) {
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email, password);
      router.replace("/");
    } catch (err: unknown) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "فشل تسجيل الدخول",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-black/10 bg-[#F7F7F7] p-6 shadow-sm"
      dir="rtl"
    >
      <h1 className="text-right text-lg font-semibold [font-family:var(--font-avenir-arabic)]">
        تسجيل الدخول
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-right text-sm [font-family:var(--font-avenir-arabic)]">
          البريد الإلكتروني
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-black/15 bg-white px-3 py-2 text-left [font-family:var(--font-avenir-arabic)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-right text-sm [font-family:var(--font-avenir-arabic)]">
          كلمة المرور
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-lg border border-black/15 bg-white px-3 py-2 [font-family:var(--font-avenir-arabic)]"
          />
        </label>
        {error ? (
          <p className="text-right text-sm text-red-600 [font-family:var(--font-avenir-arabic)]">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 [font-family:var(--font-avenir-arabic)]"
        >
          {pending ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
      <p className="text-center text-sm text-black/70 [font-family:var(--font-avenir-arabic)]">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="underline underline-offset-4">
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}
