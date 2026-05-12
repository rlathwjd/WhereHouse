"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import { Building2, House } from "lucide-react";
import { flushSync } from "react-dom";

declare global {
  interface Window {
    kakao: any;
  }
}

type Place = {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
};

type FilterMenu =
  | "roomType"
  | "trade"
  | "budget"
  | "commute"
  | "roomSize"
  | "approvalDate"
  | "rooms"
  | null;

type HomeMode = "condition" | "interest" | "recommend" | null;

declare global {
  interface Window {
    kakao: any;
    selectRoomInfo?: (roomId: string) => void;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousCompanyRef = useRef<Place | null>(null);

  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Place | null>(null);

  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const [showHomeOptions, setShowHomeOptions] = useState(false);
  const [homeMode, setHomeMode] = useState<HomeMode>(null);
  const [showHomeFilters, setShowHomeFilters] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState<FilterMenu>(null);

  const [deposit, setDeposit] = useState(7000);
  const [rent, setRent] = useState(70);
  const [roomSize, setRoomSize] = useState(10);

  const [confirmedDeposit, setConfirmedDeposit] = useState(7000);
  const [confirmedRent, setConfirmedRent] = useState(70);
  const [confirmedRoomSize, setConfirmedRoomSize] = useState(10);

  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedTradeTypes, setSelectedTradeTypes] = useState<string[]>([]);
  const [selectedApprovalDate, setSelectedApprovalDate] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [visibleRooms, setVisibleRooms] = useState<any[]>([]);
  const [showRoomList, setShowRoomList] = useState(false);
  const clusterOverlaysRef = useRef<any[]>([]);
  const allRoomsRef = useRef<any[]>([]);


  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [isBudgetTouched, setIsBudgetTouched] = useState(false);
  const [isRoomSizeTouched, setIsRoomSizeTouched] = useState(false);

  const [selectedCommuteTime, setSelectedCommuteTime] = useState<string | null>(null);
  const [selectedWalkTime, setSelectedWalkTime] = useState<string | null>(null);
  const [selectedTransfers, setSelectedTransfers] = useState<string | null>(null);
  const homeModeText = {
    condition: {
      title: "조건으로 찾기",
      description: "금액, 출근 시간 등 조건 중심으로 탐색",
    },
    interest: {
      title: "관심 지역에서 찾기",
      description: "원하는 동네 직접 선택",
    },
    recommend: {
      title: "추천 생활권 보기",
      description: "근처 회사 재직자들의 추천 지역",
    },
  };

  const isRoomMap = homeMode === "condition";
  const shouldShowMap = !showHomeOptions;
  const shouldShowRoomPanel = isRoomMap && showRoomList;

  const initializeMap = () => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      if (!container) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 8,
      });

      mapRef.current = map;
    });
  };

  const clearRoomClusters = () => {
    clusterOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    clusterOverlaysRef.current = [];
    setVisibleRooms([]);
    setShowRoomList(false);
  };

  const renderRoomClusters = (rooms: any[]) => {
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
          targetCluster.rooms.reduce((sum: number, item: any) => sum + Number(item.lat), 0) / count;

        targetCluster.lng =
          targetCluster.rooms.reduce((sum: number, item: any) => sum + Number(item.lng), 0) / count;

        targetCluster.position = new window.kakao.maps.LatLng(
          targetCluster.lat,
          targetCluster.lng
        );

        targetCluster.point = projection.pointFromCoords(targetCluster.position);
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
      const roomsInCluster = cluster.rooms;
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
      content.style.border = isSingle ? "3px solid #2563eb" : "3px solid white";
      content.style.pointerEvents = "auto";
      content.style.zIndex = "9999";
      content.textContent = String(roomsInCluster.length);

      content.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("마커 클릭됨", roomsInCluster);

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

  const showRoomClusters = () => {
    if (!mapRef.current) return;

    fetch("/api/rooms")
      .then((res) => res.json())
      .then((rooms) => {
        console.log("rooms:", rooms);
        console.log("rooms length:", rooms.length);
        console.log("첫 번째 매물:", rooms[0]);

        allRoomsRef.current = rooms;
        renderRoomClusters(rooms);
      });
  };


  const searchPlace = () => {
    clearRoomClusters();

    if (!keyword.trim()) return;

    setHasSearched(true);
    setIsSearching(true);
    setSearchFailed(false);

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: Place[], status: string) => {
      setIsSearching(false);

      if (status !== window.kakao.maps.services.Status.OK) {
        setPlaces([]);
        setSearchFailed(true);
        return;
      }

      setPlaces(data);
      setSearchFailed(data.length === 0);
    });
  };

  const confirmCompany = (place: Place) => {
    setSelectedCompany(place);

    if (!mapRef.current) return;

    setHasSearched(true);

    const position = new window.kakao.maps.LatLng(place.y, place.x);

    if (markerRef.current) markerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();

    const marker = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="
          padding: 10px 14px;
          font-size: 13px;
          white-space: nowrap;
          background: white;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <span style="font-weight: 700;">
              ${place.place_name}
            </span>
            <span style="
              color: #9ca3af;
              font-size: 12px;
            ">
              ${place.road_address_name || place.address_name}
            </span>
          </div>
        </div>
      `,
    });

    infoWindow.open(mapRef.current, marker);

    markerRef.current = marker;
    infoWindowRef.current = infoWindow;

    setKeyword("");
    setPlaces([]);
    setShowCompanySearch(false);
    setIsEditingCompany(false);
  };

  const previewCompanyOnMap = (place: Place) => {
    if (!mapRef.current) return;

    const position = new window.kakao.maps.LatLng(place.y, place.x);

    mapRef.current.setCenter(position);
    mapRef.current.setLevel(4);

    if (markerRef.current) markerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();

    const marker = new window.kakao.maps.Marker({
      position,
      map: mapRef.current,
    });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="
          padding: 10px 14px;
          font-size: 13px;
          white-space: nowrap;
          background: white;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          ">
            <span style="font-weight: 700;">${place.place_name}</span>
            <span style="color: #9ca3af; font-size: 12px;">
              ${place.road_address_name || place.address_name}
            </span>
          </div>
          <div style="color: #666;">
            마커를 클릭하면 회사 위치로 확정됩니다.
          </div>
        </div>
      `,
    });

    infoWindow.open(mapRef.current, marker);

    window.kakao.maps.event.addListener(marker, "click", () => {
      confirmCompany(place);
    });

    markerRef.current = marker;
    infoWindowRef.current = infoWindow;

    setKeyword(place.place_name);
    setPlaces([]);
    setHasSearched(false);
    setSearchFailed(false);
  };

  const toggleFilter = (menu: FilterMenu) => {
    setOpenFilterMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleOption = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const resetHomeFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedTradeTypes([]);
    setSelectedApprovalDate(null);
    setSelectedRooms([]);

    setDeposit(7000);
    setRent(70);
    setRoomSize(10);

    setConfirmedDeposit(7000);
    setConfirmedRent(70);
    setConfirmedRoomSize(10);

    setIsBudgetTouched(false);
    setIsRoomSizeTouched(false);

    setSelectedCommuteTime(null);
    setSelectedWalkTime(null);
    setSelectedTransfers(null);

    setOpenFilterMenu(null);
  };

  const optionClass = (isSelected: boolean) =>
    `rounded-xl border p-3 font-semibold transition ${isSelected
      ? "border-slate-900 bg-(--color-primary) text-white"
      : "border-(--color-border) bg-white text-slate-700 hover:bg-slate-50"
    }`;

  const pillClass = (isSelected: boolean) =>
    `rounded-full border px-4 py-2 font-semibold transition ${isSelected
      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
      : "border-[var(--color-border)] bg-white text-slate-700 hover:bg-[var(--color-bg)]"
    }`;

  const formatKoreanMoney = (value: number) => {
    if (value >= 10000) {
      const eok = Math.floor(value / 10000);
      const rest = value % 10000;

      if (rest === 0) {
        return `${eok}억원`;
      }

      if (rest % 1000 === 0) {
        return `${eok}억 ${rest / 1000}천만원`;
      }

      return `${eok}억 ${rest.toLocaleString()}만원`;
    }

    return `${value.toLocaleString()}만원`;
  };

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={initializeMap}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* 회사 카드 */}
        <div className="rounded-2xl bg-[#eef7fe] p-5 text-[#374151] shadow-sm transition-transform duration-300">
          {selectedCompany ? (
            <div className="flex cursor-pointer items-start justify-between">
              <div
                onClick={() => {
                  clearRoomClusters();
                  setShowRoomList(false);

                  const next = !showCompanySearch;

                  setShowCompanySearch(next);
                  setHasSearched(false);

                  setShowHomeFilters(false);
                  setShowHomeOptions(false);
                  setOpenFilterMenu(null);
                  setHomeMode(null);

                  setPlaces([]);
                  setKeyword("");

                  if (next) {
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }
                }}
                className="cursor-pointer"
              >
                <p className="text-sm text-[#6B7280]">회사</p>

                <p className="mt-2 text-xl font-bold text-[#1F2937]">
                  {selectedCompany.place_name}
                </p>

                <p className="mt-1 text-sm text-[#6B7280]">
                  {selectedCompany.road_address_name ||
                    selectedCompany.address_name}
                </p>
              </div>

              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => {
                    clearRoomClusters();
                    if (showCompanySearch) {
                      setIsEditingCompany(false);
                      setShowCompanySearch(false);
                      setPlaces([]);
                      setKeyword("");

                      if (selectedCompany) {
                        confirmCompany(selectedCompany);
                      }

                      return;
                    }

                    previousCompanyRef.current = selectedCompany;

                    setIsEditingCompany(true);
                    setShowCompanySearch(true);
                    setHasSearched(false);
                    setShowHomeFilters(false);
                    setShowHomeOptions(false);
                    setOpenFilterMenu(null);
                    setHomeMode(null);
                    setKeyword("");

                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 100);
                  }}
                  className="rounded-xl bg-[#8CB9E8] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#74A8DD]"
                >
                  {showCompanySearch ? "취소" : "수정"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                const next = !showCompanySearch;

                setShowCompanySearch(next);
                setHasSearched(false);

                setShowHomeFilters(false);
                setShowHomeOptions(false);
                setOpenFilterMenu(null);
                setHomeMode(null);

                setPlaces([]);
                setKeyword("");

                if (next) {
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }
              }}
              className="flex min-h-[80px] w-full items-center justify-center gap-4 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Building2 size={28} className="text-[#334155]" />

                <span className="text-2xl font-bold text-[#1F2937]">
                  회사
                </span>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#94A3B8] bg-white text-3xl text-[#475569] transition-colors duration-200 hover:bg-[#F1F5F9]">
                +
              </span>
            </button>
          )}
        </div>

        {/* 집 카드 */}
        <div className="rounded-2xl bg-[#fef8ec] p-5 text-[#374151] shadow-sm transition-transform duration-300">
          <button
            type="button"
            onClick={() => {
              setShowCompanySearch(false);
              setPlaces([]);
              setKeyword("");

              clusterOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
              clusterOverlaysRef.current = [];

              setVisibleRooms([]);
              setShowRoomList(false);
              setHomeMode(null);
              setShowHomeFilters(false);
              setOpenFilterMenu(null);

              setShowHomeOptions(true);
            }}
            className="flex min-h-[80px] w-full items-center justify-center gap-4 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <House size={28} className="text-[#6B5B4D]" />

              <span className="text-2xl font-bold text-[#1F2937]">
                집
              </span>
            </div>

            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#94A3B8] bg-white text-3xl text-[#475569] transition-colors duration-200 hover:bg-[#F1F5F9]">
              +
            </span>
          </button>
        </div>
      </div>

      {showCompanySearch && (
        <div className="mt-6 w-full">
          <div className="flex w-full gap-3">
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchPlace();
              }}
              placeholder="회사명 또는 주소를 검색하세요"
              className="flex-1 rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200"
            />

            <button
              type="button"
              onClick={searchPlace}
              className="shrink-0 rounded-xl bg-(--color-primary) px-6 py-4 text-white"
            >
              검색
            </button>
          </div>

          {showCompanySearch && hasSearched && !isSearching && (
            <div className="mt-3 rounded-2xl border bg-white p-4 shadow-sm">
              <p className="mb-3 font-semibold">검색 결과</p>

              {searchFailed ? (
                <p className="pl-3 py-2 text-sm text-gray-400">
                  검색 결과가 없습니다. 직접 주소를 입력해 주세요.
                </p>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => previewCompanyOnMap(place)}
                      className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{place.place_name}</span>
                        <span className="text-sm font-normal text-gray-400">
                          {place.road_address_name || place.address_name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showHomeOptions && (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-500">
            어떤 방식으로 집을 찾아볼까요?
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setHomeMode("condition");
                setShowHomeOptions(false);
                setShowHomeFilters(true);
                setShowRoomList(true);

                setTimeout(() => {
                  mapRef.current?.relayout();
                  showRoomClusters();
                }, 300);
              }}
              className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
            >
              <p className="font-bold">조건으로 찾기</p>
              <p className="mt-1 text-sm text-gray-500">
                금액, 출근 시간 등 조건 중심으로 탐색
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                showRoomClusters();
                setHomeMode("interest");
                setShowHomeOptions(false);
                setShowHomeFilters(false);
              }}
              className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
            >
              <p className="font-bold">관심 지역에서 찾기</p>
              <p className="mt-1 text-sm text-gray-500">
                원하는 동네 직접 선택
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setHomeMode("recommend");
                setShowHomeOptions(false);
                setShowHomeFilters(false);
              }}
              className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
            >
              <p className="font-bold">추천 생활권 보기</p>
              <p className="mt-1 text-sm text-gray-500">
                근처 회사 재직자들의 추천 지역
              </p>
            </button>
          </div>
        </div>
      )}

      {homeMode && (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold">
                {homeModeText[homeMode].title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {homeModeText[homeMode].description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetHomeFilters();
                setHomeMode(null);
                setShowHomeOptions(true);
                setShowHomeFilters(false);
                setOpenFilterMenu(null);
              }}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              찾기 방식 변경
            </button>
          </div>

          {/* 1. 조건으로 찾기 */}
          {homeMode === "condition" && (
            <>
              <div className="flex flex-wrap gap-3">
                {[
                  ["roomType", "매물 유형"],
                  ["trade", "거래 유형"],
                  ["budget", "가격"],
                  ["commute", "출퇴근"],
                  ["roomSize", "방 크기"],
                  ["rooms", "방 개수"],
                  ["approvalDate", "사용승인일"],

                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      toggleFilter(key as FilterMenu);

                      if (key === "budget") {
                        setIsBudgetTouched(true);
                      }

                      if (key === "roomSize") {
                        setIsRoomSizeTouched(true);
                      }
                    }}
                    className={`rounded-xl border px-5 py-3 font-semibold ${openFilterMenu === key
                      ? "border-slate-900 bg-(--color-primary) text-white"
                      : "bg-white"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {openFilterMenu && (
                <div className="mt-4 rounded-2xl border bg-gray-50 p-5">
                  {openFilterMenu === "roomType" && (
                    <>
                      <p className="mb-4 font-bold">매물 유형</p>

                      <div className="flex flex-wrap gap-2">
                        {["오피스텔", "원룸/투룸", "아파트", "쉐어하우스"].map((item) => {
                          const isSelected = selectedRoomTypes.includes(item);

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                toggleOption(
                                  item,
                                  selectedRoomTypes,
                                  setSelectedRoomTypes
                                )
                              }
                              className={pillClass(isSelected)}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {openFilterMenu === "trade" && (
                    <>
                      <p className="mb-4 font-bold">거래 유형</p>

                      <div className="flex flex-wrap gap-2">
                        {["월세", "전세", "매매"].map((item) => {
                          const isSelected = selectedTradeTypes.includes(item);

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                toggleOption(
                                  item,
                                  selectedTradeTypes,
                                  setSelectedTradeTypes
                                )
                              }
                              className={pillClass(isSelected)}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {openFilterMenu === "budget" && (
                    <>
                      <p className="mb-4 font-bold">가격</p>

                      <div className="space-y-6">
                        <div>
                          <div className="mb-2 flex justify-between">
                            <span className="font-semibold">보증금</span>
                            <span className="font-semibold text-slate-900">
                              {deposit >= 20000
                                ? "최대"
                                : formatKoreanMoney(deposit)}
                            </span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="20000"
                            step="500"
                            value={deposit}
                            onChange={(e) => setDeposit(Number(e.target.value))}
                            onMouseUp={() => setConfirmedDeposit(deposit)}
                            onTouchEnd={() => setConfirmedDeposit(deposit)}
                            className="w-full accent-slate-900"
                          />

                          <div className="mt-1 flex justify-between text-xs text-gray-400">
                            <span>최소</span>
                            <span>최대</span>
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex justify-between">
                            <span className="font-semibold">월세</span>
                            <span className="font-semibold text-slate-900">
                              {rent >= 150 ? "최대" : `${rent}만원`}
                            </span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="150"
                            step="5"
                            value={rent}
                            onChange={(e) => setRent(Number(e.target.value))}
                            onMouseUp={() => setConfirmedRent(rent)}
                            onTouchEnd={() => setConfirmedRent(rent)}
                            className="w-full accent-slate-900"
                          />

                          <div className="mt-1 flex justify-between text-xs text-gray-400">
                            <span>최소</span>
                            <span>최대</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}



                  {openFilterMenu === "commute" && (
                    <>
                      <p className="mb-4 font-bold">출퇴근 조건</p>

                      <div className="space-y-5">
                        <div>
                          <p className="mb-3 text-sm font-semibold text-gray-500">
                            소요시간
                          </p>

                          <div className="grid gap-3 md:grid-cols-4">
                            {["30분 이내", "1시간 이내", "1시간 30분 이내", "2시간 이내"].map((item) => {
                              const isSelected = selectedCommuteTime === item;

                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    setSelectedCommuteTime((prev) =>
                                      prev === item ? null : item
                                    )
                                  }
                                  className={optionClass(isSelected)}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-sm font-semibold text-gray-500">
                            도보시간
                          </p>

                          <div className="grid gap-3 md:grid-cols-3">
                            {["10분 이내", "20분 이내", "30분 이내"].map((item) => {
                              const isSelected = selectedWalkTime === item;

                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    setSelectedWalkTime((prev) =>
                                      prev === item ? null : item
                                    )
                                  }
                                  className={optionClass(isSelected)}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-sm font-semibold text-gray-500">
                            환승횟수
                          </p>

                          <div className="grid gap-3 md:grid-cols-3">
                            {["환승 없음", "1회 이하", "2회 이하"].map((item) => {
                              const isSelected = selectedTransfers === item;

                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    setSelectedTransfers((prev) =>
                                      prev === item ? null : item
                                    )
                                  }
                                  className={optionClass(isSelected)}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {openFilterMenu === "roomSize" && (
                    <>
                      <p className="mb-4 font-bold">방 크기</p>

                      <div>
                        <div className="mb-2 flex justify-between">
                          <span className="font-semibold">최소 면적</span>
                          <span className="font-semibold text-slate-900">
                            {roomSize}평 이상
                          </span>
                        </div>

                        <input
                          type="range"
                          min="3"
                          max="30"
                          step="1"
                          value={roomSize}
                          onChange={(e) => setRoomSize(Number(e.target.value))}
                          onMouseUp={() => setConfirmedRoomSize(roomSize)}
                          onTouchEnd={() => setConfirmedRoomSize(roomSize)}
                          className="w-full accent-slate-900"
                        />

                        <div className="mt-1 flex justify-between text-xs text-gray-400">
                          <span>3평</span>
                          <span>30평+</span>
                        </div>
                      </div>
                    </>
                  )}



                  {openFilterMenu === "rooms" && (
                    <>
                      <p className="mb-4 font-bold">방 개수</p>

                      <div className="grid gap-3 md:grid-cols-4">
                        {["원룸", "1.5룸", "투룸", "쓰리룸+"].map((item) => {
                          const isSelected = selectedRooms.includes(item);

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                toggleOption(item, selectedRooms, setSelectedRooms)
                              }
                              className={optionClass(isSelected)}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {openFilterMenu === "approvalDate" && (
                    <>
                      <p className="mb-4 font-bold">사용승인일</p>

                      <div className="grid gap-3 md:grid-cols-3">
                        {["5년 이내", "10년 이내", "15년 이내"].map((item) => {
                          const isSelected = selectedApprovalDate === item;

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                setSelectedApprovalDate((prev) => (prev === item ? null : item))
                              }
                              className={optionClass(isSelected)}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mt-4 rounded-2xl border bg-white p-4">
                <p className="mb-3 font-bold">선택한 조건</p>

                <div className="flex flex-wrap gap-2 text-sm">
                  {selectedRoomTypes.length > 0 && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      매물 유형: {selectedRoomTypes.join(", ")}
                    </span>
                  )}

                  {selectedTradeTypes.length > 0 && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      거래 유형: {selectedTradeTypes.join(", ")}
                    </span>
                  )}

                  {isBudgetTouched && (
                    <>
                      <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                        보증금:{" "}
                        {confirmedDeposit >= 20000
                          ? "무제한"
                          : formatKoreanMoney(confirmedDeposit)}{" "}
                        이하
                      </span>

                      <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                        월세: {confirmedRent >= 150 ? "무제한" : `${confirmedRent}만원`} 이하
                      </span>
                    </>
                  )}

                  {selectedCommuteTime && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      소요시간: {selectedCommuteTime}
                    </span>
                  )}

                  {selectedWalkTime && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      도보시간: {selectedWalkTime}
                    </span>
                  )}

                  {selectedTransfers && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      환승횟수: {selectedTransfers}
                    </span>
                  )}

                  {isRoomSizeTouched && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      방 크기: {confirmedRoomSize}평 이상
                    </span>
                  )}

                  {selectedRooms.length > 0 && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      방 개수: {selectedRooms.join(", ")}
                    </span>
                  )}

                  {selectedApprovalDate && (
                    <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                      사용승인일: {selectedApprovalDate}
                    </span>
                  )}

                </div>
              </div>
            </>
          )}

          {/* 2. 관심 지역 선택 */}
          {homeMode === "interest" && (
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="mb-4 font-bold">관심 지역 선택</p>

              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">
                    서울
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "마포구",
                      "영등포구",
                      "강서구",
                      "양천구",
                      "서대문구",
                      "은평구",
                      "용산구",
                      "성동구",
                      "강남구",
                    ].map((item) => {
                      const isSelected = selectedRegions.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            toggleOption(
                              item,
                              selectedRegions,
                              setSelectedRegions
                            )
                          }
                          className={pillClass(isSelected)}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-500">
                    경기 · 인천
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "고양",
                      "김포",
                      "부천",
                      "광명",
                      "안양",
                      "과천",
                      "성남",
                      "하남",
                      "인천",
                    ].map((item) => {
                      const isSelected = selectedRegions.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            toggleOption(
                              item,
                              selectedRegions,
                              setSelectedRegions
                            )
                          }
                          className={pillClass(isSelected)}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. 추천 지역 */}
          {homeMode === "recommend" && (
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="mb-4 font-bold">추천 생활권</p>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "출퇴근 중심형",
                    areas: "가양 · 염창 · 등촌",
                    desc: "회사까지 이동 시간을 우선으로 보는 지역",
                  },
                  {
                    title: "균형형",
                    areas: "당산 · 문래 · 영등포구청",
                    desc: "출퇴근과 생활 편의성을 같이 보는 지역",
                  },
                  {
                    title: "생활권 중심형",
                    areas: "합정 · 망원 · 홍대입구",
                    desc: "퇴근 후 생활과 접근성을 중시하는 지역",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="rounded-xl border bg-white p-4 text-left transition hover:bg-slate-50"
                  >
                    <p className="font-bold">{item.title}</p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {item.areas}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={shouldShowMap ? "mt-8 flex gap-4" : "hidden"}
        style={{ height: shouldShowMap ? "418px" : 0 }}
      >
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ${shouldShowRoomPanel ? "w-[360px]" : "w-0"
            }`}
        >
          {shouldShowRoomPanel && (
            <div className="h-full rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-bold">
                  매물 정보 ({visibleRooms.length})
                </p>
              </div>

              <div
                className="space-y-3 overflow-y-auto pr-2"
                style={{ height: "calc(100% - 48px)" }}
              >
                {visibleRooms.map((room) => (
                  <div key={room.room_id} className="rounded-xl border p-4">
                    <p className="font-bold">{room.title || "매물 정보"}</p>
                    <p className="mt-1 text-sm text-gray-500">{room.location}</p>
                    <p className="mt-2 font-semibold">
                      보증금 {room.deposit} / 월세 {room.rent}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {room.room_type} · {room.size}㎡
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`min-w-0 flex-1 overflow-hidden rounded-2xl ${shouldShowMap ? "border block" : "hidden"
            }`}
        >
          <div id="map" className="h-full w-full bg-gray-200" />
        </div>
      </div>
    </>
  );
}