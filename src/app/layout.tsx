import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhereHouse",
  description: "생활권 기반 부동산 탐색 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}