import type {
    Dispatch,
    MutableRefObject,
    RefObject,
    SetStateAction,
} from "react";
import { Building2 } from "lucide-react";

import type { FilterMenu, HomeMode, Place } from "@/types/map";

type CompanyCardProps = {
    selectedCompany: Place | null;
    showCompanySearch: boolean;
    setShowCompanySearch: Dispatch<SetStateAction<boolean>>;

    setShowHomeFilters: Dispatch<SetStateAction<boolean>>;
    setShowLocationOption: Dispatch<SetStateAction<boolean>>;
    setShowHomeOption: Dispatch<SetStateAction<boolean>>;
    setOpenFilterMenu: Dispatch<SetStateAction<FilterMenu>>;
    setHomeMode: Dispatch<SetStateAction<HomeMode>>;
    setPlaces: Dispatch<SetStateAction<Place[]>>;
    setKeyword: Dispatch<SetStateAction<string>>;
    setHasSearched: Dispatch<SetStateAction<boolean>>;
    setIsEditingCompany: Dispatch<SetStateAction<boolean>>;
    setShowRoomList: Dispatch<SetStateAction<boolean>>;

    inputRef: RefObject<HTMLInputElement | null>;
    clearRoomClusters: () => void;
    confirmCompany: (place: Place) => void;
    previousCompanyRef: MutableRefObject<Place | null>;

    /**
     * 기존 HomeSearchOption에서 넘기고 있으면 타입 에러 방지용으로 둠
     * 실제 동작은 이 컴포넌트 내부 toggleCompanySearch에서 처리
     */
    onOpenCompanySearch?: () => void;
};

export default function CompanyCard({
    selectedCompany,
    showCompanySearch,
    setShowCompanySearch,
    setShowHomeFilters,
    setShowLocationOption,
    setShowHomeOption,
    setOpenFilterMenu,
    setHomeMode,
    setPlaces,
    setKeyword,
    setHasSearched,
    setIsEditingCompany,
    inputRef,
    clearRoomClusters,
    setShowRoomList,
    confirmCompany,
    previousCompanyRef,
}: CompanyCardProps) {
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
        setShowCompanySearch(true);

        // 회사 + 집 카드 영역은 유지
        setShowLocationOption(true);

        // 집+ 선택 박스와 집 탐색 모드는 닫기
        setShowHomeOption(false);
        setHomeMode(null);
        setShowHomeFilters(false);
        setOpenFilterMenu(null);
        setShowRoomList(false);

        // 검색 상태 초기화
        resetCompanySearchState();

        // 회사 수정/검색 상태
        setIsEditingCompany(true);

        // 기존 매물 클러스터 제거
        clearRoomClusters();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const toggleCompanySearch = () => {
        if (showCompanySearch) {
            closeCompanySearch();
            return;
        }

        if (selectedCompany) {
            previousCompanyRef.current = selectedCompany;
        }

        openCompanySearch();
    };

    return (
        <div className="rounded-2xl bg-[#eef7fe] p-5 text-[#374151] shadow-sm transition-transform duration-300">
            {selectedCompany ? (
                <div className="flex cursor-pointer items-start justify-between">
                    <div onClick={toggleCompanySearch} className="cursor-pointer">
                        <p className="text-sm text-[#6B7280]">회사</p>

                        <p className="mt-2 text-xl font-bold text-[#1F2937]">
                            {selectedCompany.place_name}
                        </p>

                        <p className="mt-1 text-sm text-[#6B7280]">
                            {selectedCompany.road_address_name || selectedCompany.address_name}
                        </p>
                    </div>

                    <div className="ml-4">
                        <button
                            type="button"
                            onClick={toggleCompanySearch}
                            className="rounded-xl bg-[#8CB9E8] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#74A8DD]"
                        >
                            {showCompanySearch ? "취소" : "수정"}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={toggleCompanySearch}
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
    );
}