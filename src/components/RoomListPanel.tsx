import type { Room } from "@/types/map";

type RoomListPanelProps = {
    title?: string;
    visibleRooms: Room[];
    loadingRoomId: string | null;
    roomSummaries: Record<string, string>;
    getRoomSummary: (room: Room) => void;
};

export default function RoomListPanel({
    title,
    visibleRooms,
    loadingRoomId,
    roomSummaries,
    getRoomSummary,
}: RoomListPanelProps) {
    return (
        <div className="flex h-full flex-col bg-white">
            <div className="flex h-full flex-col bg-white">
                {/* 상단 헤더 */}
                <div className="bg-white px-6 pt-6">
                    <div className="flex items-center justify-between gap-3 pb-5">
                        <h3 className="text-xl font-extrabold tracking-tight text-gray-950">
                            {title ?? "매물 정보"}
                        </h3>

                        <span className="shrink-0 rounded-full bg-gray-950 px-4 py-1.5 text-sm font-extrabold text-white">
                            매물 {visibleRooms.length}개
                        </span>
                    </div>

                    <div className="h-px w-full bg-gray-200" />
                </div>

            {/* 매물 리스트 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                {visibleRooms.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed bg-gray-50 px-6 text-center">
                        <p className="text-base font-bold text-gray-800">
                            표시할 매물이 없어요
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                            조건을 조금 넓히거나 다른 지역을 선택해보세요.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibleRooms.map((room) => {
                            const roomId = String((room as any).id ?? (room as any).room_id);

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

                            return (
                                <article
                                    key={roomId}
                                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-lg font-extrabold text-gray-950">
                                                보증금 {deposit} / 월세 {rent}
                                            </p>

                                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                                {address}
                                            </p>
                                        </div>
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

                                    {summary && (
                                        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                                            {summary}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => getRoomSummary(room)}
                                        disabled={isLoading}
                                        className="mt-4 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >
                                        {isLoading ? "요약 중..." : "매물 장단점 요약"}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}