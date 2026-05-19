export type Place = {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
};

export type Room = {
    id?: string | number;
    room_id: string;
    title?: string;
    address?: string;
    address_name?: string;
    location: string;
    deposit: number;
    deposit_price?: number;
    rent: number;
    monthly_rent?: number;
    size: number;
    area?: number;
    room_size?: number;
    roomSize?: number;
    exclusive_area?: number;
    room_type: string;
    roomType?: string;
    trade_type?: string;
    tradeType?: string;
    rooms?: string | number;
    room_count?: string | number;
    roomCount?: string | number;
    approval_date?: string;
    approvalDate?: string;
    approved_at?: string;
    lat: number;
    latitude?: number;
    lng: number;
    longitude?: number;
    x?: string | number;
    y?: string | number;
    room_lat?: string | number;
    room_lng?: string | number;
};

export type FilterMenu =
    | "region"
    | "roomType"
    | "trade"
    | "budget"
    | "commute"
    | "roomSize"
    | "approvalDate"
    | "rooms"
    | null;

export type HomeMode = "condition" | "localReview" | "favoriteCompare" | null;

export type KakaoLatLng = unknown;

export type KakaoMap = {
    relayout: () => void;
    setCenter: (position: KakaoLatLng) => void;
    setLevel: (level: number) => void;
    setBounds: (bounds: KakaoLatLngBounds) => void;
};

export type KakaoMapEntity = {
    setMap: (map: KakaoMap | null) => void;
};

export type KakaoInfoWindow = {
    open: (map: KakaoMap, marker: KakaoMapEntity) => void;
    close: () => void;
};

export type KakaoLatLngBounds = {
    extend: (position: KakaoLatLng) => void;
};

export type KakaoClusterer = {
    clear: () => void;
};

export type KakaoMapsNamespace = {
    load: (callback: () => void) => void;
    LatLng: new (lat: string | number, lng: string | number) => KakaoLatLng;
    LatLngBounds: new () => KakaoLatLngBounds;
    Map: new (
        container: HTMLElement,
        options: { center: KakaoLatLng; level: number }
    ) => KakaoMap;
    Marker: new (options: {
        position: KakaoLatLng;
        map: KakaoMap;
    }) => KakaoMapEntity;
    InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
    CustomOverlay: new (options: {
        position: KakaoLatLng;
        content: HTMLElement;
        yAnchor: number;
        zIndex: number;
    }) => KakaoMapEntity;
    services: {
        Places: new () => {
            keywordSearch: (
                keyword: string,
                callback: (data: Place[], status: string) => void
            ) => void;
        };
        Status: {
            OK: string;
        };
    };
    event: {
        addListener: (
            target: KakaoMapEntity,
            eventName: string,
            callback: () => void
        ) => void;
    };
};

export type KakaoNamespace = {
    maps: KakaoMapsNamespace;
};

declare global {
    interface Window {
        kakao?: KakaoNamespace;
        selectRoomInfo?: (roomId: string) => void;
    }
}
