import { Route } from "lucide-react";

import type { HomeMode, Place } from "@/types/map";

type CommuteRouteCardProps = {
    selectedCompany: Place | null;
    homeMode: HomeMode;
    commuteTime?: string;
    commuteDistance?: string;
};

export default function CommuteRouteCard({
    selectedCompany,
    homeMode,
    commuteTime,
    commuteDistance,
}: CommuteRouteCardProps) {
    const hasRouteEndpoints = Boolean(selectedCompany && homeMode);
    const hasCommuteResult = Boolean(commuteTime && commuteDistance);

    const guideText =
        !selectedCompany && !homeMode
            ? "회사/집 위치를 설정하면 경로와 예상 시간을 확인할 수 있어요."
            : selectedCompany && !homeMode
                ? "집 위치를 설정하면 경로와 예상 시간을 확인할 수 있어요."
                : "회사 위치를 설정하면 경로와 예상 시간을 확인할 수 있어요.";

    return (
        <div className="relative flex min-w-0 items-center justify-center">
            {/* 연결 점선 */}
            <div className="absolute left-0 right-0 top-1/2 z-0 border-t border-dashed border-slate-300" />

            {/* 회사 쪽 점 */}
            <span className="absolute left-0 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-[#2563EB] shadow-sm" />

            {/* 집 쪽 점 */}
            <span className="absolute right-0 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-[#F59E0B] shadow-sm" />

            {/* 가운데 카드 */}
            <div
                className={`relative z-20 flex h-full w-full flex-col items-center justify-center rounded-2xl border px-4 py-4 text-center shadow-sm backdrop-blur ${hasRouteEndpoints
                    ? "border-[#DBEAFE] bg-white text-slate-800"
                    : "border-dashed border-slate-300 bg-white/90 text-slate-500"
                    }`}
            >
                <span
                    className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full ${hasRouteEndpoints
                        ? "bg-[#EEF4FF] text-[#2563EB]"
                        : "bg-slate-100 text-slate-400"
                        }`}
                >
                    <Route size={19} strokeWidth={2.4} />
                </span>

                <p className="text-xs font-semibold text-slate-500">
                    출퇴근 거리
                </p>

                {hasRouteEndpoints && hasCommuteResult ? (
                    <div className="mt-1">
                        <p className="text-lg font-extrabold text-slate-900">
                            {commuteTime}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {commuteDistance}
                        </p>
                    </div>
                ) : hasRouteEndpoints ? (
                    <div className="mt-1">
                        <p className="text-lg font-extrabold text-slate-900">
                            -
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            경로 계산 예정
                        </p>
                    </div>
                ) : (
                    <p className="mt-1 max-w-full truncate text-xs leading-5 text-slate-500">
                        {guideText}
                    </p>
                )}
            </div>
        </div>
    );
}