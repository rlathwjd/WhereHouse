type Props = {
    isLoading: boolean;
    summary?: string;
};

export default function RoomSummaryBox({
    isLoading,
    summary,
}: Props) {
    if (isLoading) {
        return (
            <p className="mt-2 text-sm text-gray-500">
                AI가 매물을 분석 중입니다...
            </p>
        );
    }

    if (!summary) {
        return null;
    }

    return (
        <div className="mt-3 rounded-lg bg-gray-100 p-3">
            <h4 className="mb-2 font-semibold">
                AI 매물 요약
            </h4>

            <p className="text-sm whitespace-pre-line">
                {summary}
            </p>
        </div>
    );
}