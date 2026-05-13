import type { Room } from "@/types/map";
import RoomSummaryBox from "./RoomsSummaryBox";

type Props = {
    visibleRooms: Room[];
    loadingRoomId: string | null;
    roomSummaries: Record<string, string>;
    getRoomSummary: (room: Room) => void;
};

export default function RoomListPanel({
    visibleRooms,
    loadingRoomId,
    roomSummaries,
    getRoomSummary,
}: Props) {
    return (
        <div className="flex h-full flex-col bg-white p-6">
            <p className="mb-5 text-lg font-bold">
                매물 {visibleRooms.length}개
            </p>

            {visibleRooms.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
                    <div>
                        <p className="font-semibold text-gray-700">
                            표시할 매물이 없습니다.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            지도에서 매물을 선택하거나
                            <br />
                            조건을 적용하면 이곳에 표시됩니다.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {visibleRooms.map((room) => (
                        <div key={room.room_id} className="rounded-xl border p-4">
                            <p className="font-semibold">
                                보증금 {room.deposit} / 월세 {room.rent}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                {room.location}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {room.room_type} · {room.size}㎡
                            </p>

                            <button
                                type="button"
                                onClick={() => getRoomSummary(room)}
                                className="mt-4 rounded-lg bg-black px-3 py-2 text-sm text-white"
                            >
                                매물 장단점 요약
                            </button>

                            <RoomSummaryBox
                                isLoading={loadingRoomId === room.room_id}
                                summary={roomSummaries[room.room_id]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}