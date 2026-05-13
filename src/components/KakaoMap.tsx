"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import { House } from "lucide-react";

import type { Place, Room, FilterMenu, HomeMode } from "@/types/map";
import RoomListPanel from "@/components/RoomListPanel";
import CompanyCard from "@/components/CompanyCard";
import HomeFilterPanel from "@/components/HomeFilterPanel";
import HomeSearchOption from "@/components/HomeSearchOption";
import { useKakaoRoomCluster } from "@/hooks/useKakaoRoomCluster";
import { useRoomSummary } from "@/hooks/useRoomSummary";
import CompanySearchPanel from "@/components/CompanySearchPanel";
import InterestRegionPanel from "@/components/InterestRegionPanel";
import RecommendAreaPanel from "@/components/RecommendAreaPanel";

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
  const [confirmedCompany, setConfirmedCompany] = useState<Place | null>(null);

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
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [panelWidth, setPanelWidth] = useState(360);
  const isResizingRef = useRef(false);

  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const [showRoomList, setShowRoomList] = useState(false);

  const [isBudgetTouched, setIsBudgetTouched] = useState(false);
  const [isRoomSizeTouched, setIsRoomSizeTouched] = useState(false);

  const [selectedCommuteTime, setSelectedCommuteTime] = useState<string | null>(null);
  const [selectedWalkTime, setSelectedWalkTime] = useState<string | null>(null);
  const [selectedTransfers, setSelectedTransfers] = useState<string | null>(null);

  const {
    roomSummaries,
    loadingRoomId,
    getRoomSummary,
  } = useRoomSummary(confirmedCompany);

  const {
    clearRoomClusters,
    showRoomClusters,
  } = useKakaoRoomCluster({
    mapRef,
    setVisibleRooms,
    setShowRoomList,
  });

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
    setConfirmedCompany(place);

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

  const resetHomeFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedTradeTypes([]);
    setSelectedApprovalDate(null);
    setSelectedRooms([]);
    setSelectedRegions([]);

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

  const startResize = () => {
    isResizingRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const nextWidth = Math.min(Math.max(e.clientX - 40, 260), 620);
      setPanelWidth(nextWidth);
      mapRef.current?.relayout();
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setTimeout(() => mapRef.current?.relayout(), 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={initializeMap}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CompanyCard
          selectedCompany={selectedCompany}
          showCompanySearch={showCompanySearch}
          setShowCompanySearch={setShowCompanySearch}
          setShowHomeFilters={setShowHomeFilters}
          setShowHomeOptions={setShowHomeOptions}
          setOpenFilterMenu={setOpenFilterMenu}
          setHomeMode={setHomeMode}
          setPlaces={setPlaces}
          setKeyword={setKeyword}
          setHasSearched={setHasSearched}
          setIsEditingCompany={setIsEditingCompany}
          inputRef={inputRef}
          clearRoomClusters={clearRoomClusters}
          setShowRoomList={setShowRoomList}
          confirmCompany={confirmCompany}
          previousCompanyRef={previousCompanyRef}
        />

        <div className="rounded-2xl bg-[#fef8ec] p-5 text-[#374151] shadow-sm transition-transform duration-300">
          <button
            type="button"
            onClick={() => {
              setShowCompanySearch(false);
              setPlaces([]);
              setKeyword("");

              clearRoomClusters();

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
        <CompanySearchPanel
          inputRef={inputRef}
          keyword={keyword}
          setKeyword={setKeyword}
          searchPlace={searchPlace}
          showCompanySearch={showCompanySearch}
          hasSearched={hasSearched}
          isSearching={isSearching}
          searchFailed={searchFailed}
          places={places}
          previewCompanyOnMap={previewCompanyOnMap}
        />
      )}

      {showHomeOptions && (
        <HomeSearchOption
          setHomeMode={setHomeMode}
          setShowHomeOptions={setShowHomeOptions}
          setShowHomeFilters={setShowHomeFilters}
          setShowRoomList={setShowRoomList}
          showRoomClusters={showRoomClusters}
          mapRef={mapRef}
        />
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

          {homeMode === "condition" && (
            <HomeFilterPanel
              openFilterMenu={openFilterMenu}
              toggleFilter={toggleFilter}
              selectedRoomTypes={selectedRoomTypes}
              setSelectedRoomTypes={setSelectedRoomTypes}
              selectedTradeTypes={selectedTradeTypes}
              setSelectedTradeTypes={setSelectedTradeTypes}
              selectedApprovalDate={selectedApprovalDate}
              setSelectedApprovalDate={setSelectedApprovalDate}
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
              deposit={deposit}
              setDeposit={setDeposit}
              confirmedDeposit={confirmedDeposit}
              setConfirmedDeposit={setConfirmedDeposit}
              rent={rent}
              setRent={setRent}
              confirmedRent={confirmedRent}
              setConfirmedRent={setConfirmedRent}
              roomSize={roomSize}
              setRoomSize={setRoomSize}
              confirmedRoomSize={confirmedRoomSize}
              setConfirmedRoomSize={setConfirmedRoomSize}
              selectedCommuteTime={selectedCommuteTime}
              setSelectedCommuteTime={setSelectedCommuteTime}
              selectedWalkTime={selectedWalkTime}
              setSelectedWalkTime={setSelectedWalkTime}
              selectedTransfers={selectedTransfers}
              setSelectedTransfers={setSelectedTransfers}
              isBudgetTouched={isBudgetTouched}
              setIsBudgetTouched={setIsBudgetTouched}
              isRoomSizeTouched={isRoomSizeTouched}
              setIsRoomSizeTouched={setIsRoomSizeTouched}
            />
          )}

          {homeMode === "interest" && (
            <InterestRegionPanel
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
            />
          )}

          {homeMode === "recommend" && <RecommendAreaPanel />}
        </div>
      )}

      {/* <div
        className={shouldShowMap ? "mt-8 flex gap-4" : "hidden"}
        style={{ height: shouldShowMap ? "418px" : 0 }}
      >
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ${shouldShowRoomPanel ? "w-[360px]" : "w-0"
            }`}
        >
          {shouldShowRoomPanel && (
            <RoomListPanel
              visibleRooms={visibleRooms}
              loadingRoomId={loadingRoomId}
              roomSummaries={roomSummaries}
              getRoomSummary={getRoomSummary}
            />
          )}
        </div>

        <div
          className={`min-w-0 flex-1 overflow-hidden rounded-2xl ${shouldShowMap ? "border block" : "hidden"
            }`}
        >
          <div id="map" className="h-full w-full bg-gray-200" />
        </div>
      </div>
      
      */}

      <div
        className={shouldShowMap ? "mt-8 flex gap-0" : "hidden"}
        style={{ height: shouldShowMap ? "418px" : 0 }}
      >
        <div
          className="shrink-0 overflow-hidden transition-all duration-100"
          style={{
            width: shouldShowRoomPanel ? `${panelWidth}px` : 0,
          }}
        >
          {shouldShowRoomPanel && (
            <RoomListPanel
              visibleRooms={visibleRooms}
              loadingRoomId={loadingRoomId}
              roomSummaries={roomSummaries}
              getRoomSummary={getRoomSummary}
            />
          )}
        </div>

        {shouldShowRoomPanel && (
          <div className="flex h-full items-center px-2">
            <div
              onMouseDown={startResize}
              className="h-16 w-1.5 cursor-col-resize rounded-full bg-gray-400/70 transition hover:bg-gray-600"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border">
          <div id="map" className="h-full w-full bg-gray-200" />
        </div>
      </div>
    </>
  );
}