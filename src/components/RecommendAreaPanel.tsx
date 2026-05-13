export default function RecommendAreaPanel() {
    return (
        <div className="rounded-2xl border bg-gray-50 p-5">
            <p className="mb-4 font-bold">추천 생활권</p>

            <div className="grid gap-3 md:grid-cols-3">
                {[
                    {
                        title: "출퇴근 중심형",
                        areas: "가양 · 염창 · 등촌",
                        desc: "회사까지 이동 시간을 우선으로 보는 지역",
                    },
                    {
                        title: "균형형",
                        areas: "당산 · 문래 · 영등포구청",
                        desc: "출퇴근과 생활 편의성을 같이 보는 지역",
                    },
                    {
                        title: "생활권 중심형",
                        areas: "합정 · 망원 · 홍대입구",
                        desc: "퇴근 후 생활과 접근성을 중시하는 지역",
                    },
                ].map((item) => (
                    <button
                        key={item.title}
                        type="button"
                        className="rounded-xl border bg-white p-4 text-left transition hover:bg-slate-50"
                    >
                        <p className="font-bold">{item.title}</p>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                            {item.areas}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}