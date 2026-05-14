import { useState } from "react";
import type { Place, Room } from "@/types/map";

export function useRoomSummary(confirmedCompany: Place | null) {
    const [roomSummaries, setRoomSummaries] = useState<Record<string, string>>({});
    const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null);

    const getRoomSummary = async (room: Room) => {
        const roomId = String((room as any).id ?? (room as any).room_id);

        setLoadingRoomId(roomId);

        try {
            const res = await fetch("/api/ai/room-summary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    room,
                    company: confirmedCompany,
                }),
            });

            const data = await res.json();

            console.log("AI 요약 응답:", data);

            if (!res.ok) {
                setRoomSummaries((prev) => ({
                    ...prev,
                    [roomId]: data.error || "요약 생성에 실패했습니다.",
                }));
                return;
            }

            setRoomSummaries((prev) => ({
                ...prev,
                [roomId]: data.summary || "요약 생성에 실패했습니다.",
            }));
        } catch (error) {
            console.error("AI 요약 오류:", error);

            setRoomSummaries((prev) => ({
                ...prev,
                [roomId]: "요약 생성 중 오류가 발생했습니다.",
            }));
        } finally {
            setLoadingRoomId(null);
        }
    };

    return {
        roomSummaries,
        loadingRoomId,
        getRoomSummary,
    };
}