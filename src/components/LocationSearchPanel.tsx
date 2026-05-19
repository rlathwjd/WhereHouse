"use client";

import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { Place, FilterMenu, HomeMode } from "@/types/map";

import { HOME_MODE_TEXT } from "@/constants/homeMode";
import CompanyCard from "./CompanyCard";
import CompanySearchPanel from "./CompanySearchPanel";
import HomeCard from "./HomeCard";
import HomeSearchModePanel from "./HomeSearchModePanel";
import HomeFilterPanel from "./HomeFilterPanel";




type LocationSearchPanelProps = {
    isHomeSearchPanelOpen: boolean;
    setIsHomeSearchPanelOpen: Dispatch<SetStateAction<boolean>>;

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

    setShowRoomList: Dispatch<SetStateAction<boolean>>;
    setIsEditingCompany: Dispatch<SetStateAction<boolean>>;

    inputRef: RefObject<HTMLInputElement | null>;

    clearRoomClusters: () => void;
    confirmCompany: (place: Place) => void;
    previousCompanyRef: RefObject<Place | null>;
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
    setIsHomeSearchPanelOpen,

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

    const handleClickHome = () => {
        clearRoomClusters();
        resetHomeFilters();

        setHomeMode(null);
        setIsHomeModeDetailOpen(true);

        setShowLocationOption(true);
        setShowHomeOption((prev) => !prev);

        setShowHomeFilters(false);
        setShowRoomList(false);
        setOpenFilterMenu(null);
    };

    const handleSelectMode = (mode: Exclude<HomeMode, null>) => {
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

        if (mode === "localReview") {
            setShowHomeFilters(false);
            setShowRoomList(false);
        }
    };

    const handleOpenCompanySearch = () => {
        const next = !showCompanySearch;

        setShowCompanySearch(next);
        setShowLocationOption(true);

        if (!next) {
            setPlaces([]);
            setKeyword("");
            setHasSearched(false);
            setIsEditingCompany(false);
            return;
        }

        setPlaces([]);
        setKeyword("");
        setHasSearched(false);
        setIsEditingCompany(true);

        // 집 찾기 모드가 아직 시작되지 않은 경우에만 집 선택 옵션을 닫아도 됨
        if (!homeMode) {
            setShowHomeOption(false);
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCloseCompanySearch = () => {
        setShowCompanySearch(false);
        setPlaces([]);
        setKeyword("");
        setHasSearched(false);
        setIsEditingCompany(false);
    };

    const handleCloseHomeOption = () => {
        setShowHomeOption(false);
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

    return (
        <section className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex min-h-[40px] items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                    회사 위치를 설정하고 원하는 방식에 따라 매물을 찾아보세요
                </p>

                <button
                    type="button"
                    onClick={() => setIsHomeSearchPanelOpen((prev) => !prev)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100"
                    aria-label={
                        isHomeSearchPanelOpen
                            ? "위치 설정 패널 접기"
                            : "위치 설정 패널 펼치기"
                    }
                >
                    {isHomeSearchPanelOpen ? (
                        <ChevronUp size={17} />
                    ) : (
                        <ChevronDown size={17} />
                    )}
                </button>
            </div>

            {isHomeSearchPanelOpen && (
                <div className="mt-3 pb-2">
                    {showLocationOption && (
                        <div className="grid grid-cols-2 gap-4 pb-1">
                            <CompanyCard
                                selectedCompany={selectedCompany}
                                showCompanySearch={showCompanySearch}
                                setShowCompanySearch={setShowCompanySearch}
                                setShowLocationOption={setShowLocationOption}
                                setShowHomeOption={setShowHomeOption}
                                setShowHomeFilters={setShowHomeFilters}
                                setHomeMode={setHomeMode}
                                setOpenFilterMenu={setOpenFilterMenu}
                                setShowRoomList={setShowRoomList}
                                setPlaces={setPlaces}
                                setKeyword={setKeyword}
                                setHasSearched={setHasSearched}
                                setIsEditingCompany={setIsEditingCompany}
                                inputRef={inputRef}
                                clearRoomClusters={clearRoomClusters}
                                confirmCompany={confirmCompany}
                                previousCompanyRef={previousCompanyRef}
                                onOpenCompanySearch={handleOpenCompanySearch}
                            />

                            <HomeCard
                                onClick={handleClickHome}
                                homeMode={homeMode}
                                showHomeOption={showHomeOption}
                            />
                        </div>
                    )}

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
                            onSelectMode={handleSelectMode}
                            onClose={handleCloseHomeOption}
                        />
                    )}

                    {homeMode && (
                        <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
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
                                    aria-label={
                                        isHomeModeDetailOpen
                                            ? `${HOME_MODE_TEXT[homeMode].title} 세부 옵션 접기`
                                            : `${HOME_MODE_TEXT[homeMode].title} 세부 옵션 펼치기`
                                    }
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
                                <HomeFilterPanel
                                    isCollapsed={!isHomeModeDetailOpen}
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
                            )}

                            {homeMode === "favoriteCompare" && isHomeModeDetailOpen && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                    <h3 className="text-base font-bold text-gray-900">
                                        관심 매물 비교 리포트
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        왼쪽 관심 매물 패널에서 비교할 매물을 선택한 뒤 분석 리포트를 생성하세요.
                                    </p>

                                    {compareReport ? (
                                        <div className="mt-4 max-h-[260px] overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                                            {compareReport}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                            아직 생성된 분석 리포트가 없습니다.
                                            <br />
                                            관심 매물 2개 이상을 선택한 뒤 리포트를 생성하면 이 영역에 표시됩니다.
                                        </div>
                                    )}
                                </div>
                            )}

                            {homeMode === "localReview" && isHomeModeDetailOpen && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                    <h3 className="text-base font-bold text-gray-900">
                                        지역별 거주자/재직자 후기
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        지역별 생활·출퇴근 후기를 확인할 수 있습니다.
                                    </p>

                                    <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                        지역별 거주자/재직자 후기 기능은 추후 연결 예정입니다.
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
