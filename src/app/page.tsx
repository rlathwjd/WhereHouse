"use client"; 

import KakaoMap from "../components/KakaoMap";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-10">
      <h1
        onClick={() => window.location.reload()}
        className={`${outfit.className} text-5xl font-bold tracking-tight`}>
        WhereHouse
      </h1>

      <p className="mt-4 text-lg font-semibold text-gray-600">
        사회초년생을 위한 생활권 기반 부동산 탐색 서비스
      </p>

      <KakaoMap />
    </main>
  );
}