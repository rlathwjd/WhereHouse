import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import fs from "fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const file = fs.readFileSync("src/data/rooms.csv", "utf-8");

type RoomCsv = {
    room_id: string;
    location: string;
    deposit: string;
    rent: string;
    size: string;
    room_type: string;
};

const rooms = parse(file, {
    columns: true,
    skip_empty_lines: true,
}) as RoomCsv[];

async function geocode(address: string) {
    const apiKey = process.env.KAKAO_REST_API_KEY;

    const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
            headers: {
                Authorization: `KakaoAK ${apiKey}`,
            },
        }
    );

    const data = await res.json();

    if (!data.documents?.length) {
        return null;
    }

    return {
        lat: Number(data.documents[0].y),
        lng: Number(data.documents[0].x),
    };
}

async function main() {
    for (const room of rooms) {
        const { data: existing } = await supabase
            .from("rooms")
            .select("id")
            .eq("room_id", room.room_id)
            .maybeSingle();

        // 이미 존재하면 스킵
        if (existing) {
            continue;
        }

        const coords = await geocode(room.location);

        if (!coords) continue;

        const { error } = await supabase.from("rooms").insert({
            room_id: room.room_id,
            location: room.location,
            deposit: Number(room.deposit),
            rent: Number(room.rent),
            size: Number(room.size),
            room_type: room.room_type,
            lat: coords.lat,
            lng: coords.lng,
        });

        if (error) {
            console.error("삽입 실패:", room.room_id, error.message);
            continue;
        }

        console.log("신규 데이터 삽입 완료:", room.location);
    }
}

main();