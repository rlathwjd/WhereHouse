import type { HomeMode } from "@/types/map";

type Props = {
    setHomeMode: React.Dispatch<React.SetStateAction<HomeMode>>;
    setShowHomeOptions: React.Dispatch<React.SetStateAction<boolean>>;
    setShowHomeFilters: React.Dispatch<React.SetStateAction<boolean>>;
    setShowRoomList: React.Dispatch<React.SetStateAction<boolean>>;
    showRoomClusters: () => void;
    mapRef: React.RefObject<any>;
};

export default function HomeSearchOption({
    setHomeMode,
    setShowHomeOptions,
    setShowHomeFilters,
    setShowRoomList,
    showRoomClusters,
    mapRef,
}: Props) {
    return (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-500">
                어떤 방식으로 집을 찾아볼까요?
            </p>

            <div className="grid gap-3 md:grid-cols-3">
                <button
                    type="button"
                    onClick={() => {
                        setHomeMode("condition");
                        setShowHomeOptions(false);
                        setShowHomeFilters(true);
                        setShowRoomList(true);

                        setTimeout(() => {
                            mapRef.current?.relayout();
                            showRoomClusters();
                        }, 300);
                    }}
                    className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
                >
                    <p className="font-bold">조건으로 찾기</p>
                    <p className="mt-1 text-sm text-gray-500">
                        금액, 출근 시간 등 조건 중심으로 탐색
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        showRoomClusters();
                        setHomeMode("interest");
                        setShowHomeOptions(false);
                        setShowHomeFilters(false);
                    }}
                    className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
                >
                    <p className="font-bold">관심 지역에서 찾기</p>
                    <p className="mt-1 text-sm text-gray-500">
                        원하는 동네 직접 선택
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setHomeMode("recommend");
                        setShowHomeOptions(false);
                        setShowHomeFilters(false);
                    }}
                    className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
                >
                    <p className="font-bold">추천 생활권 보기</p>
                    <p className="mt-1 text-sm text-gray-500">
                        근처 회사 재직자들의 추천 지역
                    </p>
                </button>
            </div>
        </div>
    );
}