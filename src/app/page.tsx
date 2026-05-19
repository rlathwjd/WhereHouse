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
    <main className="min-h-screen w-full bg-gray-50 px-10 py-8">
      <h1
        onClick={() => window.location.reload()}
        className={`${outfit.className} text-5xl font-bold tracking-tight`}
      >
        WhereHouse
      </h1>

      <p className="mt-4 text-lg font-semibold text-gray-600">
        사회초년생을 위한 생활권 기반 자취방 탐색 서비스
      </p>

      <div className="mt-4">
        <KakaoMap />
      </div>
    </main>
  );
}
