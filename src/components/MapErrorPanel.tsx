export default function MapErrorPanel() {
    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 px-6 text-center">
            <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-base font-extrabold text-gray-900">
                    Kakao 지도를 불러오지 못했습니다.
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Kakao JavaScript 키와 현재 접속 주소가 Kakao Developers의 JavaScript 플랫폼 도메인에 등록되어 있는지 확인해주세요.
                </p>
            </div>
        </div>
    );
}