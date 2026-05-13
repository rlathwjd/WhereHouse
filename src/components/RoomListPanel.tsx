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
        <div className="h-full rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-bold">
                    매물 정보 ({visibleRooms.length})
                </p>
            </div>

            <div
                className="space-y-3 overflow-y-auto pr-2"
                style={{ height: "calc(100% - 48px)" }}
            >
                {visibleRooms.map((room) => (
                    <div key={room.room_id} className="rounded-xl border p-4">

                        <p className="mt-2 font-semibold">
                            보증금 {room.deposit} / 월세 {room.rent}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">{room.location}</p>

                        <p className="mt-1 text-sm text-gray-500">
                            {room.room_type} · {room.size}㎡
                        </p>

                        <button
                            type="button"
                            onClick={() => getRoomSummary(room)}
                            className="mt-3 rounded-lg bg-black px-3 py-2 text-sm text-white"
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
        </div>
    );
}