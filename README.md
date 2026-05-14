# WhereHouse

## 개요
사회초년생을 위한 생활권 기반 부동산 탐색 서비스


## 주요 기능
- 회사 위치 기준 매물 탐색
- 지역·예산·매물 유형 등 조건에 따라 매물 필터링
- 카카오맵 기반 매물 시각화
- 매물 장단점 브리핑
- 관심 매물 비교 분석 리포트(로컬에서만 구현)
- 사용자 맞춤 신규 매물 알림(예정)


## 기술 스택
- Next.js, TypeScript
- Supabase, PostgreSQL
- Kakao Map API, Kakao Local API

## 환경 변수 설정
- .env 파일
- NEXT_PUBLIC_KAKAO_MAP_KEY="kakao_map_key" 입력
- NEXT_PUBLIC_SUPABASE_URL="supabase_url" 입력
- NEXT_PUBLIC_SUPABASE_ANON_KEY="supabase_anon_key" 입력
- SUPABASE_SERVICE_ROLE_KEY="supabase_service_role_key" 입력
- KAKAO_REST_API_KEY="kakao_rest_api_key" 입력
- GROQ_API_KEY="groq_api_key" 입력

## 실행 방법
- npm install (패키지 설치)
- npm run dev (개발 서버 실행)
- npx tsx src/scripts/seed_rooms.ts (매물 데이터 supabase에 저장)

## 사이트 접속
https://where-house-rouge.vercel.app/