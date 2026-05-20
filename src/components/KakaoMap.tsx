"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import type {
  KakaoInfoWindow,
  KakaoMap as KakaoMapInstance,
  KakaoMapEntity,
  Place,
  Room,
  FilterMenu,
  HomeMode,
} from "@/types/map";
import RoomListPanel from "@/components/RoomListPanel";
import { useKakaoRoomCluster } from "@/hooks/useKakaoRoomCluster";
import { useRoomSummary } from "@/hooks/useRoomSummary";
import { useRoomsCache } from "@/hooks/useRoomsCache";
import { useFavoriteRooms } from "@/hooks/useFavoriteRooms";
import LocationSearchPanel from "@/components/LocationSearchPanel";

export default function KakaoMap() {
  /**
   * 지도와 외부 DOM 참조
   */
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const markerRef = useRef<KakaoMapEntity | null>(null);
  const infoWindowRef = useRef<KakaoInfoWindow | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousCompanyRef = useRef<Place | null>(null);

  /**
   * 매물 데이터 캐시
   */
  const { loadRoomsOnce } = useRoomsCache();

  /**
   * 관심 매물 관리
   */
  const {
    favoriteRooms,
    addFavoriteRoom,
    removeFavoriteRoom,
    getRoomId,
  } = useFavoriteRooms();

  /**
   * 회사 위치 검색 상태
   */
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [kakaoMapLoadFailed, setKakaoMapLoadFailed] = useState(false);

  /**
   * 회사 위치 선택 상태
   */
  const [selectedCompany, setSelectedCompany] = useState<Place | null>(null);
  const [confirmedCompany, setConfirmedCompany] = useState<Place | null>(null);

  /**
   * 집 찾기 패널 상태
   */
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [, setIsEditingCompany] = useState(false);

  const [isHomeSearchPanelOpen, setIsHomeSearchPanelOpen] = useState(true);
  const [showLocationOption, setShowLocationOption] = useState(true);
  const [showHomeOption, setShowHomeOption] = useState(false);
  const [homeMode, setHomeMode] = useState<HomeMode>(null);
  const [showHomeFilters, setShowHomeFilters] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState<FilterMenu>(null);

  /**
   * 조건 필터 입력값
   */
  const [monthlyDeposit, setMonthlyDeposit] = useState(7000);
  const [monthlyRent, setMonthlyRent] = useState(70);
  const [leaseDeposit, setLeaseDeposit] = useState(7000);
  const [salePrice, setSalePrice] = useState(500000);
  const [roomSize, setRoomSize] = useState(10);

  /**
   * 조건 필터 확정값
   */
  const [confirmedMonthlyDeposit, setConfirmedMonthlyDeposit] = useState(7000);
  const [confirmedMonthlyRent, setConfirmedMonthlyRent] = useState(70);
  const [confirmedLeaseDeposit, setConfirmedLeaseDeposit] = useState(7000);
  const [confirmedSalePrice, setConfirmedSalePrice] = useState(500000);
  const [confirmedRoomSize, setConfirmedRoomSize] = useState(10);

  /**
   * 조건 필터 선택 상태
   */
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedTradeTypes, setSelectedTradeTypes] = useState<string[]>([]);
  const [selectedApprovalDate, setSelectedApprovalDate] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  /**
   * 조건 필터 사용 여부
   */
  const [isBudgetTouched, setIsBudgetTouched] = useState(false);
  const [isRoomSizeTouched, setIsRoomSizeTouched] = useState(false);

  /**
   * 매물 목록과 클러스터 상태
   */
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedClusterRooms, setSelectedClusterRooms] = useState<Room[]>([]);
  const [, setSelectedClusterName] = useState<string | null>(null);
  const [showRoomList, setShowRoomList] = useState(false);

  /**
   * 관심 매물 비교 상태
   */
  const [selectedCompareRoomIds, setSelectedCompareRoomIds] = useState<string[]>([]);
  const [compareReport, setCompareReport] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  /**
   * 매물 요약
   */
  const {
    roomSummaries,
    loadingRoomId,
    getRoomSummary,
    getSummaryKey,
  } = useRoomSummary(confirmedCompany);

  /**
   * 카카오맵 매물 클러스터
   */
  const {
    clearRoomClusters,
    showRoomClusters,
    showFavoriteRoomClusters,
  } = useKakaoRoomCluster({
    mapRef,
    setFilteredRooms,
    setSelectedClusterRooms,
    setSelectedClusterName,
    setShowRoomList,
  });

  /**
   * 화면 표시용 값
   */
  const isRoomMap = homeMode === "condition" || homeMode === "favoriteCompare";
  const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const shouldShowKakaoMapError = kakaoMapLoadFailed || !kakaoMapKey;

  const visibleRooms =
    selectedClusterRooms.length > 0 ? selectedClusterRooms : filteredRooms;

  const favoriteVisibleRooms =
    selectedClusterRooms.length > 0 ? selectedClusterRooms : favoriteRooms;

  const panelRooms =
    homeMode === "favoriteCompare" ? favoriteVisibleRooms : visibleRooms;

  const panelTitle =
    homeMode === "favoriteCompare"
      ? "관심 매물"
      : selectedRegions.length > 0
        ? `선택 지역 ${selectedRegions.length}곳`
        : "전체 매물";

  const [isSearchInMapArea, setIsSearchInMapArea] = useState(true);

  /**
   * 지도 초기화
   */
  const initializeMap = () => {
    if (!window.kakao?.maps) {
      setKakaoMapLoadFailed(true);
      return;
    }

    window.kakao.maps.load(() => {
      try {
        const container = document.getElementById("map");
        if (!container) {
          setKakaoMapLoadFailed(true);
          return;
        }

        const kakaoMaps = window.kakao?.maps;
        if (!kakaoMaps) {
          setKakaoMapLoadFailed(true);
          return;
        }

        const map = new kakaoMaps.Map(container, {
          center: new kakaoMaps.LatLng(37.5665, 126.978),
          level: 8,
        });

        mapRef.current = map;
        setKakaoMapLoadFailed(false);

        setTimeout(() => {
          map.relayout();
          map.setCenter(new kakaoMaps.LatLng(37.5665, 126.978));
        }, 300);
      } catch (error) {
        console.error("Kakao 지도 초기화 실패:", error);
        setKakaoMapLoadFailed(true);
      }
    });
  };

  /**
   * 회사 위치 검색
   */
  const searchPlace = () => {
    clearRoomClusters();

    if (!keyword.trim()) return;

    setHasSearched(true);
    setIsSearching(true);
    setSearchFailed(false);

    const kakaoMaps = window.kakao?.maps;

    if (!kakaoMaps?.services) {
      setIsSearching(false);
      setPlaces([]);
      setSearchFailed(true);
      setKakaoMapLoadFailed(true);
      return;
    }

    try {
      const ps = new kakaoMaps.services.Places();

      ps.keywordSearch(keyword, (data: Place[], status: string) => {
        setIsSearching(false);

        if (status !== kakaoMaps.services.Status.OK) {
          setPlaces([]);
          setSearchFailed(true);
          return;
        }

        setPlaces(data);
        setSearchFailed(data.length === 0);
      });
    } catch (error) {
      console.error("Kakao 장소 검색 실패:", error);
      setIsSearching(false);
      setPlaces([]);
      setSearchFailed(true);
    }
  };

  /**
   * 회사 위치 확정
   */
  const confirmCompany = (place: Place) => {
    setSelectedCompany(place);
    setConfirmedCompany(place);

    if (!mapRef.current || !window.kakao?.maps) return;

    setHasSearched(true);

    const kakaoMaps = window.kakao.maps;
    const position = new kakaoMaps.LatLng(place.y, place.x);

    if (markerRef.current) markerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();

    const marker = new kakaoMaps.Marker({
      position,
      map: mapRef.current,
    });

    const infoWindow = new kakaoMaps.InfoWindow({
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

  /**
   * 조건 필터 메뉴
   */
  const toggleFilter = (menu: FilterMenu) => {
    setOpenFilterMenu((prev) => (prev === menu ? null : menu));
  };

  /**
   * 집 탐색 조건 초기화
   */
  const resetHomeFilters = () => {
    setSelectedRegions([]);
    setSelectedRoomTypes([]);
    setSelectedTradeTypes([]);
    setSelectedApprovalDate(null);
    setSelectedRooms([]);

    setMonthlyDeposit(7000);
    setMonthlyRent(70);
    setLeaseDeposit(7000);
    setSalePrice(500000);
    setRoomSize(10);

    setConfirmedMonthlyDeposit(7000);
    setConfirmedMonthlyRent(70);
    setConfirmedLeaseDeposit(7000);
    setConfirmedSalePrice(500000);
    setConfirmedRoomSize(10);

    setIsBudgetTouched(false);
    setIsRoomSizeTouched(false);

    setOpenFilterMenu(null);
    setSelectedClusterRooms([]);

    setShowRoomList(false);
    setShowHomeFilters(false);
  };

  /**
   * 조건 변경 시 매물 클러스터 갱신
   */
  useEffect(() => {
    if (homeMode !== "condition") return;

    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        const rooms = await loadRoomsOnce();

        if (isCancelled) return;

        setSelectedClusterRooms([]);
        setSelectedClusterName(null);

        showRoomClusters({
          sourceRooms: rooms,
          regions: selectedRegions,
          roomTypes: selectedRoomTypes,
          tradeTypes: selectedTradeTypes,
          maxMonthlyDeposit: isBudgetTouched ? confirmedMonthlyDeposit : null,
          maxMonthlyRent: isBudgetTouched ? confirmedMonthlyRent : null,
          maxLeaseDeposit: isBudgetTouched ? confirmedLeaseDeposit : null,
          maxSalePrice: isBudgetTouched ? confirmedSalePrice : null,
          minRoomSize: isRoomSizeTouched ? confirmedRoomSize : null,
          rooms: selectedRooms,
          approvalDate: selectedApprovalDate,
        });
      } catch (error) {
        console.error("매물 클러스터를 갱신하지 못했습니다.", error);
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
    // showRoomClusters is intentionally omitted to avoid recreating clusters on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    homeMode,
    selectedRegions,
    selectedRoomTypes,
    selectedTradeTypes,
    selectedApprovalDate,
    selectedRooms,
    confirmedMonthlyDeposit,
    confirmedMonthlyRent,
    confirmedLeaseDeposit,
    confirmedSalePrice,
    confirmedRoomSize,
    isBudgetTouched,
    isRoomSizeTouched,
    loadRoomsOnce,
  ]);

  /**
   * 관심 매물 비교 모드 클러스터 갱신
   */
  useEffect(() => {
    if (homeMode !== "favoriteCompare") return;

    const timer = setTimeout(() => {
      setSelectedClusterRooms([]);
      setSelectedClusterName(null);

      showFavoriteRoomClusters(favoriteRooms);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    homeMode,
    favoriteRooms,
    showFavoriteRoomClusters,
  ]);

  /**
   * 관심 매물 제거
   */
  const handleRemoveFavoriteRoom = (room: Room) => {
    const roomId = getRoomId(room);

    removeFavoriteRoom(room);

    setSelectedCompareRoomIds((prev) =>
      prev.filter((id) => id !== roomId)
    );
  };

  /**
   * 관심 매물 비교 선택
   */
  const toggleCompareRoom = (room: Room) => {
    const roomId = getRoomId(room);

    setSelectedCompareRoomIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  /**
   * 관심 매물 비교 리포트 생성
   */
  const generateCompareReport = async () => {
    const selectedRooms = favoriteRooms.filter((room) =>
      selectedCompareRoomIds.includes(getRoomId(room))
    );

    if (selectedRooms.length < 2) {
      alert("비교할 매물을 2개 이상 선택해 주세요.");
      return;
    }

    setIsGeneratingReport(true);
    setCompareReport("");

    try {
      const res = await fetch("/api/ai/compare-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rooms: selectedRooms,
          company: confirmedCompany,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "분석 리포트 생성 실패");
      }

      setCompareReport(data.report ?? "");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "분석 리포트 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <>
      {kakaoMapKey && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services,clusterer`}
          strategy="afterInteractive"
          onLoad={initializeMap}
          onError={() => setKakaoMapLoadFailed(true)}
        />
      )}

      {/* 회사/집 위치 설정 */}
      <LocationSearchPanel
        isHomeSearchPanelOpen={isHomeSearchPanelOpen}
        setIsHomeSearchPanelOpen={setIsHomeSearchPanelOpen}
        selectedCompany={selectedCompany}
        showCompanySearch={showCompanySearch}
        setShowCompanySearch={setShowCompanySearch}
        keyword={keyword}
        setKeyword={setKeyword}
        places={places}
        setPlaces={setPlaces}
        hasSearched={hasSearched}
        setHasSearched={setHasSearched}
        isSearching={isSearching}
        searchFailed={searchFailed}
        searchPlace={searchPlace}
        showLocationOption={showLocationOption}
        setShowLocationOption={setShowLocationOption}
        showHomeOption={showHomeOption}
        setShowHomeOption={setShowHomeOption}
        showHomeFilters={showHomeFilters}
        setShowHomeFilters={setShowHomeFilters}
        homeMode={homeMode}
        setHomeMode={setHomeMode}
        openFilterMenu={openFilterMenu}
        toggleFilter={toggleFilter}
        setOpenFilterMenu={setOpenFilterMenu}
        setShowRoomList={setShowRoomList}
        setIsEditingCompany={setIsEditingCompany}
        inputRef={inputRef}
        clearRoomClusters={clearRoomClusters}
        confirmCompany={confirmCompany}
        previousCompanyRef={previousCompanyRef}
        resetHomeFilters={resetHomeFilters}
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
        monthlyDeposit={monthlyDeposit}
        setMonthlyDeposit={setMonthlyDeposit}
        confirmedMonthlyDeposit={confirmedMonthlyDeposit}
        setConfirmedMonthlyDeposit={setConfirmedMonthlyDeposit}
        monthlyRent={monthlyRent}
        setMonthlyRent={setMonthlyRent}
        confirmedMonthlyRent={confirmedMonthlyRent}
        setConfirmedMonthlyRent={setConfirmedMonthlyRent}
        leaseDeposit={leaseDeposit}
        setLeaseDeposit={setLeaseDeposit}
        confirmedLeaseDeposit={confirmedLeaseDeposit}
        setConfirmedLeaseDeposit={setConfirmedLeaseDeposit}
        salePrice={salePrice}
        setSalePrice={setSalePrice}
        confirmedSalePrice={confirmedSalePrice}
        setConfirmedSalePrice={setConfirmedSalePrice}
        roomSize={roomSize}
        setRoomSize={setRoomSize}
        confirmedRoomSize={confirmedRoomSize}
        setConfirmedRoomSize={setConfirmedRoomSize}
        isBudgetTouched={isBudgetTouched}
        setIsBudgetTouched={setIsBudgetTouched}
        isRoomSizeTouched={isRoomSizeTouched}
        setIsRoomSizeTouched={setIsRoomSizeTouched}
        compareReport={compareReport}
      />


      {/* 지도 */}
      <div
        className={`relative mt-5 ${isHomeSearchPanelOpen ? "h-[560px]" : "h-[620px]"
          } overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm`}
      >
        <div id="map" className="h-full w-full bg-gray-200" />

        {shouldShowKakaoMapError && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 px-6 text-center">
            <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-base font-extrabold text-gray-900">
                Kakao 지도를 불러오지 못했습니다.
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Kakao JavaScript 키와 현재 접속 주소가 Kakao Developers의
                JavaScript 플랫폼 도메인에 등록되어 있는지 확인해주세요.
              </p>
            </div>
          </div>
        )}

        {/* 지도 영역 내 재검색 버튼 */}

        {isRoomMap && (
          <button
            type="button"
            onClick={() => setIsSearchInMapArea((prev) => !prev)}
            className={`absolute top-4 z-20 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 shadow-md transition hover:bg-gray-50 ${showRoomList ? "left-[476px]" : "left-4"
              }`}
          >
            <input
              type="checkbox"
              checked={isSearchInMapArea}
              onChange={(e) => setIsSearchInMapArea(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 accent-slate-950"
            />
            지도 영역 내 재검색
          </button>
        )}

        {/* 매물 정보 패널 */}
        {isRoomMap && showRoomList && (
          <div className="absolute left-0 top-0 z-10 h-full w-[460px] border-r bg-white shadow-lg">
            <RoomListPanel
              homeMode={homeMode}
              title={panelTitle}
              visibleRooms={panelRooms}
              loadingRoomId={loadingRoomId}
              roomSummaries={roomSummaries}
              getRoomSummary={getRoomSummary}
              getSummaryKey={getSummaryKey}
              favoriteRooms={favoriteRooms}
              addFavoriteRoom={addFavoriteRoom}
              removeFavoriteRoom={handleRemoveFavoriteRoom}
              selectedCompareRoomIds={selectedCompareRoomIds}
              toggleCompareRoom={toggleCompareRoom}
              generateCompareReport={generateCompareReport}
              isGeneratingReport={isGeneratingReport}
              compareReport={compareReport}
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

        {/* 매물 정보 펼치기 버튼 */}
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
