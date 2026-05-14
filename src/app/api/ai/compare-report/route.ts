import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { rooms, company } = await req.json();

        if (!Array.isArray(rooms) || rooms.length < 2) {
            return NextResponse.json(
                { error: "비교할 매물을 2개 이상 선택해 주세요." },
                { status: 400 }
            );
        }

        const companyName = company?.place_name ?? "회사 위치 미설정";
        const companyAddress =
            company?.road_address_name || company?.address_name || "회사 주소 미설정";

        const groqApiKey = process.env.GROQ_API_KEY;

        if (!groqApiKey) {
            return NextResponse.json(
                { error: "GROQ_API_KEY가 설정되지 않았습니다." },
                { status: 500 }
            );
        }

        const roomText = rooms
            .map((room, index) => {
                return `
[매물 ${index + 1}]
- 위치: ${room.location ?? room.address ?? "정보 없음"}
- 보증금: ${room.deposit ?? "정보 없음"}만원
- 월세: ${room.rent ?? "정보 없음"}만원
- 면적: ${room.size ?? room.area ?? room.room_size ?? "정보 없음"}㎡
- 방 유형: ${room.room_type ?? room.roomType ?? "정보 없음"}
- 거래 유형: ${room.trade_type ?? room.tradeType ?? "정보 없음"}
- 승인일: ${room.approval_date ?? room.approvalDate ?? "정보 없음"}
`;
            })
            .join("\n");

        const prompt = `
너는 사회초년생의 자취방 선택을 도와주는 AI 부동산 비교 분석 어시스턴트야.

아래 회사 위치와 사용자가 선택한 관심 매물 정보를 바탕으로,
출퇴근, 비용, 면적, 생활 편의성, 최종 추천 관점에서 비교 분석 리포트를 작성해줘.

반드시 아래 형식을 지켜줘.
마크다운 굵게 표시(** **)는 사용하지 말고, 각 항목 사이에는 빈 줄을 넣어줘.
너무 길게 쓰지 말고, 각 항목은 2~4문장 이내로 작성해줘.
제공된 정보만 기준으로 판단하고, 모르는 내용은 추측하지 마.
특정 매물을 추천할 때는 "매물 1", "매물 2"처럼 번호로 지칭해줘.

[회사 위치]
- 회사명: ${companyName}
- 주소: ${companyAddress}

[비교 대상 매물]
${roomText}

[출력 형식]

전체 요약
- 

비용 비교
- 

면적 및 주거 조건 비교
- 

출퇴근 및 위치 관점
- 

매물별 장점
- 매물 1:
- 매물 2:

매물별 아쉬운 점
- 매물 1:
- 매물 2:

최종 추천
- 

사회초년생 기준 선택 조언
- 
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

        const report = data.choices?.[0]?.message?.content;

        return NextResponse.json({ report });
    } catch (error) {
        console.error("compare-report API error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "관심 매물 비교 리포트 생성 중 오류가 발생했습니다.",
            },
            { status: 500 }
        );
    }
}