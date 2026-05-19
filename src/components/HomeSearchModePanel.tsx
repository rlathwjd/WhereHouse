import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import type { HomeMode } from "@/types/map";

type HomeSearchModePanelProps = {
    onSelectMode: (mode: Exclude<HomeMode, null>) => void;
    onClose: () => void;
};

export default function HomeSearchModePanel({
    onSelectMode,
    onClose,
}: HomeSearchModePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        panelRef.current?.focus();
    }, []);

    return (
        <div
            ref={panelRef}
            tabIndex={-1}
            className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm outline-none transition focus-within:border-[#F4C430] focus-within:ring-4 focus-within:ring-[#FFF3BF]"
        >
            <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                    <p className="text-base font-extrabold text-gray-900">
                        집 탐색 조건 선택
                    </p>

                    <p className="mt-1 text-xs font-medium text-gray-500">
                        어떤 방식으로 집을 찾아볼까요?
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    aria-label="집 탐색 조건 선택 닫기"
                >
                    <X size={18} strokeWidth={2.4} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => onSelectMode("condition")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-sm font-bold text-gray-900">
                        조건으로 찾기
                    </p>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                        예산, 지역 등 원하는 조건으로 매물을 찾아요
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectMode("localReview")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-sm font-bold text-gray-900">
                        지역별 거주자/재직자 후기
                    </p>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                        지역별 생활·출퇴근 후기를 확인해요
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectMode("favoriteCompare")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-sm font-bold text-gray-900">
                        관심 매물 비교
                    </p>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                        관심 매물을 선택하고 비교 분석 리포트를 확인해요
                    </p>
                </button>
            </div>
        </div>
    );
}
