import type { HomeMode } from "@/types/map";

type HomeSearchModePanelProps = {
    onSelectMode: (mode: Exclude<HomeMode, null>) => void;
};

export default function HomeSearchModePanel({
    onSelectMode,
}: HomeSearchModePanelProps) {
    return (
        <div className="mt-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-bold text-gray-600">
                어떤 방식으로 집을 찾아볼까요?
            </p>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onSelectMode("condition")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-base font-bold text-gray-900">
                        조건으로 찾기
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        예산, 지역, 방 크기 등 원하는 조건으로 매물을 찾아요
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectMode("localReview")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-base font-bold text-gray-900">
                        지역별 거주자/재직자 후기
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        지역별 생활·출퇴근 후기를 확인해요
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => onSelectMode("favoriteCompare")}
                    className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                >
                    <p className="text-base font-bold text-gray-900">
                        관심 매물 비교
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        관심 매물을 선택하고 비교 분석 리포트를 확인해요
                    </p>
                </button>
            </div>
        </div>
    );
}