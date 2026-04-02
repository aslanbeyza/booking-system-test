import "./globals.css";

import Container from "@/components/Container";
import TopBar from "@/components/TopBar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-full text-black">
        <main className="flex-1 pt-[100px]">
          <Container>
            <TopBar />
            {children}
          </Container>
        </main>
      </body>
    </html>
  );
}
