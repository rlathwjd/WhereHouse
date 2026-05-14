import { useRef } from "react";
import type { Room } from "@/types/map";

type ShowRoomClustersParams = {
    regions?: string[];
    roomTypes?: string[];
    tradeTypes?: string[];
    maxDeposit?: number | null;
    maxRent?: number | null;
    minRoomSize?: number | null;
    rooms?: string[];
    approvalDate?: string | null;
};

type UseKakaoRoomClusterProps = {
    mapRef: React.RefObject<any>;

    // 왼쪽 기본 매물 리스트
    // 조건 없음: 전체 매물
    // 조건 있음: 조건에 맞는 매물
    setFilteredRooms: React.Dispatch<React.SetStateAction<Room[]>>;

    // 마커 클릭 시 해당 지역/클러스터 매물
    setSelectedClusterRooms: React.Dispatch<React.SetStateAction<Room[]>>;
    setSelectedClusterName: React.Dispatch<React.SetStateAction<string | null>>;

    setShowRoomList: React.Dispatch<React.SetStateAction<boolean>>;
};

type RoomGroup = {
    fullRegionName: string; // 왼쪽 패널용: 서울특별시 강서구 방화동
    markerRegionName: string; // 지도 마커용: 방화동
    rooms: Room[]; // 해당 지역 전체 매물

    matchedRooms?: Room[]; // 해당 지역 중 조건에 맞는 매물
    isMatched?: boolean; // 조건에 맞는 매물이 있는 지역인지
    hasFilter?: boolean; // 현재 필터가 걸려있는지

    lat: number;
    lng: number;
};

