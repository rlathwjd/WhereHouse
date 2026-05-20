import { MapPin, Building2, Search, X } from "lucide-react";

import type { Place } from "@/types/map";

type Props = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    searchPlace: () => void;
    showCompanySearch: boolean;
    hasSearched: boolean;
    isSearching: boolean;
    searchFailed: boolean;
    places: Place[];
    confirmCompany: (place: Place) => void;
    onClose: () => void;
};

export default function CompanySearchPanel({
    inputRef,
    keyword,
    setKeyword,
    searchPlace,
    showCompanySearch,
    hasSearched,
    isSearching,
    searchFailed,
    places,
    confirmCompany,
    onClose,
}: Props) {
    return (
        <div className="rounded-2xl border border-[#D7E6FF] bg-white px-5 py-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]">
                        <Building2
                            size={20}
                            className="text-[#2563EB]"
                            strokeWidth={2.2}
                        />
                    </span>

                    <div>
                        <p className="text-base font-extrabold text-gray-900">
                            회사 위치 검색
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    aria-label="회사 위치 검색 닫기"
                >
                    <X size={18} strokeWidth={2.4} />
                </button>
            </div>

            <div className="flex w-full items-center gap-3">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") searchPlace();
                        }}
                        placeholder="회사명 또는 주소를 검색하세요"
                        className="h-12 w-full rounded-xl border border-[#B8D7FF] bg-[#F8FBFF] pl-4 pr-12 text-base font-semibold text-gray-800 outline-none transition placeholder:text-sm placeholder:font-medium placeholder:text-gray-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
                    />

                    <button
                        type="button"
                        onClick={searchPlace}
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition hover:bg-[#DBEAFE]"
                        aria-label="회사 위치 검색"
                    >
                        <Search size={19} strokeWidth={2.4} />
                    </button>
                </div>
            </div>

            {showCompanySearch && isSearching && (
                <p className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3 text-sm font-medium text-[#2563EB]">
                    검색 중입니다.
                </p>
            )}

            {showCompanySearch && hasSearched && !isSearching && (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#D7E6FF] bg-white">
                    <p className="border-b border-[#D7E6FF] bg-[#EFF6FF] px-4 py-3 text-sm font-bold text-[#2563EB]">
                        검색 결과
                    </p>

                    {searchFailed ? (
                        <p className="px-4 py-5 text-sm text-gray-400">
                            검색 결과가 없습니다. 직접 주소를 입력해 주세요.
                        </p>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {places.map((place) => (
                                <button
                                    key={place.id}
                                    type="button"
                                    onClick={() => confirmCompany(place)}
                                    className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50"
                                >
                                    <MapPin
                                        size={18}
                                        strokeWidth={2.3}
                                        className="mt-0.5 shrink-0 text-gray-500"
                                    />

                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-bold text-gray-900">
                                            {place.place_name}
                                        </span>

                                        <span className="mt-1 block truncate text-sm font-medium text-gray-500">
                                            {place.road_address_name || place.address_name}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
