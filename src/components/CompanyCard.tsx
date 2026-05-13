import { Building2 } from "lucide-react";
import type { Place } from "@/types/map";

type CompanyCardProps = {
    selectedCompany: Place | null;
    showCompanySearch: boolean;
    setShowCompanySearch: React.Dispatch<React.SetStateAction<boolean>>;
    setShowHomeFilters: React.Dispatch<React.SetStateAction<boolean>>;
    setShowHomeOptions: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenFilterMenu: React.Dispatch<any>;
    setHomeMode: React.Dispatch<any>;
    setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditingCompany: React.Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    clearRoomClusters: () => void;
    setShowRoomList: React.Dispatch<React.SetStateAction<boolean>>;
    confirmCompany: (place: Place) => void;
    previousCompanyRef: React.MutableRefObject<Place | null>;
};

export default function CompanyCard({
    selectedCompany,
    showCompanySearch,
    setShowCompanySearch,
    setShowHomeFilters,
    setShowHomeOptions,
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
    return (
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
    );
}