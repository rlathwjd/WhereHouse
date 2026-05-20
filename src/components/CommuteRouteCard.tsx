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

    return (
        <div className="relative flex min-w-0 items-center justify-center">
            <div className="absolute left-0 right-0 top-1/2 z-0 border-t border-dashed border-slate-300" />
            <span className="absolute left-0 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-[#2563EB] shadow-sm" />
            <span className="absolute right-0 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-[#F59E0B] shadow-sm" />

            <div
                className={`relative z-20 flex h-full w-full flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center shadow-sm backdrop-blur ${hasRouteEndpoints
                    ? "border-[#DBEAFE] bg-white text-slate-800"
                    : "border-dashed border-slate-300 bg-white/90 text-slate-500"
                    }`}
            >
                <span
                    className={`mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${hasRouteEndpoints
                        ? "bg-[#EEF4FF] text-[#2563EB]"
                        : "bg-slate-100 text-slate-400"
                        }`}
                >
                    <Route size={17} strokeWidth={2.4} />
                </span>

                {hasRouteEndpoints && hasCommuteResult ? (
                    <>
                        <p className="text-base font-extrabold text-slate-900">
                            {commuteTime}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {commuteDistance}
                        </p>
                    </>
                ) : hasRouteEndpoints ? (
                    <>
                        <p className="text-sm font-extrabold text-slate-900">
                            경로 계산 예정
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                            출퇴근 경로를 확인할 수 있어요.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-extrabold text-slate-900">
                            위치를 추가해주세요
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                            회사/집 위치를 모두 설정하면 출퇴근 경로를 확인할 수 있어요.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
