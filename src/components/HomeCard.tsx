import { Check, ChevronRight, House, Plus } from "lucide-react";

import type { HomeMode } from "@/types/map";

type HomeCardProps = {
    onClick: () => void;
    homeMode: HomeMode;
    showHomeOption: boolean;
};

const HOME_MODE_STATUS_TEXT: Record<Exclude<HomeMode, null>, string> = {
    condition: "조건으로 찾는 중",
    localReview: "거주자/재직자 후기 보는 중",
    favoriteCompare: "관심 매물 비교 중",
};

export default function HomeCard({
    onClick,
    homeMode,
    showHomeOption,
}: HomeCardProps) {
    return (
        <div className="relative flex h-full min-h-[108px] items-center rounded-2xl border border-[#FDE8A8] bg-[#FFFBEB] px-6 py-4 text-[#374151] shadow-sm">
            {homeMode && (
                <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] leading-none">
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
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#F59E0B] bg-white">
                        <House
                            size={30}
                            className="text-[#F59E0B]"
                            strokeWidth={2.4}
                        />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-xl font-extrabold text-[#111827]">
                            집
                        </span>

                        <span className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-gray-600">
                            {homeMode ? (
                                <span className="truncate">
                                    {HOME_MODE_STATUS_TEXT[homeMode]}
                                </span>
                            ) : (
                                <span className="truncate">
                                    원하는 조건으로 맞춤 매물을 찾아보세요.
                                </span>
                            )}
                        </span>
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    {!homeMode && (
                        showHomeOption ? (
                            <ChevronRight
                                size={22}
                                className="shrink-0 text-[#374151]"
                                strokeWidth={2.3}
                            />
                        ) : (
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#F59E0B] bg-white text-[#F59E0B] shadow-sm">
                                <Plus size={24} strokeWidth={2.5} />
                            </span>
                        )
                    )}
                </span>
            </button>
        </div>
    );
}