import { useState } from "react";
import type { Place, Room } from "@/types/map";

export function useRoomSummary(confirmedCompany: Place | null) {
    const [roomSummaries, setRoomSummaries] = useState<Record<string, string>>({});
    const [loadingSummaryKey, setLoadingSummaryKey] = useState<string | null>(null);

    const getRoomId = (room: Room) => {
        return String((room as any).id ?? (room as any).room_id);
    };

    const getCompanyKey = () => {
        return (
            confirmedCompany?.id ??
            confirmedCompany?.place_name ??
            confirmedCompany?.road_address_name ??
            confirmedCompany?.address_name ??
            "no-company"
        );
    };

    const getSummaryKey = (room: Room) => {
        const roomId = getRoomId(room);
        const companyKey = getCompanyKey();

        return `${companyKey}:${roomId}`;
    };

    const getRoomSummary = async (room: Room) => {
        const summaryKey = getSummaryKey(room);

        // 이미 같은 회사 + 같은 매물 요약이 있으면 다시 요청하지 않음
        if (roomSummaries[summaryKey]) {
            return;
        }

        setLoadingSummaryKey(summaryKey);

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
                    [summaryKey]: data.error || "요약 생성에 실패했습니다.",
                }));
                return;
            }

            setRoomSummaries((prev) => ({
                ...prev,
                [summaryKey]: data.summary || "요약 생성에 실패했습니다.",
            }));
        } catch (error) {
            console.error("AI 요약 오류:", error);

            setRoomSummaries((prev) => ({
                ...prev,
                [summaryKey]: "요약 생성 중 오류가 발생했습니다.",
            }));
        } finally {
            setLoadingSummaryKey(null);
        }
    };

    return {
        roomSummaries,
        loadingRoomId: loadingSummaryKey,
        getRoomSummary,
        getSummaryKey,
    };
}