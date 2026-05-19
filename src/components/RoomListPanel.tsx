import { useState } from "react";
import type { Room, HomeMode } from "@/types/map";
import {
    Info,
    Bus,
    CircleDollarSign,
    ThumbsUp,
    TriangleAlert,
    ClipboardList,
    Sparkles,
    ChevronDown,
} from "lucide-react";

type RoomListPanelProps = {
    homeMode: HomeMode;
    title?: string;
    visibleRooms: Room[];
    loadingRoomId: string | null;
    roomSummaries: Record<string, string>;
    getRoomSummary: (room: Room) => void;
    getSummaryKey: (room: Room) => string;
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

function AiSummaryView({ summary }: { summary: string }) {
    const summaryItems = [
        {
            key: "교통",
            icon: Bus,
            iconClassName: "text-gray-500",
        },
        {
            key: "가격",
            icon: CircleDollarSign,
            iconClassName: "text-gray-500",
        },
        {
            key: "장점",
            icon: ThumbsUp,
            iconClassName: "text-gray-500",
        },
        {
            key: "단점",
            icon: TriangleAlert,
            iconClassName: "text-amber-500",
        },
        {
            key: "참고",
            icon: ClipboardList,
            iconClassName: "text-gray-500",
        },
    ];

    const getSummaryValue = (key: string) => {
        const line = summary
            .split("\n")
            .map((item) => item.trim())
            .find((item) => item.startsWith(`${key}:`));

        return (
            line?.replace(`${key}:`, "").trim() ||
            "제공된 정보만으로는 판단하기 어려워요."
        );
    };

    return (
        <div>
            <div className="space-y-2 text-xs leading-5 text-gray-700">
                {summaryItems.map(({ key, icon: Icon, iconClassName }) => (
                    <div key={key} className="flex items-start gap-2">
                        <Icon
                            size={14}
                            strokeWidth={2.2}
                            className={`mt-[2px] shrink-0 ${iconClassName}`}
                        />

                        <p>
                            <span className="font-extrabold text-gray-800">{key}: </span>
                            {getSummaryValue(key)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RoomListPanel({
    homeMode,
    title,
    visibleRooms,
    loadingRoomId,
    roomSummaries,
    getRoomSummary,
    getSummaryKey,
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

    const [focusedRoomId, setFocusedRoomId] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<
        "latest" | "rentLow" | "depositLow" | "sizeHigh"
    >("latest");
    const [activeDetailTabs, setActiveDetailTabs] = useState<
        Record<string, "market" | "ai">
    >({});

    const sortedRooms = [...visibleRooms].sort((a, b) => {
        if (sortOption === "rentLow") return a.rent - b.rent;
        if (sortOption === "depositLow") return a.deposit - b.deposit;
        if (sortOption === "sizeHigh") return (b.size ?? 0) - (a.size ?? 0);
        return 0;
    });

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex h-full flex-col bg-white">
                {/* 상단 헤더 */}
                <div className="bg-white px-6 pt-6">
                    <div className="flex items-center justify-between gap-3 pb-5">
                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-extrabold tracking-tight text-gray-950">
                                {title ?? "전체 매물"} {visibleRooms.length}개
                            </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {isFavoriteCompareMode && (
                                <button
                                    type="button"
                                    onClick={generateCompareReport}
                                    disabled={selectedCompareRoomIds.length < 2 || isGeneratingReport}
                                    className="shrink-0 rounded-lg bg-gray-950 px-3 py-2 text-xs font-extrabold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    {isGeneratingReport ? "분석 중..." : "분석 리포트"}
                                </button>
                            )}

                            <label className="sr-only" htmlFor="room-sort">
                                매물 정렬
                            </label>
                            <div className="relative">
                                <select
                                    id="room-sort"
                                    value={sortOption}
                                    onChange={(event) =>
                                        setSortOption(event.target.value as typeof sortOption)
                                    }
                                    className="h-9 w-[136px] appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-xs font-bold text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-950"
                                >
                                    <option value="latest">최신 등록순</option>
                                    <option value="rentLow">월세 낮은순</option>
                                    <option value="depositLow">보증금 낮은순</option>
                                    <option value="sizeHigh">면적 넓은순</option>
                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                        </div>
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
                            {sortedRooms.map((room) => {
                                const roomId = String(room.id ?? room.room_id);

                                const activeDetailTab = activeDetailTabs[roomId] ?? "market";
                                const isFocused = focusedRoomId === roomId;

                                const isFavoriteCompareMode = homeMode === "favoriteCompare";
                                const isCompareSelected = selectedCompareRoomIds.includes(roomId);

                                const deposit = room.deposit;
                                const rent = room.rent;
                                const address =
                                    room.address ??
                                    room.location ??
                                    room.address_name ??
                                    "주소 정보 없음";

                                const roomType =
                                    room.room_type ??
                                    room.roomType ??
                                    "매물";

                                const size =
                                    room.size ??
                                    room.area ??
                                    room.room_size ??
                                    null;

                                const summaryKey = getSummaryKey(room);
                                const summary = roomSummaries[summaryKey];
                                const isLoading = loadingRoomId === summaryKey;

                                const requestRoomSummary = () => {
                                    if (!summary && !isLoading) {
                                        getRoomSummary(room);
                                    }
                                };

                                const isFavorite = favoriteRooms.some((favoriteRoom) => {
                                    const favoriteRoomId = String(
                                        favoriteRoom.id ?? favoriteRoom.room_id
                                    );

                                    return favoriteRoomId === roomId;
                                });


                                return (
                                    <article
                                        key={roomId}
                                        onClick={() => {
                                            setFocusedRoomId((prev) => {
                                                const nextFocusedRoomId = prev === roomId ? null : roomId;

                                                if (nextFocusedRoomId) {
                                                    setActiveDetailTabs((prevTabs) => ({
                                                        ...prevTabs,
                                                        [roomId]: "market",
                                                    }));
                                                }

                                                return nextFocusedRoomId;
                                            });
                                        }}
                                        className={`relative cursor-pointer rounded-2xl border bg-white p-3 shadow-sm transition ${focusedRoomId === roomId
                                            ? "border-blue-400 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                            }`}
                                    >
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
                                            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition hover:scale-110 hover:bg-white active:scale-95"
                                            aria-label={isFavorite ? "관심 매물 해제" : "관심 매물 추가"}
                                        >
                                            <FavoriteHeart isFavorite={isFavorite} />
                                        </button>

                                        <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3">
                                            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 text-xs font-bold text-gray-400">
                                                이미지 없음
                                                {isFavoriteCompareMode && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompareSelected}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={() => toggleCompareRoom(room)}
                                                        className="absolute left-2 top-2 h-4 w-4 accent-gray-950"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-col pr-9 pt-1.5">
                                                <div className="min-w-0">
                                                    <p className="truncate text-base font-extrabold leading-6 text-gray-950">
                                                        보증금 {deposit} / 월세 {rent}
                                                    </p>

                                                    <p className="mt-1.5 line-clamp-2 text-xs leading-[17px] text-gray-500">
                                                        {address}
                                                    </p>
                                                </div>

                                                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                        {roomType}
                                                    </span>

                                                    {size && (
                                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                            {size}㎡
                                                        </span>
                                                    )}

                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        시세와 유사
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {isFocused && (
                                            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                                {/* 탭 버튼 */}
                                                <div className="grid grid-cols-2 border-b border-gray-200 text-sm font-bold">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDetailTabs((prev) => ({
                                                                ...prev,
                                                                [roomId]: "market",
                                                            }));
                                                        }}
                                                        className={`py-3 transition ${activeDetailTab === "market"
                                                            ? "border-b-2 border-blue-600 text-blue-600"
                                                            : "text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        시세 비교
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setActiveDetailTabs((prev) => ({
                                                                ...prev,
                                                                [roomId]: "ai",
                                                            }));

                                                            requestRoomSummary();
                                                        }}
                                                        className={`py-3 transition ${activeDetailTab === "ai"
                                                            ? "border-b-2 border-blue-600 text-blue-600"
                                                            : "text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        AI 요약
                                                    </button>
                                                </div>

                                                {/* 시세 비교 탭 */}
                                                {activeDetailTab === "market" && (
                                                    <div className="p-3.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-extrabold text-gray-950">
                                                                    시세 비교
                                                                </p>

                                                                <span className="text-xs font-semibold text-gray-400">
                                                                    최근 1년 실거래가 기준
                                                                </span>
                                                            </div>

                                                            <Info size={14} strokeWidth={2.2} className="shrink-0 text-gray-400" />
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-3 text-center">
                                                            <div>
                                                                <p className="text-[11px] font-bold text-gray-400">현재 매물</p>
                                                                <p className="mt-1 text-xs font-extrabold text-gray-950">
                                                                    보증금 {deposit} / 월세 {rent}
                                                                </p>
                                                            </div>

                                                            <span className="text-xs font-extrabold text-gray-400">VS</span>

                                                            <div>
                                                                <p className="text-[11px] font-bold text-gray-400">평균 시세</p>
                                                                <p className="mt-1 text-xs font-extrabold text-gray-950">
                                                                    보증금 1200 / 월세 59
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                                            <div className="rounded-xl border border-gray-100 bg-white px-2 py-2 text-center">
                                                                <p className="text-[11px] font-bold text-gray-400">현재 월세</p>
                                                                <p className="mt-1 text-base font-extrabold text-blue-600">
                                                                    {rent}만 원
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl border border-gray-100 bg-white px-2 py-2 text-center">
                                                                <p className="text-[11px] font-bold text-gray-400">평균 월세</p>
                                                                <p className="mt-1 text-base font-extrabold text-gray-950">
                                                                    59만 원
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl border border-gray-100 bg-white px-2 py-2 text-center">
                                                                <p className="text-[11px] font-bold text-gray-400">차이</p>
                                                                <p className="mt-1 text-base font-extrabold text-emerald-600">
                                                                    -7만 원
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3">
                                                            <p className="text-[11px] font-bold text-gray-500">
                                                                최근 12개월 월세 추이
                                                            </p>

                                                            <div className="mt-2 rounded-xl bg-gray-50 px-3 py-2">
                                                                <svg
                                                                    viewBox="0 0 300 90"
                                                                    className="h-24 w-full"
                                                                    role="img"
                                                                    aria-label="최근 12개월 월세 추이 그래프"
                                                                >
                                                                    <line x1="32" y1="12" x2="32" y2="72" stroke="#E5E7EB" strokeWidth="1" />
                                                                    <line x1="32" y1="72" x2="292" y2="72" stroke="#E5E7EB" strokeWidth="1" />

                                                                    <text x="0" y="16" fontSize="9" fill="#9CA3AF">70만 원</text>
                                                                    <text x="0" y="45" fontSize="9" fill="#9CA3AF">55만 원</text>
                                                                    <text x="0" y="74" fontSize="9" fill="#9CA3AF">40만 원</text>

                                                                    <polyline
                                                                        points="40,58 70,50 100,49 130,47 160,44 190,40 220,36 250,34 280,28"
                                                                        fill="none"
                                                                        stroke="#60A5FA"
                                                                        strokeWidth="2.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />

                                                                    {[
                                                                        [40, 58],
                                                                        [70, 50],
                                                                        [100, 49],
                                                                        [130, 47],
                                                                        [160, 44],
                                                                        [190, 40],
                                                                        [220, 36],
                                                                        [250, 34],
                                                                        [280, 28],
                                                                    ].map(([cx, cy], index) => (
                                                                        <circle
                                                                            key={index}
                                                                            cx={cx}
                                                                            cy={cy}
                                                                            r={3}
                                                                            fill={index === 8 ? "#2563EB" : "#93C5FD"}
                                                                        />
                                                                    ))}

                                                                    <text x="34" y="88" fontSize="9" fill="#9CA3AF">23.06</text>
                                                                    <text x="95" y="88" fontSize="9" fill="#9CA3AF">23.08</text>
                                                                    <text x="158" y="88" fontSize="9" fill="#9CA3AF">23.10</text>
                                                                    <text x="220" y="88" fontSize="9" fill="#9CA3AF">24.02</text>
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400">
                                                            <Info size={13} strokeWidth={2.1} className="mt-[1px] shrink-0 text-gray-400" />
                                                            <p>
                                                                실거래가는 유사 매물 기준 참고값이며 층수·옵션·관리비에 따라 차이가 있을 수 있어요.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AI 요약 탭 */}
                                                {activeDetailTab === "ai" && (
                                                    <div className="p-3.5">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1.5 text-blue-600">
                                                                    <Sparkles size={14} strokeWidth={2.4} />
                                                                    <p className="text-sm font-extrabold">
                                                                        AI 요약
                                                                    </p>
                                                                </div>

                                                                <span className="text-xs font-semibold text-gray-400">
                                                                    출퇴근·가격·생활 편의 기준
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="mt-3 max-h-[180px] overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-700"
                                                        >
                                                            {isLoading ? (
                                                                <div className="flex min-h-[120px] items-center justify-center text-center text-gray-400">
                                                                    AI 요약을 생성하는 중입니다...
                                                                </div>
                                                            ) : summary ? (
                                                                <AiSummaryView summary={summary} />
                                                            ) : (
                                                                <div className="flex min-h-[120px] items-center justify-center text-center text-gray-400">
                                                                    AI 요약을 불러오는 중입니다.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
