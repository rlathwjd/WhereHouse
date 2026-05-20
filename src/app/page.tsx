"use client";

import localFont from "next/font/local";
import KakaoMap from "../components/KakaoMap";

const outfit = localFont({
  src: "../../public/fonts/Outfit-Latin.woff2",
  display: "swap",
  weight: "100 900",
});

export default function Home() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-gray-50 px-6 py-4">
      <KakaoMap titleClassName={outfit.className} />
    </main>
  );
}
