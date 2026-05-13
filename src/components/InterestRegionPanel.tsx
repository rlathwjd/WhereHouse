type Props = {
    selectedRegions: string[];
    setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function InterestRegionPanel({
    selectedRegions,
    setSelectedRegions,
}: Props) {
    const toggleRegion = (item: string) => {
        setSelectedRegions((prev) =>
            prev.includes(item)
                ? prev.filter((region) => region !== item)
                : [...prev, item]
        );
    };

    const pillClass = (isSelected: boolean) =>
        `rounded-full border px-4 py-2 font-semibold transition ${isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
            : "border-[var(--color-border)] bg-white text-slate-700 hover:bg-[var(--color-bg)]"
        }`;

    return (
        <div className="rounded-2xl border bg-gray-50 p-5">
            <p className="mb-4 font-bold">관심 지역 선택</p>

            <div className="space-y-5">
                <div>
                    <p className="mb-3 text-sm font-semibold text-gray-500">서울</p>

                    <div className="flex flex-wrap gap-2">
                        {[
                            "마포구",
                            "영등포구",
                            "강서구",
                            "양천구",
                            "서대문구",
                            "은평구",
                            "용산구",
                            "성동구",
                            "강남구",
                        ].map((item) => {
                            const isSelected = selectedRegions.includes(item);

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleRegion(item)}
                                    className={pillClass(isSelected)}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold text-gray-500">
                        경기 · 인천
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {[
                            "고양",
                            "김포",
                            "부천",
                            "광명",
                            "안양",
                            "과천",
                            "성남",
                            "하남",
                            "인천",
                        ].map((item) => {
                            const isSelected = selectedRegions.includes(item);

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleRegion(item)}
                                    className={pillClass(isSelected)}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}