import { useState } from "react";
import type { Room, HomeMode } from "@/types/map";

type RoomListPanelProps = {
    homeMode: HomeMode;
    title?: string;
    visibleRooms: Room[];
    loadingRoomId: string | null;
    roomSummaries: Record<string, string>;
    getRoomSummary: (room: Room) => void;
    favoriteRooms: Room[];
    addFavoriteRoom: (room: Room) => void;
    removeFavoriteRoom: (room: Room) => void;
    selectedCompareRoomIds: string[];
    toggleCompareRoom: (room: Room) => void;
    generateCompareReport: () => void;
    isGeneratingReport: boolean;
    compareReport: string;
};

// 관심 매물 하트
function FavoriteHeart({ isFavorite }: { isFavorite: boolean }) {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#ef4444" : "white"}
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm transition-all duration-200"
        >
            <path
                d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2C8.6 17.9 6.4 15.8 4.8 13.9C3.2 12 2.4 10.2 2.4 8.4C2.4 5.6 4.5 3.6 7.2 3.6C8.8 3.6 10.4 4.4 11.3 5.7C11.5 6 11.8 6 12 5.7C12.9 4.4 14.5 3.6 16.1 3.6C18.8 3.6 20.9 5.6 20.9 8.4C20.9 10.2 20.1 12 18.5 13.9C16.9 15.8 14.7 17.9 12.1 20.2C12 20.4 11.8 20.5 12 20.5Z"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function RoomListPanel({
    homeMode,
    title,
    visibleRooms,
    loadingRoomId,
    roomSummaries,
    getRoomSummary,
    favoriteRooms,
    addFavoriteRoom,
    removeFavoriteRoom,
    selectedCompareRoomIds,
    toggleCompareRoom,
    generateCompareReport,
    isGeneratingReport,
    compareReport
}: RoomListPanelProps) {
    const isFavoriteCompareMode = homeMode === "favoriteCompare";

    const emptyTitle = isFavoriteCompareMode
        ? "아직 관심 매물이 없어요"
        : "표시할 매물이 없어요";

    const emptyDescription = isFavoriteCompareMode
        ? "마음에 드는 매물의 하트를 눌러 관심 매물을 추가해보세요."
        : "조건을 조금 넓히거나 다른 지역을 선택해보세요.";

    const [openSummaryIds, setOpenSummaryIds] = useState<Record<string, boolean>>({});
    const [focusedRoomId, setFocusedRoomId] = useState<string | null>(null);
    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex h-full flex-col bg-white">
                {/* 상단 헤더 */}
                <div className="bg-white px-6 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 pb-5">
                        <div className="flex shrink-0 items-center gap-2">
                            <h3 className="whitespace-nowrap text-xl font-extrabold tracking-tight text-gray-950">
                                {title ?? "매물 정보"}
                            </h3>

                            {isFavoriteCompareMode && (
                                <span className="rounded-full bg-gray-950 px-3 py-1 text-xs font-extrabold text-white">
                                    {visibleRooms.length}개
                                </span>
                            )}
                        </div>

                        {isFavoriteCompareMode ? (
                            <button
                                type="button"
                                onClick={generateCompareReport}
                                disabled={selectedCompareRoomIds.length < 2 || isGeneratingReport}
                                className="shrink-0 rounded-full bg-gray-950 px-4 py-1.5 text-sm font-extrabold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {isGeneratingReport ? "분석 중..." : "분석 리포트"}
                            </button>
                        ) : (
                            <span className="shrink-0 rounded-full bg-gray-950 px-4 py-1.5 text-sm font-extrabold text-white">
                                매물 {visibleRooms.length}개
                            </span>
                        )}
                    </div>

                    <div className="h-px w-full bg-gray-200" />
                </div>

                {/* 매물 리스트 */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {visibleRooms.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed bg-gray-50 px-6 text-center">
                            <p className="text-base font-bold text-gray-800">
                                {emptyTitle}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                {emptyDescription}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {visibleRooms.map((room) => {
                                const roomId = String((room as any).id ?? (room as any).room_id);

                                const isFavoriteCompareMode = homeMode === "favoriteCompare";
                                const isCompareSelected = selectedCompareRoomIds.includes(roomId);

                                const deposit = (room as any).deposit;
                                const rent = (room as any).rent;
                                const address =
                                    (room as any).address ??
                                    (room as any).location ??
                                    (room as any).address_name ??
                                    "주소 정보 없음";

                                const roomType =
                                    (room as any).room_type ??
                                    (room as any).roomType ??
                                    "매물";

                                const size =
                                    (room as any).size ??
                                    (room as any).area ??
                                    (room as any).room_size ??
                                    null;

                                const summary = roomSummaries[roomId];
                                const isLoading = loadingRoomId === roomId;

                                const isSummaryOpen = openSummaryIds[roomId] ?? false;

                                const isFavorite = favoriteRooms.some((favoriteRoom) => {
                                    const favoriteRoomId = String(
                                        (favoriteRoom as any).id ?? (favoriteRoom as any).room_id
                                    );

                                    return favoriteRoomId === roomId;
                                });


                                return (
                                    <article
                                        key={roomId}
                                        onClick={() => setFocusedRoomId(roomId)}
                                        className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition ${focusedRoomId === roomId
                                            ? "border-blue-400 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                {isFavoriteCompareMode && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompareSelected}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => toggleCompareRoom(room)}
                                                        className="mt-1 h-4 w-4 accent-gray-950"
                                                    />
                                                )}

                                                <div>
                                                    <p className="text-lg font-extrabold text-gray-950">
                                                        보증금 {deposit} / 월세 {rent}
                                                    </p>

                                                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                                        {address}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    if (isFavorite) {
                                                        removeFavoriteRoom(room);
                                                        return;
                                                    }

                                                    addFavoriteRoom(room);
                                                }}
                                                className="-translate-y-1.5 shrink-0 rounded-full p-2 transition hover:scale-110 active:scale-95"
                                            >
                                                <FavoriteHeart isFavorite={isFavorite} />
                                            </button>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                {roomType}
                                            </span>

                                            {size && (
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                    {size}㎡
                                                </span>
                                            )}
                                        </div>

                                        {summary && isSummaryOpen && (
                                            <div className="mt-4 whitespace-pre-line rounded-xl bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700">
                                                {summary}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (summary) {
                                                    setOpenSummaryIds((prev) => ({
                                                        ...prev,
                                                        [roomId]: !isSummaryOpen,
                                                    }));
                                                    return;
                                                }

                                                setOpenSummaryIds((prev) => ({
                                                    ...prev,
                                                    [roomId]: true,
                                                }));

                                                getRoomSummary(room);
                                            }}
                                            disabled={isLoading}
                                            className="mt-4 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                        >
                                            {isLoading
                                                ? "요약 중..."
                                                : summary
                                                    ? isSummaryOpen
                                                        ? "닫기"
                                                        : "다시 보기"
                                                    : "매물 장단점 요약"}
                                        </button>
                                    </article>
                                );
                            })}

                            {isFavoriteCompareMode && compareReport && (
                                <div className="mt-5 whitespace-pre-line rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                                    <p className="mb-2 text-base font-extrabold text-gray-950">
                                        관심 매물 비교 분석 리포트
                                    </p>
                                    {compareReport}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}