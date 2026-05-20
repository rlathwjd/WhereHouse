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

import HomeIntroPanel from "@/components/HomeIntroPanel";
import LocationSearchPanel from "@/components/LocationSearchPanel";
import MapErrorPanel from "@/components/MapErrorPanel";
import RoomListPanel from "@/components/RoomListPanel";

import { useFavoriteRooms } from "@/hooks/useFavoriteRooms";
import { useKakaoRoomCluster } from "@/hooks/useKakaoRoomCluster";
import { useRoomSummary } from "@/hooks/useRoomSummary";
import { useRoomsCache } from "@/hooks/useRoomsCache";

type KakaoMapProps = {
  titleClassName?: string;
};

export default function KakaoMap({ titleClassName = "" }: KakaoMapProps) {
  /**
   * 지도 관련 DOM 참조
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
  const [isKakaoMapReady, setIsKakaoMapReady] = useState(false);
  const [kakaoMapLoadFailed, setKakaoMapLoadFailed] = useState(false);

  /**
   * 회사 위치 선택 상태
   */
  const [selectedCompany, setSelectedCompany] = useState<Place | null>(null);
  const [confirmedCompany, setConfirmedCompany] = useState<Place | null>(null);

  /**
   * 위치/집 찾기 패널 상태
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
   * 매물 목록 및 클러스터 상태
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
   * 매물 요약 상태
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
   * 화면 표시 조건
   */
  const isRoomMap = homeMode === "condition" || homeMode === "favoriteCompare";
  const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const shouldShowKakaoMapError = kakaoMapLoadFailed || !kakaoMapKey;
  const shouldShowMap = Boolean(confirmedCompany) || isRoomMap;

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
   * Kakao SDK 로드
   */
  const loadKakaoMapSdk = () => {
    if (!window.kakao?.maps) {
      setKakaoMapLoadFailed(true);
      return;
    }

    window.kakao.maps.load(() => {
      setIsKakaoMapReady(true);
      setKakaoMapLoadFailed(false);
    });
  };

  /**
   * 회사 위치 마커 표시
   */
  const renderCompanyMarker = (
    map: KakaoMapInstance,
    kakaoMaps: NonNullable<NonNullable<typeof window.kakao>["maps"]>,
    place: Place
  ) => {
    const position = new kakaoMaps.LatLng(place.y, place.x);

    map.relayout();
    map.setCenter(position);
    map.setLevel(4);

    if (markerRef.current) markerRef.current.setMap(null);
    if (infoWindowRef.current) infoWindowRef.current.close();

    const marker = new kakaoMaps.Marker({
      position,
      map,
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

    infoWindow.open(map, marker);

    markerRef.current = marker;
    infoWindowRef.current = infoWindow;
  };

  /**
   * 지도 초기화
   */
  const initializeMap = (place?: Place) => {
    try {
      const container = document.getElementById("map");
      if (!container) return;

      const kakaoMaps = window.kakao?.maps;
      if (!kakaoMaps) {
        setKakaoMapLoadFailed(true);
        return;
      }

      if (!mapRef.current) {
        const map = new kakaoMaps.Map(container, {
          center: place
            ? new kakaoMaps.LatLng(place.y, place.x)
            : new kakaoMaps.LatLng(37.5665, 126.978),
          level: place ? 4 : 8,
        });

        mapRef.current = map;
      }

      mapRef.current.relayout();

      if (place) {
        renderCompanyMarker(mapRef.current, kakaoMaps, place);
      }

      setKakaoMapLoadFailed(false);
    } catch (error) {
      console.error("Kakao 지도 초기화 실패:", error);
      setKakaoMapLoadFailed(true);
    }
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
    } catch {
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
    setHasSearched(true);

    setKeyword("");
    setPlaces([]);
    setShowCompanySearch(false);
    setIsEditingCompany(false);

    if (mapRef.current && window.kakao?.maps) {
      renderCompanyMarker(mapRef.current, window.kakao.maps, place);
    }
  };

  /**
   * 조건 필터 메뉴 토글
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

    // showRoomClusters는 렌더링마다 클러스터가 재생성되는 것을 막기 위해 의존성에서 제외합니다.
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
   * 지도 표시 조건이 충족되면 지도 초기화
   */
  useEffect(() => {
    if (!shouldShowMap || !isKakaoMapReady) return;

    const timer = setTimeout(() => {
      initializeMap(confirmedCompany ?? undefined);
    }, 0);

    return () => clearTimeout(timer);

    // initializeMap은 지도 ref와 마커 헬퍼를 함께 사용하므로 별도 의존성으로 분리하지 않습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedCompany, isKakaoMapReady, shouldShowMap]);

  /**
   * 상단 패널 높이가 바뀌면 지도 영역 크기 재계산
   */
  useEffect(() => {
    if (!shouldShowMap) return;

    const timer = setTimeout(() => {
      mapRef.current?.relayout();
    }, 120);

    return () => clearTimeout(timer);
  }, [
    isHomeSearchPanelOpen,
    showCompanySearch,
    showHomeOption,
    homeMode,
    openFilterMenu,
    confirmedCompany,
    shouldShowMap,
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
   * 관심 매물 비교 선택 토글
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
    <div className="flex h-full min-h-0 flex-col">
      {kakaoMapKey && (
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services,clusterer`}
          strategy="afterInteractive"
          onLoad={loadKakaoMapSdk}
          onError={() => setKakaoMapLoadFailed(true)}
        />
      )}

      <div className="space-y-6">
        <div className="w-full pb-4 lg:pb-0 lg:pt-1">
          <h1
            onClick={() => window.location.reload()}
            className={`${titleClassName} cursor-pointer text-4xl font-bold tracking-tight`}
          >
            WhereHouse
          </h1>

          <p className="mt-2 ml-0.5 text-base font-semibold text-gray-600">
            사회초년생을 위한 생활권 기반 자취방 탐색 서비스
          </p>
        </div>

        <div className="min-w-0 flex-1">
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
        </div>
      </div>

      {/* 지도/홈 화면 영역 */}
      <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm">
        {shouldShowMap ? (
          <div id="map" className="h-full w-full bg-gray-200" />
        ) : (
          <HomeIntroPanel />
        )}

        {shouldShowMap && shouldShowKakaoMapError && <MapErrorPanel />}

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

            {/* 매물 정보 패널 접기 버튼 */}
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

        {/* 매물 정보 패널 열기 버튼 */}
        {isRoomMap && !showRoomList && (
          <button
            type="button"
            onClick={() => {
              setShowRoomList(true);
            }}
            className="absolute left-0 top-1/2 z-10 flex h-12 w-7 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-gray-200 bg-white text-xs font-bold text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="매물 정보 열기"
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
}