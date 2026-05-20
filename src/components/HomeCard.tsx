import { ChevronRight, House, Plus } from "lucide-react";

import type { HomeMode } from "@/types/map";

type HomeCardProps = {
    onClick: () => void;
    homeMode: HomeMode;
    showHomeOption: boolean;
};

export default function HomeCard({
    onClick,
    homeMode,
    showHomeOption,
}: HomeCardProps) {
    return (
        <div className="relative flex h-full min-h-[88px] items-center rounded-2xl border border-[#FDE8A8] bg-[#FFFBEB] px-5 py-3 text-[#374151] shadow-sm">
            <button
                type="button"
                onClick={onClick}
                className="flex h-full w-full items-center justify-between gap-3 pr-6 text-left"
            >
                <span className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F59E0B] bg-white">
                        <House
                            size={24}
                            className="text-[#F59E0B]"
                            strokeWidth={2.4}
                        />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-lg font-extrabold text-[#111827]">
                            집
                        </span>

                        <span className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs font-semibold text-gray-600">
                            <span className="truncate">
                                원하는 조건이나 후기를 보고 매물을 찾아보세요
                            </span>
                        </span>
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    {showHomeOption || homeMode ? (
                        <ChevronRight
                            size={20}
                            className="shrink-0 text-[#374151]"
                            strokeWidth={2.3}
                        />
                    ) : (
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F59E0B] bg-white text-[#F59E0B] shadow-sm">
                            <Plus size={20} strokeWidth={2.5} />
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}
