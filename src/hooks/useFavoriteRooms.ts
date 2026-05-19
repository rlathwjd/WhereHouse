import { useEffect, useState } from "react";
import type { Room } from "@/types/map";

const FAVORITE_ROOMS_STORAGE_KEY = "wherehouse_favorite_rooms";

const getRoomId = (room: Room) => {
    return String(room.id ?? room.room_id);
};

export function useFavoriteRooms() {
    const [favoriteRooms, setFavoriteRooms] = useState<Room[]>(() => {
        if (typeof window === "undefined") return [];

        try {
            const savedFavoriteRooms = window.localStorage.getItem(
                FAVORITE_ROOMS_STORAGE_KEY
            );

            if (!savedFavoriteRooms) return [];

            const parsedFavoriteRooms = JSON.parse(savedFavoriteRooms);

            return Array.isArray(parsedFavoriteRooms) ? parsedFavoriteRooms : [];
        } catch (error) {
            console.error("관심 매물을 불러오지 못했습니다.", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(
                FAVORITE_ROOMS_STORAGE_KEY,
                JSON.stringify(favoriteRooms)
            );
        } catch (error) {
            console.error("관심 매물을 저장하지 못했습니다.", error);
        }
    }, [favoriteRooms]);

    const addFavoriteRoom = (room: Room) => {
        const roomId = getRoomId(room);

        setFavoriteRooms((prev) => {
            const alreadyExists = prev.some((item) => getRoomId(item) === roomId);

            if (alreadyExists) return prev;

            return [...prev, room];
        });
    };

    const removeFavoriteRoom = (room: Room) => {
        const roomId = getRoomId(room);

        setFavoriteRooms((prev) =>
            prev.filter((item) => getRoomId(item) !== roomId)
        );
    };

    return {
        favoriteRooms,
        addFavoriteRoom,
        removeFavoriteRoom,
        getRoomId,
    };
}
