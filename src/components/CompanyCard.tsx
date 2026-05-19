import type {
    Dispatch,
    MutableRefObject,
    RefObject,
    SetStateAction,
} from "react";
import { Building2, Plus } from "lucide-react";

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
    setShowLocationOption,
    setPlaces,
    setKeyword,
    setHasSearched,
    setIsEditingCompany,
    inputRef,
    clearRoomClusters,
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
        <div className="flex h-full items-center rounded-2xl border border-[#D7E6FF] bg-[#EEF4FF] p-5 text-[#374151] shadow-sm transition-transform duration-300">
            {selectedCompany ? (
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#2563EB] bg-white">
                            <Building2 size={32} className="text-[#2563EB]" strokeWidth={2.4} />
                        </span>

                        <span className="min-w-0">
                            <span className="block truncate text-xl font-bold text-[#111827]">
                                {selectedCompany.place_name}
                            </span>

                            <span className="mt-2 block truncate text-sm font-medium text-[#6B7280]">
                                {selectedCompany.road_address_name || selectedCompany.address_name}
                            </span>
                        </span>
                    </div>

                    {!showCompanySearch && (
                        <button
                            type="button"
                            onClick={toggleCompanySearch}
                            className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#2563EB] bg-white px-5 text-sm font-bold text-[#2563EB] transition hover:bg-[#EFF6FF]"
                        >
                            수정
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#2563EB] bg-white">
                            <Building2 size={32} className="text-[#2563EB]" strokeWidth={2.4} />
                        </span>

                        <span className="min-w-0">
                            <span className="block text-xl font-bold text-[#111827]">
                                회사
                            </span>

                            <span className="mt-2 block text-xs font-medium leading-6 text-[#4B5563]">
                                회사 위치를 추가하면 출퇴근 기준으로 매물을 비교할 수 있어요.
                            </span>
                        </span>
                    </div>

                    {!showCompanySearch && (
                        <button
                            type="button"
                            onClick={toggleCompanySearch}
                            className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#2563EB] bg-white px-3 text-sm font-bold text-[#2563EB] transition hover:bg-[#EFF6FF]"
                        >
                            <Plus size={18} strokeWidth={2.6} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
