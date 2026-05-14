"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { House } from "lucide-react";

import type { Place, Room, FilterMenu, HomeMode } from "@/types/map";
import RoomListPanel from "@/components/RoomListPanel";
import CompanyCard from "@/components/CompanyCard";
import HomeFilterPanel from "@/components/HomeFilterPanel";
import HomeSearchOption from "@/components/HomeSearchOption";
import { useKakaoRoomCluster } from "@/hooks/useKakaoRoomCluster";
import { useRoomSummary } from "@/hooks/useRoomSummary";
import CompanySearchPanel from "@/components/CompanySearchPanel";
import { HOME_MODE_TEXT } from "@/constants/homeMode";


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
  
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedClusterRooms, setSelectedClusterRooms] = useState<Room[]>([]);
  const [selectedClusterName, setSelectedClusterName] = useState<string | null>(null);

  const [showRoomList, setShowRoomList] = useState(false);
  const [isBudgetTouched, setIsBudgetTouched] = useState(false);
  const [isRoomSizeTouched, setIsRoomSizeTouched] = useState(false);

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
    setFilteredRooms,
    setSelectedClusterRooms,
    setSelectedClusterName,
    setShowRoomList,
  });

  const isRoomMap = homeMode === "condition";
  const shouldShowMap = !showHomeOptions;
  const shouldShowRoomPanel = isRoomMap && showRoomList;

  const hasAnyHomeFilter =
    selectedRegions.length > 0 ||
    selectedRoomTypes.length > 0 ||
    selectedTradeTypes.length > 0 ||
    selectedApprovalDate !== null ||
    selectedRooms.length > 0 ||
    isBudgetTouched ||
    isRoomSizeTouched;

  const displayRooms =
    selectedClusterRooms.length > 0 ? selectedClusterRooms : filteredRooms;

  const roomPanelTitle = selectedClusterName
    ? selectedClusterName
    : hasAnyHomeFilter
      ? "조건에 맞는 매물"
      : "전체 매물";

  const [favoriteRooms, setFavoriteRooms] = useState<Room[]>([]);

  const initializeMap = () => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      if (!container) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 8,
      });

      mapRef.current = map;

      // 지도 DOM 렌더링이 끝난 뒤 Kakao Map 크기 재계산
      setTimeout(() => {
        map.relayout();
        map.setCenter(new window.kakao.maps.LatLng(37.5665, 126.978));
      }, 300);
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
    setSelectedRegions([]);
    setSelectedRoomTypes([]);
    setSelectedTradeTypes([]);
    setSelectedApprovalDate(null);
    setSelectedRooms([]);
    setShowRoomList(false);
    setShowHomeFilters(false);

    setDeposit(7000);
    setRent(70);
    setRoomSize(10);

    setConfirmedDeposit(7000);
    setConfirmedRent(70);
    setConfirmedRoomSize(10);

    setIsBudgetTouched(false);
    setIsRoomSizeTouched(false);

    setOpenFilterMenu(null);

    setSelectedClusterRooms([]);
    setSelectedClusterName(null);
  };


  useEffect(() => {
    if (homeMode !== "condition") return;

    const timer = setTimeout(() => {
      // 조건이 바뀌면 이전에 클릭했던 지역/클러스터 선택은 초기화
      setSelectedClusterRooms([]);
      setSelectedClusterName(null);

      showRoomClusters({
        regions: selectedRegions,
        roomTypes: selectedRoomTypes,
        tradeTypes: selectedTradeTypes,
        maxDeposit: isBudgetTouched ? confirmedDeposit : null,
        maxRent: isBudgetTouched ? confirmedRent : null,
        minRoomSize: isRoomSizeTouched ? confirmedRoomSize : null,
        rooms: selectedRooms,
        approvalDate: selectedApprovalDate,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    homeMode,
    selectedRegions,
    selectedRoomTypes,
    selectedTradeTypes,
    confirmedDeposit,
    confirmedRent,
    confirmedRoomSize,
    selectedRooms,
    selectedApprovalDate,
    isBudgetTouched,
    isRoomSizeTouched,
  ]);

  // 관심 매물 추가
  const addFavoriteRoom = (room: Room) => {
    const roomId = String((room as any).id ?? (room as any).room_id);

    setFavoriteRooms((prev) => {
      const alreadyExists = prev.some(
        (item) => String((item as any).id ?? (item as any).room_id) === roomId
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, room];
    });
  };

  // 관심 매물 제거
  const removeFavoriteRoom = (room: Room) => {
    const roomId = String((room as any).id ?? (room as any).room_id);

    setFavoriteRooms((prev) =>
      prev.filter(
        (item) => String((item as any).id ?? (item as any).room_id) !== roomId
      )
    );
  };

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`} 
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
              resetHomeFilters();

              setHomeMode(null);
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
          resetHomeFilters={resetHomeFilters}
        />
      )}

      {homeMode && (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold">
                {HOME_MODE_TEXT[homeMode].title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {HOME_MODE_TEXT[homeMode].description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearRoomClusters();
                resetHomeFilters();

                setHomeMode(null);
                setShowHomeOptions(true);
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
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
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
              isBudgetTouched={isBudgetTouched}
              setIsBudgetTouched={setIsBudgetTouched}
              isRoomSizeTouched={isRoomSizeTouched}
              setIsRoomSizeTouched={setIsRoomSizeTouched}
            />
          )}
        </div>
      )}

      <div
        className={
          shouldShowMap
            ? "relative mt-8 h-[418px] overflow-hidden rounded-2xl border"
            : "hidden"
        }
      >
        <div id="map" className="h-full w-full bg-gray-200" />

        {/* 매물 정보 패널이 펼쳐진 상태 */}
        {isRoomMap && showRoomList && (
          <div className="absolute left-0 top-0 z-10 h-full w-[380px] border-r bg-white shadow-lg">
            
            <RoomListPanel
              title={roomPanelTitle}
              visibleRooms={displayRooms}
              loadingRoomId={loadingRoomId}
              roomSummaries={roomSummaries}
              getRoomSummary={getRoomSummary}
              favoriteRooms={favoriteRooms}
              addFavoriteRoom={addFavoriteRoom}
              removeFavoriteRoom={removeFavoriteRoom}
            />

            <button
              type="button"
              onClick={() => {
                setShowRoomList(false);
              }}
              className="absolute -right-3 top-1/2 flex h-10 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="매물 정보 접기"
            >
              {"<"}
            </button>
          </div>
        )}

        {/* 매물 정보 패널이 접힌 상태 */}
        {isRoomMap && !showRoomList && (
          <button
            type="button"
            onClick={() => {
              setShowRoomList(true);
            }}
            className="absolute left-0 top-1/2 z-10 flex h-12 w-7 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-gray-200 bg-white text-xs font-bold text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="매물 정보 펼치기"
          >
            {">"}
          </button>
        )}
      </div>
    </>
  );
}