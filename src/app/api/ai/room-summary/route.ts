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
너는 자취방을 추천해주는 AI 부동산 어시스턴트야.

사용자의 회사 위치와 매물 정보를 기반으로
출퇴근 편의성과 생활 관점에서 장단점을 요약해줘.

[회사 위치]
- 회사명: ${companyName}
- 주소: ${companyAddress}

[매물 정보]
- 위치: ${room.location}
- 보증금: ${room.deposit}만원
- 월세: ${room.rent}만원
- 면적: ${room.size}㎡
- 방 유형: ${room.room_type}

[출력 형식]
1. 출퇴근 관점 장점
2. 생활 관점 장점
3. 단점
4. 추천 한줄 요약

너무 길지 않게 자연스럽게 작성해줘.
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
                temperature: 0.7,
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