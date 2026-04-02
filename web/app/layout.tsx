import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";
import Container from "@/components/Container";
import TopBar from "@/components/TopBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-full text-black" suppressHydrationWarning>
        <AuthProvider>
          <main className="flex-1 pt-[100px]">
            <Container>
              <TopBar />
              {children}
            </Container>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
