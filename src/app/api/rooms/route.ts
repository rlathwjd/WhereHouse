import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const regions = searchParams.getAll("regions");
        const markerRegions = searchParams.getAll("markerRegions");
        const roomTypes = searchParams.getAll("roomTypes");
        const tradeTypes = searchParams.getAll("tradeTypes");
        const rooms = searchParams.getAll("rooms");

        const maxDeposit = searchParams.get("maxDeposit");
        const maxRent = searchParams.get("maxRent");
        const minRoomSize = searchParams.get("minRoomSize");
        const approvalDate = searchParams.get("approvalDate");

        let query = supabase.from("rooms").select("*");

        // 지역 필터
        if (regions.length > 0) {
            const regionFilter = regions
                .map((region) => `location.ilike.%${region}%`)
                .join(",");

            query = query.or(regionFilter);
        }
        
        // 마커 지역 필터
        if (markerRegions.length > 0) {
            const markerRegionConditions = markerRegions
                .map((region) => `location.ilike.%${region}%`)
                .join(",");

            query = query.or(markerRegionConditions);
        }

        // 매물 유형 필터
        if (roomTypes.length > 0) {
            const expandedRoomTypes = roomTypes.flatMap((type) => {
                const trimmedType = type.trim();

                if (trimmedType === "원룸/투룸") {
                    return ["원룸", "투룸", "원룸/투룸"];
                }

                return [trimmedType];
            });

            const roomTypeOr = expandedRoomTypes
                .filter(Boolean)
                .map((type) => `room_type.ilike.%${type}%`)
                .join(",");

            if (roomTypeOr) {
                query = query.or(roomTypeOr);
            }
        }

        // 거래 유형 필터
        if (tradeTypes.length > 0) {
            const tradeTypeOr = tradeTypes
                .map((type) => `trade_type.ilike.%${type}%`)
                .join(",");

            query = query.or(tradeTypeOr);
        }

        // 방 개수 필터
        if (rooms.length > 0) {
            const roomsOr = rooms
                .map((room) => `rooms.ilike.%${room}%`)
                .join(",");

            query = query.or(roomsOr);
        }

        // 보증금 필터
        if (maxDeposit) {
            query = query.lte("deposit", Number(maxDeposit));
        }

        // 월세 필터
        if (maxRent) {
            query = query.lte("rent", Number(maxRent));
        }

        // 방 크기 필터
        if (minRoomSize) {
            query = query.gte("size", Number(minRoomSize));
        }

        // 사용승인일 필터
        if (approvalDate) {
            const approvalYearMap: Record<string, number> = {
                "5년 이내": 5,
                "10년 이내": 10,
                "15년 이내": 15,
                "20년 이내": 20,
            };

            const yearRange = approvalYearMap[approvalDate];

            if (yearRange) {
                const currentYear = new Date().getFullYear();
                const minYear = currentYear - yearRange;

                query = query.gte("approval_year", minYear);
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error("rooms query error:", error);

            return NextResponse.json(
                { message: "매물 데이터를 조회하는 중 오류가 발생했습니다." },
                { status: 500 }
            );
        }

        return NextResponse.json(data ?? []);
    } catch (error) {
        console.error("rooms api error:", error);

        return NextResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}