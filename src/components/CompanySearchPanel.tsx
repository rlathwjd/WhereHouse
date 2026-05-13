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
    previewCompanyOnMap: (place: Place) => void;
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
    previewCompanyOnMap,
}: Props) {
    return (
        <div className="mt-6 w-full">
            <div className="flex w-full gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") searchPlace();
                    }}
                    placeholder="회사명 또는 주소를 검색하세요"
                    className="flex-1 rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200"
                />

                <button
                    type="button"
                    onClick={searchPlace}
                    className="shrink-0 rounded-xl bg-(--color-primary) px-6 py-4 text-white"
                >
                    검색
                </button>
            </div>

            {showCompanySearch && hasSearched && !isSearching && (
                <div className="mt-3 rounded-2xl border bg-white p-4 shadow-sm">
                    <p className="mb-3 font-semibold">검색 결과</p>

                    {searchFailed ? (
                        <p className="pl-3 py-2 text-sm text-gray-400">
                            검색 결과가 없습니다. 직접 주소를 입력해 주세요.
                        </p>
                    ) : (
                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {places.map((place) => (
                                <button
                                    key={place.id}
                                    type="button"
                                    onClick={() => previewCompanyOnMap(place)}
                                    className="w-full rounded-xl border p-4 text-left hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{place.place_name}</span>
                                        <span className="text-sm font-normal text-gray-400">
                                            {place.road_address_name || place.address_name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}