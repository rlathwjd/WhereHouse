export type Place = {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string;
    y: string;
};

export type Room = {
    room_id: string;
    title?: string;
    location: string;
    deposit: number;
    rent: number;
    size: number;
    room_type: string;
    lat: number;
    lng: number;
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

export type HomeMode = "condition" | "localReview" | null;