"use client";

import {
    Dispatch,
    MutableRefObject,
    RefObject,
    SetStateAction,
    useState,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { FilterMenu, HomeMode, Place } from "@/types/map";

import { HOME_MODE_TEXT } from "@/constants/homeMode";
import CompanyCard from "./CompanyCard";
import CompanySearchPanel from "./CompanySearchPanel";
import CommuteRouteCard from "./CommuteRouteCard";
import HomeCard from "./HomeCard";
import HomeFilterPanel from "./HomeFilterPanel";
import HomeSearchModePanel from "./HomeSearchModePanel";

type LocationSearchPanelProps = {
    isHomeSearchPanelOpen: boolean;
    setIsHomeSearchPanelOpen: Dispatch<SetStateAction<boolean>>;
    isMapVisible: boolean;

    selectedCompany: Place | null;

    showCompanySearch: boolean;
    setShowCompanySearch: Dispatch<SetStateAction<boolean>>;

    keyword: string;
    setKeyword: Dispatch<SetStateAction<string>>;
    places: Place[];
    setPlaces: Dispatch<SetStateAction<Place[]>>;
    hasSearched: boolean;
    setHasSearched: Dispatch<SetStateAction<boolean>>;
    isSearching: boolean;
    searchFailed: boolean;
    searchPlace: () => void;

    showLocationOption: boolean;
    setShowLocationOption: Dispatch<SetStateAction<boolean>>;

    showHomeOption: boolean;
    setShowHomeOption: Dispatch<SetStateAction<boolean>>;

    showHomeFilters: boolean;
    setShowHomeFilters: Dispatch<SetStateAction<boolean>>;

    homeMode: HomeMode;
    setHomeMode: Dispatch<SetStateAction<HomeMode>>;

    openFilterMenu: FilterMenu;
    toggleFilter: (menu: FilterMenu) => void;
    setOpenFilterMenu: Dispatch<SetStateAction<FilterMenu>>;

    showRoomList: boolean;
    setShowRoomList: Dispatch<SetStateAction<boolean>>;
    setIsEditingCompany: Dispatch<SetStateAction<boolean>>;

    inputRef: RefObject<HTMLInputElement | null>;
    clearRoomClusters: () => void;
    confirmCompany: (place: Place) => void;
    previousCompanyRef: MutableRefObject<Place | null>;

    resetHomeFilters: () => void;

    selectedRegions: string[];
    setSelectedRegions: Dispatch<SetStateAction<string[]>>;

    selectedRoomTypes: string[];
    setSelectedRoomTypes: Dispatch<SetStateAction<string[]>>;

    selectedTradeTypes: string[];
    setSelectedTradeTypes: Dispatch<SetStateAction<string[]>>;

    selectedApprovalDate: string | null;
    setSelectedApprovalDate: Dispatch<SetStateAction<string | null>>;

    selectedRooms: string[];
    setSelectedRooms: Dispatch<SetStateAction<string[]>>;

    monthlyDeposit: number;
    setMonthlyDeposit: Dispatch<SetStateAction<number>>;
    confirmedMonthlyDeposit: number;
    setConfirmedMonthlyDeposit: Dispatch<SetStateAction<number>>;

    monthlyRent: number;
    setMonthlyRent: Dispatch<SetStateAction<number>>;
    confirmedMonthlyRent: number;
    setConfirmedMonthlyRent: Dispatch<SetStateAction<number>>;

    leaseDeposit: number;
    setLeaseDeposit: Dispatch<SetStateAction<number>>;
    confirmedLeaseDeposit: number;
    setConfirmedLeaseDeposit: Dispatch<SetStateAction<number>>;

    salePrice: number;
    setSalePrice: Dispatch<SetStateAction<number>>;
    confirmedSalePrice: number;
    setConfirmedSalePrice: Dispatch<SetStateAction<number>>;

    roomSize: number;
    setRoomSize: Dispatch<SetStateAction<number>>;
    confirmedRoomSize: number;
    setConfirmedRoomSize: Dispatch<SetStateAction<number>>;

    isBudgetTouched: boolean;
    setIsBudgetTouched: Dispatch<SetStateAction<boolean>>;

    isRoomSizeTouched: boolean;
    setIsRoomSizeTouched: Dispatch<SetStateAction<boolean>>;

    compareReport: string;
};

export default function LocationSearchPanel({
    isHomeSearchPanelOpen,
    isMapVisible,
    selectedCompany,

    showCompanySearch,
    setShowCompanySearch,

    keyword,
    setKeyword,
    places,
    setPlaces,
    hasSearched,
    setHasSearched,
    isSearching,
    searchFailed,
    searchPlace,

    showLocationOption,
    setShowLocationOption,

    showHomeOption,
    setShowHomeOption,

    setShowHomeFilters,

    homeMode,
    setHomeMode,

    openFilterMenu,
    toggleFilter,
    setOpenFilterMenu,

    showRoomList,
    setShowRoomList,
    setIsEditingCompany,

    inputRef,
    clearRoomClusters,
    confirmCompany,
    previousCompanyRef,

    resetHomeFilters,

    selectedRegions,
    setSelectedRegions,

    selectedRoomTypes,
    setSelectedRoomTypes,

    selectedTradeTypes,
    setSelectedTradeTypes,

    selectedApprovalDate,
    setSelectedApprovalDate,

    selectedRooms,
    setSelectedRooms,

    monthlyDeposit,
    setMonthlyDeposit,
    confirmedMonthlyDeposit,
    setConfirmedMonthlyDeposit,

    monthlyRent,
    setMonthlyRent,
    confirmedMonthlyRent,
    setConfirmedMonthlyRent,

    leaseDeposit,
    setLeaseDeposit,
    confirmedLeaseDeposit,
    setConfirmedLeaseDeposit,

    salePrice,
    setSalePrice,
    confirmedSalePrice,
    setConfirmedSalePrice,

    roomSize,
    setRoomSize,
    confirmedRoomSize,
    setConfirmedRoomSize,

    isBudgetTouched,
    setIsBudgetTouched,

    isRoomSizeTouched,
    setIsRoomSizeTouched,

    compareReport,
}: LocationSearchPanelProps) {
    const [isHomeModeDetailOpen, setIsHomeModeDetailOpen] = useState(true);

    const resetCompanySearchState = () => {
        setPlaces([]);
        setKeyword("");
        setHasSearched(false);
    };

    const closeCompanySearch = () => {
        setShowCompanySearch(false);
        setIsEditingCompany(false);
        resetCompanySearchState();

        if (selectedCompany) {
            confirmCompany(selectedCompany);
        }
    };

    const openCompanySearch = () => {
        if (selectedCompany) {
            previousCompanyRef.current = selectedCompany;
        }

        clearRoomClusters();

        // 집 관련 패널 닫기
        setShowHomeOption(false);
        setShowHomeFilters(false);
        setHomeMode(null);
        setShowRoomList(false);
        setOpenFilterMenu(null);

        // 회사 검색 패널 열기
        setShowLocationOption(true);
        setShowCompanySearch(true);
        setIsEditingCompany(true);
        resetCompanySearchState();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleClickCompany = () => {
        if (showCompanySearch) {
            closeCompanySearch();
            return;
        }

        openCompanySearch();
    };

    const closeHomeOption = () => {
        setShowHomeOption(false);
    };

    const openHomeOption = () => {
        clearRoomClusters();
        resetHomeFilters();

        // 회사 검색 패널 닫기
        setShowCompanySearch(false);
        setIsEditingCompany(false);
        resetCompanySearchState();

        // 집 탐색 패널 열기
        setHomeMode(null);
        setShowLocationOption(true);
        setShowHomeOption(true);
        setShowHomeFilters(false);
        setShowRoomList(false);
        setOpenFilterMenu(null);
        setIsHomeModeDetailOpen(true);
    };

    const handleClickHome = () => {
        if (showHomeOption) {
            closeHomeOption();
            return;
        }

        openHomeOption();
    };

    const handleSelectHomeMode = (mode: Exclude<HomeMode, null>) => {
        setHomeMode(mode);
        setIsHomeModeDetailOpen(true);
        setShowLocationOption(true);
        setShowHomeOption(false);
        setOpenFilterMenu(null);

        if (mode === "condition") {
            setShowHomeFilters(true);
            setShowRoomList(true);
            return;
        }

        if (mode === "favoriteCompare") {
            setShowHomeFilters(false);
            setShowRoomList(true);
            return;
        }

        setShowHomeFilters(false);
        setShowRoomList(false);
    };

    const handleCloseCompanySearch = () => {
        closeCompanySearch();
    };

    const handleCloseHomeOption = () => {
        closeHomeOption();
    };

    const toggleHomeModeDetail = () => {
        setIsHomeModeDetailOpen((prev) => {
            const next = !prev;

            if (!next) {
                setOpenFilterMenu(null);
            }

            return next;
        });
    };

    const isConditionMode = homeMode === "condition";

    const panelPositionClass = isMapVisible
        ? `absolute right-0 top-full z-40 mt-3 space-y-3 ${showRoomList ? "left-[460px]" : "left-0"}`
        : "mt-3 space-y-3";

    const homeModePanelClass =
        isConditionMode && isMapVisible
            ? `overflow-hidden border border-gray-200 bg-white shadow-sm ${showRoomList
                ? "rounded-r-2xl rounded-l-none border-l-0 px-4 py-3"
                : "rounded-2xl px-4 py-3"
            }`
            : "rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm";

    return (
        <section className="relative space-y-3">
            {showLocationOption && (
                <div className="grid min-h-[88px] grid-cols-[minmax(0,0.5fr)_360px_minmax(0,0.5fr)] items-stretch gap-3">
                    <div className="min-w-0">
                        <CompanyCard
                            selectedCompany={selectedCompany}
                            showCompanySearch={showCompanySearch}
                            onClick={handleClickCompany}
                        />
                    </div>

                    <CommuteRouteCard
                        selectedCompany={selectedCompany}
                        homeMode={homeMode}
                        commuteTime="28분"
                        commuteDistance="12.4km"
                    />

                    <div className="min-w-0">
                        <HomeCard
                            onClick={handleClickHome}
                            homeMode={homeMode}
                            showHomeOption={showHomeOption}
                        />
                    </div>
                </div>
            )}

            {isHomeSearchPanelOpen && (showCompanySearch || showHomeOption || homeMode) && (
                <div className={panelPositionClass}>
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
                            confirmCompany={confirmCompany}
                            onClose={handleCloseCompanySearch}
                        />
                    )}

                    {showHomeOption && (
                        <HomeSearchModePanel
                            onSelectMode={handleSelectHomeMode}
                            onClose={handleCloseHomeOption}
                        />
                    )}

                    {homeMode && (
                        <div className={homeModePanelClass}>
                            {homeMode !== "condition" && (
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-base font-extrabold text-gray-900">
                                            {HOME_MODE_TEXT[homeMode].title}
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-gray-500">
                                            {HOME_MODE_TEXT[homeMode].description}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={toggleHomeModeDetail}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                        aria-label={`${HOME_MODE_TEXT[homeMode].title} 세부 옵션 ${isHomeModeDetailOpen ? "접기" : "열기"}`}
                                        aria-expanded={isHomeModeDetailOpen}
                                    >
                                        {isHomeModeDetailOpen ? (
                                            <ChevronUp size={18} strokeWidth={2.4} />
                                        ) : (
                                            <ChevronDown size={18} strokeWidth={2.4} />
                                        )}
                                    </button>
                                </div>
                            )}

                            {homeMode === "condition" && (
                                <div>
                                    <HomeFilterPanel
                                        isCollapsed={!isHomeModeDetailOpen}
                                        isAttachedToRoomList={isMapVisible && showRoomList}
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
                                    />
                                </div>
                            )}

                            {homeMode === "favoriteCompare" && isHomeModeDetailOpen && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                    <h3 className="text-base font-bold text-gray-900">
                                        관심 매물 비교 리포트
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        왼쪽 관심 매물 패널에서 비교할 매물을 선택하면 분석 리포트를 확인할 수 있어요.
                                    </p>

                                    {compareReport ? (
                                        <div className="mt-4 max-h-65 overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                                            {compareReport}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                            아직 생성된 분석 리포트가 없습니다.
                                            <br />
                                            관심 매물 2개 이상을 선택하고 리포트를 생성하면 이 영역에 표시됩니다.
                                        </div>
                                    )}
                                </div>
                            )}

                            {homeMode === "localReview" && isHomeModeDetailOpen && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                    <h3 className="text-base font-bold text-gray-900">
                                        지역권 거주자 후기
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        지역권 생활과 출퇴근 후기를 확인할 수 있습니다.
                                    </p>

                                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                        지역권 거주자 후기 기능은 추후 연결 예정입니다.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
