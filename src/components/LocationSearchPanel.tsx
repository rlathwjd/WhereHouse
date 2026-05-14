"use client";

import { Dispatch, RefObject, SetStateAction } from "react";
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
    previewCompanyOnMap: (place: Place) => void;

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

    deposit: number;
    setDeposit: Dispatch<SetStateAction<number>>;
    confirmedDeposit: number;
    setConfirmedDeposit: Dispatch<SetStateAction<number>>;

    rent: number;
    setRent: Dispatch<SetStateAction<number>>;
    confirmedRent: number;
    setConfirmedRent: Dispatch<SetStateAction<number>>;

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
    previewCompanyOnMap,

    showLocationOption,
    setShowLocationOption,

    showHomeOption,
    setShowHomeOption,

    showHomeFilters,
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

    deposit,
    setDeposit,
    confirmedDeposit,
    setConfirmedDeposit,

    rent,
    setRent,
    confirmedRent,
    setConfirmedRent,

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
    const handleClickHome = () => {
        setShowCompanySearch(false);
        setPlaces([]);
        setKeyword("");

        clearRoomClusters();
        resetHomeFilters();

        setHomeMode(null);

        setShowLocationOption(true);
        setShowHomeOption((prev) => !prev);

        setShowHomeFilters(false);
        setShowRoomList(false);
        setOpenFilterMenu(null);
    };

    const handleSelectMode = (mode: Exclude<HomeMode, null>) => {
        setHomeMode(mode);

        setShowLocationOption(true);
        setShowHomeOption(false);

        setShowCompanySearch(false);
        setPlaces([]);
        setKeyword("");
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

    const handleChangeSearchMode = () => {
        clearRoomClusters();
        resetHomeFilters();

        setHomeMode(null);

        setShowLocationOption(true);
        setShowHomeOption(true);

        setShowCompanySearch(false);
        setShowHomeFilters(false);
        setShowRoomList(false);
        setOpenFilterMenu(null);
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

        setShowHomeOption(false);
        setHomeMode(null);
        setShowHomeFilters(false);
        setOpenFilterMenu(null);
        setShowRoomList(false);

        setPlaces([]);
        setKeyword("");
        setHasSearched(false);
        setIsEditingCompany(true);

        clearRoomClusters();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
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
                <div className="mt-3 pb-1.5">
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

                            <HomeCard onClick={handleClickHome} />
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
                            previewCompanyOnMap={previewCompanyOnMap}
                        />
                    )}

                    {showHomeOption && (
                        <HomeSearchModePanel onSelectMode={handleSelectMode} />
                    )}

                    {homeMode && (
                        <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {HOME_MODE_TEXT[homeMode].title}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {HOME_MODE_TEXT[homeMode].description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleChangeSearchMode}
                                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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

                            {homeMode === "favoriteCompare" && (
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

                            {homeMode === "localReview" && (
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