import { useCallback, useRef } from "react";
import type { Room } from "@/types/map";

export function useRoomsCache() {
    const roomsCacheRef = useRef<Room[] | null>(null);
    const loadingPromiseRef = useRef<Promise<Room[]> | null>(null);

    const loadRoomsOnce = useCallback(async () => {
        if (roomsCacheRef.current) {
            return roomsCacheRef.current;
        }

        if (loadingPromiseRef.current) {
            return loadingPromiseRef.current;
        }

        loadingPromiseRef.current = fetch("/api/rooms")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("매물 정보를 불러오지 못했습니다.");
                }

                const rooms: Room[] = await res.json();
                roomsCacheRef.current = rooms;

                return rooms;
            })
            .finally(() => {
                loadingPromiseRef.current = null;
            });

        return loadingPromiseRef.current;
    }, []);

    const clearRoomsCache = useCallback(() => {
        roomsCacheRef.current = null;
        loadingPromiseRef.current = null;
    }, []);

    return {
        loadRoomsOnce,
        clearRoomsCache,
    };
}