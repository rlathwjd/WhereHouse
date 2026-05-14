import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { room, company } = await req.json();

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

        const prompt = `
너는 사회초년생의 자취방 선택을 도와주는 AI 부동산 어시스턴트야.

아래 회사 위치와 매물 정보를 바탕으로 출퇴근, 생활 편의성, 비용 관점에서 장단점을 요약해줘.

반드시 아래 형식을 지켜줘.
마크다운 굵게 표시(** **)는 사용하지 말고, 각 항목 사이에는 빈 줄을 넣어줘.
너무 길게 쓰지 말고, 한 항목은 1~2문장으로 작성해줘.
제공된 정보만 기준으로 판단하고, 모르는 내용은 추측하지 마.

[회사 위치]
- 회사명: ${companyName}
- 주소: ${companyAddress}

[매물 정보]
- 위치: ${room.location ?? room.address ?? "정보 없음"}
- 보증금: ${room.deposit ?? "정보 없음"}만원
- 월세: ${room.rent ?? "정보 없음"}만원
- 면적: ${room.size ?? room.area ?? room.room_size ?? "정보 없음"}㎡
- 방 유형: ${room.room_type ?? room.roomType ?? "정보 없음"}

[출력 형식]

출퇴근 관점 장점
- 

생활 관점 장점
- 

아쉬운 점
- 

추천 한줄 요약
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