export function useKakaoRoomCluster({
    mapRef,
    setFilteredRooms,
    setSelectedClusterRooms,
    setSelectedClusterName,
    setShowRoomList,
}: UseKakaoRoomClusterProps) {
    const markersRef = useRef<any[]>([]);
    const overlaysRef = useRef<any[]>([]);
    const clustererRef = useRef<any>(null);
    const selectedOverlaysRef = useRef<Map<string, HTMLElement>>(new Map());
    const selectedGroupsRef = useRef<Map<string, Room[]>>(new Map());

    const clearRoomClusters = () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        overlaysRef.current.forEach((overlay) => overlay.setMap(null));

        markersRef.current = [];
        overlaysRef.current = [];

        selectedOverlaysRef.current.clear();
        selectedGroupsRef.current.clear();

        if (clustererRef.current) {
            clustererRef.current.clear();
            clustererRef.current = null;
        }

        setFilteredRooms([]);
        setSelectedClusterRooms([]);
        setSelectedClusterName(null);
        setShowRoomList(false);
    };

    const getRoomId = (room: Room) => {
        return String((room as any).id ?? (room as any).room_id);
    };

    const getRoomLat = (room: Room) => {
        return Number(
            (room as any).lat ??
            (room as any).latitude ??
            (room as any).y ??
            (room as any).room_lat
        );
    };

    const getRoomLng = (room: Room) => {
        return Number(
            (room as any).lng ??
            (room as any).longitude ??
            (room as any).x ??
            (room as any).room_lng
        );
    };

    const getRoomRegionNames = (room: Room) => {
        const address = String((room as any).location ?? "").trim();

        if (!address) {
            return {
                fullRegionName: "지역 미상",
                markerRegionName: "지역 미상",
            };
        }

        const parts = address.split(/\s+/);

        const sido = parts[0] ?? "";

        const sigungu =
            parts.find((part, index) => {
                if (index === 0) return false;
                return /[가-힣0-9]+(?:구|군|시)$/.test(part);
            }) ?? "";

        const dong =
            parts.find((part) => /[가-힣0-9]+(?:동|읍|면)$/.test(part)) ?? "";

        const fullRegionName = [sido, sigungu, dong].filter(Boolean).join(" ");

        return {
            fullRegionName: fullRegionName || address,
            markerRegionName: dong || sigungu || address,
        };
    };

    const groupRoomsByRegion = (rooms: Room[]): RoomGroup[] => {
        const groupMap = new Map<
            string,
            {
                fullRegionName: string;
                markerRegionName: string;
                rooms: Room[];
            }
        >();

        rooms.forEach((room) => {
            const lat = getRoomLat(room);
            const lng = getRoomLng(room);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            const { fullRegionName, markerRegionName } = getRoomRegionNames(room);

            if (!groupMap.has(fullRegionName)) {
                groupMap.set(fullRegionName, {
                    fullRegionName,
                    markerRegionName,
                    rooms: [],
                });
            }

            groupMap.get(fullRegionName)!.rooms.push(room);
        });

        return Array.from(groupMap.values())
            .map((group) => {
                const validRooms = group.rooms.filter((room) => {
                    const lat = getRoomLat(room);
                    const lng = getRoomLng(room);

                    return Number.isFinite(lat) && Number.isFinite(lng);
                });

                if (validRooms.length === 0) return null;

                const lat =
                    validRooms.reduce((sum, room) => sum + getRoomLat(room), 0) /
                    validRooms.length;

                const lng =
                    validRooms.reduce((sum, room) => sum + getRoomLng(room), 0) /
                    validRooms.length;

                return {
                    fullRegionName: group.fullRegionName,
                    markerRegionName: group.markerRegionName,
                    rooms: validRooms,
                    lat,
                    lng,
                };
            })
            .filter((group): group is RoomGroup => group !== null);
    };

    const getMarkerInnerHTML = (
        markerRegionName: string,
        roomCount: number,
        options?: {
            isMatched?: boolean;
            isSelected?: boolean;
            hasFilter?: boolean;
        }
    ) => {
        const isSelected = options?.isSelected ?? false;
        const isMatched = options?.isMatched ?? true;
        const hasFilter = options?.hasFilter ?? false;

        const background = isSelected
            ? "#2563EB"
            : hasFilter
                ? isMatched
                    ? "#111827"
                    : "#E5E7EB"
                : "#111827";

        const border = isSelected
            ? "#2563EB"
            : hasFilter
                ? isMatched
                    ? "#111827"
                    : "#D1D5DB"
                : "#111827";

        const color = hasFilter && !isMatched && !isSelected ? "#6B7280" : "white";

        const subColor =
            hasFilter && !isMatched && !isSelected ? "#9CA3AF" : "#E5E7EB";

        return `
      <div style="
        min-width: 82px;
        padding: 8px 11px;
        border-radius: 999px;
        border: 1px solid ${border};
        background: ${background};
        color: ${color};
        font-size: 12px;
        font-weight: 800;
        line-height: 1.25;
        text-align: center;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      ">
        <div>${markerRegionName}</div>
        <div style="
          margin-top: 2px;
          font-size: 11px;
          font-weight: 700;
          color: ${subColor};
        ">
          매물 ${roomCount}개
        </div>
      </div>
    `;
    };

    const createRegionOverlay = (group: RoomGroup) => {
        const position = new window.kakao.maps.LatLng(group.lat, group.lng);

        const content = document.createElement("button");
        content.type = "button";

        // 왼쪽 패널에 보여줄 매물
        // 조건 있음 + 조건에 맞는 지역 → 조건에 맞는 매물
        // 조건 없음 또는 조건에 안 맞는 회색 지역 → 해당 지역 전체 매물
        const roomsToShow =
            group.hasFilter && group.isMatched
                ? group.matchedRooms ?? []
                : group.rooms;

        // 마커에 표시할 개수는 항상 해당 지역 전체 매물 수
        const markerRoomCount = group.rooms.length;

        content.innerHTML = getMarkerInnerHTML(
            group.markerRegionName,
            markerRoomCount,
            {
                isMatched: group.isMatched,
                hasFilter: group.hasFilter,
                isSelected: false,
            }
        );

        content.style.border = "none";
        content.style.background = "transparent";
        content.style.padding = "0";
        content.style.cursor = "pointer";

        content.dataset.regionName = group.markerRegionName;
        content.dataset.roomCount = String(markerRoomCount);
        content.dataset.isMatched = String(group.isMatched ?? true);
        content.dataset.hasFilter = String(group.hasFilter ?? false);

        content.addEventListener("click", () => {
            const groupKey = group.fullRegionName;

            const isAlreadySelected = selectedOverlaysRef.current.has(groupKey);

            if (isAlreadySelected) {
                content.innerHTML = getMarkerInnerHTML(
                    group.markerRegionName,
                    markerRoomCount,
                    {
                        isMatched: group.isMatched,
                        hasFilter: group.hasFilter,
                        isSelected: false,
                    }
                );

                selectedOverlaysRef.current.delete(groupKey);
                selectedGroupsRef.current.delete(groupKey);
            } else {
                content.innerHTML = getMarkerInnerHTML(
                    group.markerRegionName,
                    markerRoomCount,
                    {
                        isMatched: group.isMatched,
                        hasFilter: group.hasFilter,
                        isSelected: true,
                    }
                );

                selectedOverlaysRef.current.set(groupKey, content);
                selectedGroupsRef.current.set(groupKey, roomsToShow);
            }

            const selectedRooms = Array.from(selectedGroupsRef.current.values()).flat();
            const selectedRegionNames = Array.from(selectedGroupsRef.current.keys());

            if (selectedRooms.length > 0) {
                setSelectedClusterRooms(selectedRooms);

                setSelectedClusterName(
                    selectedRegionNames.length === 1
                        ? selectedRegionNames[0]
                        : `선택 지역 ${selectedRegionNames.length}곳`
                );

                setShowRoomList(true);
                return;
            }

            setSelectedClusterRooms([]);
            setSelectedClusterName(null);
            setShowRoomList(true);
        });

        const overlay = new window.kakao.maps.CustomOverlay({
            position,
            content,
            yAnchor: 1,
            zIndex: 10,
        });

        overlay.setMap(mapRef.current);
        overlaysRef.current.push(overlay);
    };

    const fitMapToRooms = (rooms: Room[]) => {
        if (!mapRef.current || rooms.length === 0) return;

        const bounds = new window.kakao.maps.LatLngBounds();

        rooms.forEach((room) => {
            const lat = getRoomLat(room);
            const lng = getRoomLng(room);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            bounds.extend(new window.kakao.maps.LatLng(lat, lng));
        });

        mapRef.current.setBounds(bounds);
    };

    const buildQueryString = (params: ShowRoomClustersParams) => {
        const searchParams = new URLSearchParams();

        params.regions?.forEach((region) => {
            searchParams.append("regions", region);
        });

        params.roomTypes?.forEach((roomType) => {
            searchParams.append("roomTypes", roomType);
        });

        params.tradeTypes?.forEach((tradeType) => {
            searchParams.append("tradeTypes", tradeType);
        });

        params.rooms?.forEach((room) => {
            searchParams.append("rooms", room);
        });

        if (params.maxDeposit !== null && params.maxDeposit !== undefined) {
            searchParams.set("maxDeposit", String(params.maxDeposit));
        }

        if (params.maxRent !== null && params.maxRent !== undefined) {
            searchParams.set("maxRent", String(params.maxRent));
        }

        if (params.minRoomSize !== null && params.minRoomSize !== undefined) {
            searchParams.set("minRoomSize", String(params.minRoomSize));
        }

        if (params.approvalDate) {
            searchParams.set("approvalDate", params.approvalDate);
        }

        const queryString = searchParams.toString();

        return queryString ? `?${queryString}` : "";
    };

    const showRoomClusters = async (params: ShowRoomClustersParams = {}) => {
        if (!mapRef.current || !window.kakao?.maps) return;

        markersRef.current.forEach((marker) => marker.setMap(null));
        overlaysRef.current.forEach((overlay) => overlay.setMap(null));

        markersRef.current = [];
        overlaysRef.current = [];

        selectedOverlaysRef.current.clear();
        selectedGroupsRef.current.clear();

        if (clustererRef.current) {
            clustererRef.current.clear();
            clustererRef.current = null;
        }

        setSelectedClusterRooms([]);
        setSelectedClusterName(null);

        try {
            const queryString = buildQueryString(params);
            const hasFilter = queryString.length > 0;

            const [allRooms, matchedRooms]: [Room[], Room[]] = hasFilter
                ? await Promise.all([
                    fetch("/api/rooms").then((res) => {
                        if (!res.ok) {
                            throw new Error("전체 매물 데이터를 불러오지 못했습니다.");
                        }

                        return res.json();
                    }),
                    fetch(`/api/rooms${queryString}`).then(async (res) => {
                        if (!res.ok) {
                            console.warn("조건에 맞는 매물이 없습니다.");
                            return [];
                        }

                        const data = await res.json();

                        return Array.isArray(data) ? data : [];
                    }),
                ])
                : await fetch("/api/rooms")
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error("매물 데이터를 불러오지 못했습니다.");
                        }

                        return res.json();
                    })
                    .then((rooms: Room[]) => [rooms, rooms]);

            // 왼쪽 기본 매물 정보
            // 조건 없음: 전체 매물
            // 조건 있음: 조건에 맞는 매물
            setFilteredRooms(matchedRooms);
            setShowRoomList(true);

            if (allRooms.length === 0) {
                return;
            }

            const matchedRoomIdSet = new Set(matchedRooms.map(getRoomId));

            // 지도 마커는 전체 매물 기준으로 생성
            const groups = groupRoomsByRegion(allRooms);

            groups.forEach((group) => {
                const matchedGroupRooms = group.rooms.filter((room) =>
                    matchedRoomIdSet.has(getRoomId(room))
                );

                createRegionOverlay({
                    ...group,
                    matchedRooms: matchedGroupRooms,
                    isMatched: matchedGroupRooms.length > 0,
                    hasFilter,
                });
            });

            fitMapToRooms(allRooms);
        } catch (error) {
            console.error(error);

            setFilteredRooms([]);
            setSelectedClusterRooms([]);
            setSelectedClusterName(null);
            setShowRoomList(true);
        }
    };

    return {
        clearRoomClusters,
        showRoomClusters,
    };
}