import type { HomeMode } from "@/types/map";

export const HOME_MODE_OPTIONS: {
    key: Exclude<HomeMode, null>;
    title: string;
    description: string;
}[] = [
        {
            key: "condition",
            title: "조건으로 찾기",
            description: "지역, 예산 등 조건 중심으로 탐색",
        },
        {
            key: "localReview",
            title: "생활권 후기",
            description: "지역의 실제 생활/통근 경험 비교",
        },
        {
            key: "favoriteCompare",
            title: "관심 매물 비교",
            description: "관심 매물 비교를 통한 분석 리포트 확인",
        },
    ];

export const HOME_MODE_TEXT = HOME_MODE_OPTIONS.reduce(
    (acc, option) => {
        acc[option.key] = {
            title: option.title,
            description: option.description,
        };
        return acc;
    },
    {} as Record<Exclude<HomeMode, null>, { title: string; description: string }>
);