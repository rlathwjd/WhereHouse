import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { room, company } = await req.json();

        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return NextResponse.json(
                { error: "GROQ_API_KEY가 설정되지 않았습니다." },
                { status: 500 }
            );
        }

        const companyName = company?.place_name ?? null;
        const companyAddress =
            company?.road_address_name || company?.address_name || null;

        const hasCompany = Boolean(companyName && companyAddress);

        const roomLocation = room.location ?? room.address ?? "정보 없음";
        const roomDeposit = room.deposit ?? "정보 없음";
        const roomRent = room.rent ?? "정보 없음";
        const roomSize = room.size ?? room.area ?? room.room_size ?? "정보 없음";
        const roomType = room.room_type ?? room.roomType ?? "정보 없음";

        const roomApprovalDate =
            room.approval_date ??
            room.approvalDate ??
            room.approved_at ??
            "정보 없음";

        const roomFloor =
            room.floor ??
            room.room_floor ??
            "정보 없음";

        const roomElevator =
            room.elevator ??
            room.has_elevator ??
            "정보 없음";

        const roomParking =
            room.parking ??
            room.has_parking ??
            "정보 없음";

        const roomOptions =
            room.options ??
            room.option ??
            "정보 없음";

        const roomAmenities =
            room.amenities ??
            room.convenience ??
            room.nearby_facilities ??
            "정보 없음";

        // TODO: 추후 실거래가 API 연결 시 실제 값으로 교체
        const marketPriceInfo = {
            status: "시세 대비 월세 7만원 낮음",
            averageDeposit: 1200,
            averageRent: 59,
            rentDiff: -7,
        };

        // TODO: 추후 주변 역/정류장 API 연결 시 실제 값으로 교체
        const nearbyTransitInfo = null;
        // 예시: "김포공항역(공항철도) 도보 약 4분, 마곡나루역(9호선) 도보 약 8분"

        // TODO: 추후 대중교통 길찾기 API 연결 시 실제 값으로 교체
        const commuteRouteInfo = null;
        // 예시: "김포공항역(공항철도) → 마곡나루역(9호선), 환승 1회, 약 30분 소요"

        const prompt = hasCompany
            ? `
너는 사회초년생의 자취방 선택을 도와주는 AI 부동산 어시스턴트야.

아래 회사 위치, 매물 정보, 시세 정보를 바탕으로 매물을 아주 간단하게 요약해줘.

반드시 아래 출력 형식을 그대로 지켜줘.
마크다운 굵게 표시(** **)는 사용하지 마.
각 항목은 한 줄로만 작성해.
각 항목은 반드시 "교통: 내용"처럼 콜론(:) 뒤에 바로 문장을 이어서 작성해.
콜론(:) 뒤에서 줄바꿈하지 마.
제공된 정보만 기준으로 판단하고, 모르는 내용은 추측하지 마.
교통 항목에는 회사 기준 출퇴근 정보를 우선 반영해.
가격 항목에는 보증금/월세를 단순히 읽지 말고, 반드시 시세 정보와 비교해서 설명해.
장점과 단점 항목에는 교통과 가격을 제외하고, 편의시설, 엘리베이터, 주차, 옵션, 층수, 면적, 생활 편의성 같은 요소만 반영해.
참고 항목에는 건물 연식, 사용승인일, 추가 확인 필요사항을 중심으로 작성해.
정보가 부족하면 "제공된 정보만으로는 판단하기 어려워요."라고 작성해.

[회사 위치]
- 회사명: ${companyName}
- 주소: ${companyAddress}

[매물 정보]
- 위치: ${roomLocation}
- 보증금: ${roomDeposit}만원
- 월세: ${roomRent}만원
- 면적: ${roomSize}㎡
- 방 유형: ${roomType}
- 사용승인일: ${roomApprovalDate}
- 층수: ${roomFloor}
- 엘리베이터: ${roomElevator}
- 주차: ${roomParking}
- 옵션: ${roomOptions}
- 주변 편의시설: ${roomAmenities}

[시세 정보]
- 시세 판단: ${marketPriceInfo.status}
- 최근 평균 보증금: ${marketPriceInfo.averageDeposit}만원
- 최근 평균 월세: ${marketPriceInfo.averageRent}만원
- 현재 매물과 평균 월세 차이: ${marketPriceInfo.rentDiff}만원

[출퇴근 경로 정보]
- ${commuteRouteInfo ?? "아직 대중교통 길찾기 API가 연결되지 않아 실제 출퇴근 시간은 제공되지 않음"}

[출력 형식]
교통: 회사와 매물까지 역/지하철 경로를 한 문장으로 작성
가격: 시세 대비 가격 판단을 한 문장으로 작성
장점: 교통과 가격을 제외한 장점을 한 문장으로 작성
단점: 교통과 가격을 제외한 단점을 한 문장으로 작성
참고: 건물 연식 또는 추가 확인사항을 한 문장으로 작성  
`
            : `
너는 사회초년생의 자취방 선택을 도와주는 AI 부동산 어시스턴트야.

아래 매물 정보와 시세 정보를 바탕으로 매물을 아주 간단하게 요약해줘.

반드시 아래 출력 형식을 그대로 지켜줘.
마크다운 굵게 표시(** **)는 사용하지 마.
각 항목은 한 줄로만 작성해.
각 항목은 반드시 "교통: 내용"처럼 콜론(:) 뒤에 바로 문장을 이어서 작성해.
콜론(:) 뒤에서 줄바꿈하지 마.
제공된 정보만 기준으로 판단하고, 모르는 내용은 추측하지 마.
회사 위치가 없으므로 출퇴근 시간은 판단하지 마.
교통 항목에는 매물 주변 대중교통 접근성 정보를 우선 반영해.
가격 항목에는 보증금/월세를 단순히 읽지 말고, 반드시 시세 정보와 비교해서 설명해.
장점과 단점 항목에는 교통과 가격을 제외하고, 편의시설, 엘리베이터, 주차, 옵션, 층수, 면적, 생활 편의성 같은 요소만 반영해.
참고 항목에는 건물 연식, 사용승인일, 추가 확인 필요사항을 중심으로 작성해.
정보가 부족하면 "제공된 정보만으로는 판단하기 어려워요."라고 작성해.


[매물 정보]
- 위치: ${roomLocation}
- 보증금: ${roomDeposit}만원
- 월세: ${roomRent}만원
- 면적: ${roomSize}㎡
- 방 유형: ${roomType}
- 사용승인일: ${roomApprovalDate}
- 층수: ${roomFloor}
- 엘리베이터: ${roomElevator}
- 주차: ${roomParking}
- 옵션: ${roomOptions}
- 주변 편의시설: ${roomAmenities}

[시세 정보]
- 시세 판단: ${marketPriceInfo.status}
- 최근 평균 보증금: ${marketPriceInfo.averageDeposit}만원
- 최근 평균 월세: ${marketPriceInfo.averageRent}만원
- 현재 매물과 평균 월세 차이: ${marketPriceInfo.rentDiff}만원

[주변 교통 정보]
- ${nearbyTransitInfo ?? "아직 주변 역/정류장 API가 연결되지 않아 실제 도보 시간은 제공되지 않음"}

[출력 형식]
교통: 매물 주변 역/정류장 내용을 한 문장으로 작성
가격: 시세 대비 가격 판단을 한 문장으로 작성
장점: 교통과 가격을 제외한 장점을 한 문장으로 작성
단점: 교통과 가격을 제외한 단점을 한 문장으로 작성
참고: 건물 연식 또는 추가 확인사항을 한 문장으로 작성 
`;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error?.message || "Groq API 호출 실패" },
                { status: 500 }
            );
        }

        const summary = data.choices?.[0]?.message?.content;

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("room-summary API error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "매물 요약 생성 중 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}