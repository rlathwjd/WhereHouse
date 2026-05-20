import { Building2, Check, ChevronRight, MapPin, Plus } from "lucide-react";

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
        <div className="relative flex h-full min-h-[108px] items-center rounded-2xl border border-[#D7E6FF] bg-[#EEF4FF] px-6 py-4 text-[#374151] shadow-sm">
            {selectedCompany && (
                <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] leading-none">
                    <Check
                        size={12}
                        className="translate-y-[0.5px] text-white"
                        strokeWidth={3.2}
                    />
                </span>
            )}

            <button
                type="button"
                onClick={onClick}
                className="flex h-full w-full items-center justify-between gap-4 text-left"
            >
                <span className="flex min-w-0 flex-1 items-center gap-5">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#2563EB] bg-white">
                        <Building2
                            size={30}
                            className="text-[#2563EB]"
                            strokeWidth={2.4}
                        />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-xl font-extrabold text-[#111827]">
                            {selectedCompany?.place_name ?? "회사"}
                        </span>

                        <span className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-gray-600">
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
                                    출퇴근 기준으로 매물을 비교할 수 있어요.
                                </span>
                            )}
                        </span>
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    {selectedCompany ? (
                        <span
                            className={`inline-flex h-10 items-center justify-center rounded-xl border bg-white px-4 text-sm font-bold shadow-sm transition ${showCompanySearch
                                ? "border-[#2563EB] text-[#2563EB]"
                                : "border-[#BFDBFE] text-[#2563EB]"
                                }`}
                        >
                            {showCompanySearch ? "수정 중" : "수정"}
                        </span>
                    ) : showCompanySearch ? (
                        <ChevronRight
                            size={22}
                            className="shrink-0 text-[#374151]"
                            strokeWidth={2.3}
                        />
                    ) : (
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#2563EB] bg-white text-[#2563EB] shadow-sm">
                            <Plus size={24} strokeWidth={2.5} />
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}