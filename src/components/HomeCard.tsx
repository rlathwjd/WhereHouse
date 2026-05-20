import { House, Plus } from "lucide-react";

import { HOME_MODE_TEXT } from "@/constants/homeMode";
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
    const selectedHomeMode = homeMode ? HOME_MODE_TEXT[homeMode] : null;

    return (
        <div className="flex h-full items-center rounded-2xl border border-[#FDE8A8] bg-[#FFFBEB] p-5 text-[#374151] shadow-sm transition-transform duration-300">
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#F59E0B] bg-white">
                        <House size={32} className="text-[#F59E0B]" strokeWidth={2.4} />
                    </span>

                    <span className="min-w-0">
                        <span className="block text-xl font-bold text-[#111827]">
                            집
                        </span>

                        <span className="mt-2 block text-xs font-medium leading-6 text-[#4B5563]">
                            원하는 조건으로 맞춤 매물을 찾아보세요.
                        </span>
                    </span>
                </div>

                {!showHomeOption && (
                    <button
                        type="button"
                        onClick={onClick}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#F59E0B] bg-white px-3 text-sm font-bold text-[#B45309] transition hover:bg-[#FEF3C7]"
                    >
                        {selectedHomeMode ? "찾기 방식 변경" : <Plus size={18} strokeWidth={2.6} />}
                    </button>
                )}
            </div>
        </div>
    );
}
