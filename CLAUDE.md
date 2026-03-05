# CLAUDE.md

**Stack:** Pure HTML · Vanilla JS · Tailwind CSS (CDN) · Cloudflare Pages (GitHub 자동 배포)
**No build tools** — 빌드 단계 없음, CDN 링크만 사용

## Key Files

- `index.html` — 포트폴리오 메인 (히어로 → 성과 → 케이스 스터디 순서)
- `print.html` — A4 인쇄 전용 (QR코드 자동 삽입, PDF 저장 플로우)
- `admin.html` — 콘텐츠 인라인 편집 UI (Cloudflare Access 보호 대상)
- `content.js` — 포트폴리오 콘텐츠 원본 데이터 (노션 파이프라인 자동 생성 예정)
- `functions/api/content.js` — Cloudflare Pages Function (GET/PUT, KV 저장소 연동)

## Cloudflare 설정 (변경 금지)

- KV namespace binding: `PORTFOLIO_KV`
- 환경변수: `EDITOR_TOKEN` (PUT 인증 토큰)
- 노션 API는 서버사이드(GitHub Actions)에서만 호출 — 클라이언트에 노출 금지

## Architecture

```
Notion DB → GitHub Actions → content.js → Cloudflare Pages → index.html
                                                             → print.html (PDF+QR)
```

## Constraints (절대 하지 말 것)

- npm / 빌드 도구 도입 금지 — 순수 HTML/JS 유지
- 노션 API 키를 프론트엔드 코드에 노출 금지
- `EDITOR_TOKEN`을 코드에 하드코딩 금지

## Compact Instructions

When compacting, always preserve:
- 현재 작업 중인 Phase (1~4) 및 완료된 태스크
- 수정된 파일명과 변경 내용 요약
- Cloudflare KV / Pages Function 관련 결정사항

Drop:
- 설계 문서 전문 (`docs/plans/`)
- 이미 완료된 탐색 과정
