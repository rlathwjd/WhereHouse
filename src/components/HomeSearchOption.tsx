import type { HomeMode } from "@/types/map";
import { HOME_MODE_OPTIONS } from "@/constants/homeMode";

type Props = {
    setHomeMode: React.Dispatch<React.SetStateAction<HomeMode>>;
    setShowHomeOptions: React.Dispatch<React.SetStateAction<boolean>>;
    setShowHomeFilters: React.Dispatch<React.SetStateAction<boolean>>;
    setShowRoomList: React.Dispatch<React.SetStateAction<boolean>>;
    showRoomClusters: () => void;
    mapRef: React.RefObject<any>;
    resetHomeFilters: () => void;
};

export default function HomeSearchOption({
    setHomeMode,
    setShowHomeOptions,
    setShowHomeFilters,
    setShowRoomList,
    showRoomClusters,
    mapRef,
    resetHomeFilters,
}: Props) {
    const handleSelectMode = (mode: Exclude<HomeMode, null>) => {
        resetHomeFilters?.();

        setHomeMode(mode);
        setShowHomeOptions(false);

        if (mode === "condition") {
            setShowHomeFilters(true);
            setShowRoomList(false);

            setTimeout(() => {
                mapRef.current?.relayout();
                showRoomClusters();
            }, 300);
        }

        if (mode === "localReview") {
            setShowHomeFilters(false);
            setShowRoomList(false);
        }
    };

    return (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-500">
                어떤 방식으로 집을 찾아볼까요?
            </p>

            <div className="grid gap-3 md:grid-cols-2">
                {HOME_MODE_OPTIONS.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelectMode(option.key)}
                        className="rounded-xl border p-4 text-left transition hover:bg-gray-50"
                    >
                        <p className="font-bold">{option.title}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            {option.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}