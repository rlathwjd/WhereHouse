import { Building2, ChevronRight, MapPin, Plus } from "lucide-react";

import type { Place } from "@/types/map";

type CompanyCardProps = {
    selectedCompany: Place | null;
    showCompanySearch: boolean;
    onClick: () => void;
};

export default function CompanyCard({
    selectedCompany,
    showCompanySearch,
    onClick,
}: CompanyCardProps) {
    return (
        <div className="relative flex h-full min-h-[88px] items-center rounded-2xl border border-[#D7E6FF] bg-[#EEF4FF] px-5 py-3 text-[#374151] shadow-sm">
            <button
                type="button"
                onClick={onClick}
                className="flex h-full w-full items-center justify-between gap-3 pr-6 text-left"
            >
                <span className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#2563EB] bg-white">
                        <Building2
                            size={24}
                            className="text-[#2563EB]"
                            strokeWidth={2.4}
                        />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-lg font-extrabold text-[#111827]">
                            {selectedCompany?.place_name ?? "회사"}
                        </span>

                        <span className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs font-semibold text-gray-600">
                            {selectedCompany ? (
                                <>
                                    <MapPin
                                        size={13}
                                        className="shrink-0 text-[#2563EB]"
                                        strokeWidth={2.5}
                                    />

                                    <span className="truncate">
                                        {selectedCompany.road_address_name ||
                                            selectedCompany.address_name}
                                    </span>
                                </>
                            ) : (
                                <span className="truncate">
                                    회사명이나 주소를 검색해 출퇴근 기준 위치를 설정하세요.
                                </span>
                            )}
                        </span>
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    {selectedCompany ? (
                        <span
                            className={`inline-flex h-8 items-center justify-center rounded-lg border bg-white px-3 text-xs font-bold shadow-sm transition ${showCompanySearch
                                ? "border-[#2563EB] text-[#2563EB]"
                                : "border-[#BFDBFE] text-[#2563EB]"
                                }`}
                        >
                            {showCompanySearch ? "수정 중" : "수정"}
                        </span>
                    ) : showCompanySearch ? (
                        <ChevronRight
                            size={20}
                            className="shrink-0 text-[#374151]"
                            strokeWidth={2.3}
                        />
                    ) : (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2563EB] bg-white text-[#2563EB] shadow-sm">
                            <Plus size={20} strokeWidth={2.5} />
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}
