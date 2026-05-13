import { useRef } from "react";
import { flushSync } from "react-dom";
import type { Room } from "@/types/map";

type Props = {
    mapRef: React.RefObject<any>;
    setVisibleRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    setShowRoomList: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useKakaoRoomCluster({
    mapRef,
    setVisibleRooms,
    setShowRoomList,
}: Props) {
    const clusterOverlaysRef = useRef<any[]>([]);
    const allRoomsRef = useRef<Room[]>([]);

    const clearRoomClusters = () => {
        clusterOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
        clusterOverlaysRef.current = [];
        setVisibleRooms([]);
        setShowRoomList(false);
    };

    const renderRoomClusters = (rooms: Room[]) => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const bounds = map.getBounds();
        const projection = map.getProjection();
        const level = map.getLevel();

        clusterOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
        clusterOverlaysRef.current = [];

        const visibleRooms = rooms.filter((room) => {
            const position = new window.kakao.maps.LatLng(
                Number(room.lat),
                Number(room.lng)
            );

            return bounds.contain(position);
        });

        const clusterDistance = level <= 4 ? 10 : level <= 6 ? 20 : 40;
        const clusters: any[] = [];

        visibleRooms.forEach((room) => {
            const position = new window.kakao.maps.LatLng(
                Number(room.lat),
                Number(room.lng)
            );

            const point = projection.pointFromCoords(position);

            const targetCluster = clusters.find((cluster) => {
                const dx = cluster.point.x - point.x;
                const dy = cluster.point.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                return distance < clusterDistance;
            });

            if (targetCluster) {
                targetCluster.rooms.push(room);

                const count = targetCluster.rooms.length;

                targetCluster.lat =
                    targetCluster.rooms.reduce(
                        (sum: number, item: Room) => sum + Number(item.lat),
                        0
                    ) / count;

                targetCluster.lng =
                    targetCluster.rooms.reduce(
                        (sum: number, item: Room) => sum + Number(item.lng),
                        0
                    ) / count;

                targetCluster.position = new window.kakao.maps.LatLng(
                    targetCluster.lat,
                    targetCluster.lng
                );

                targetCluster.point = projection.pointFromCoords(
                    targetCluster.position
                );
            } else {
                clusters.push({
                    rooms: [room],
                    lat: Number(room.lat),
                    lng: Number(room.lng),
                    position,
                    point,
                });
            }
        });

        clusters.forEach((cluster) => {
            const roomsInCluster = cluster.rooms as Room[];
            const isSingle = roomsInCluster.length === 1;

            const content = document.createElement("button");

            content.type = "button";
            content.style.width = isSingle ? "42px" : "52px";
            content.style.height = isSingle ? "42px" : "52px";
            content.style.borderRadius = "9999px";
            content.style.background = isSingle ? "#ffffff" : "#2563eb";
            content.style.color = isSingle ? "#2563eb" : "#ffffff";
            content.style.display = "flex";
            content.style.alignItems = "center";
            content.style.justifyContent = "center";
            content.style.fontWeight = "800";
            content.style.fontSize = isSingle ? "15px" : "17px";
            content.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
            content.style.cursor = "pointer";
            content.style.border = isSingle
                ? "3px solid #2563eb"
                : "3px solid white";
            content.style.pointerEvents = "auto";
            content.style.zIndex = "9999";
            content.textContent = String(roomsInCluster.length);

            content.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                flushSync(() => {
                    setVisibleRooms(roomsInCluster);
                    setShowRoomList(true);
                });

                setTimeout(() => {
                    mapRef.current?.relayout();
                }, 300);

                if (!isSingle) {
                    map.setCenter(cluster.position);
                    map.setLevel(Math.max(level - 2, 3));
                }
            };

            const overlay = new window.kakao.maps.CustomOverlay({
                position: cluster.position,
                content,
                yAnchor: 0.5,
                xAnchor: 0.5,
                clickable: true,
            });

            overlay.setMap(map);
            clusterOverlaysRef.current.push(overlay);
        });
    };

    const showRoomClusters = async () => {
        if (!mapRef.current) return;

        const res = await fetch("/api/rooms");
        const rooms = await res.json();

        allRoomsRef.current = rooms;
        renderRoomClusters(rooms);
    };

    return {
        allRoomsRef,
        clusterOverlaysRef,
        clearRoomClusters,
        renderRoomClusters,
        showRoomClusters,
    };
}