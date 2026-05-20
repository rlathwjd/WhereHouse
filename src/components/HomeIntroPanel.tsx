export default function HomeIntroPanel() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 px-6 text-center">
            <div className="max-w-3xl">
                <p className="text-xl font-extrabold text-gray-900 xl:whitespace-nowrap">
                    회사 위치를 추가하면 출퇴근 기준으로 매물을 비교할 수 있어요.
                </p>

                <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                    회사 설정 없이도 집 조건으로 바로 매물을 찾아볼 수 있습니다.
                </p>
            </div>
        </div>
    );
}