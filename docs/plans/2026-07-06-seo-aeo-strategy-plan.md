# SEO / AEO Strategy Plan — subtle, recruiter-first

Date: 2026-07-06
Author: Claude (plan/gates/verification). Implementers: codex (code + Notion API).
Master decision (2026-07-06): "표나지 않는 AEO/SEO, 전략적으로." → keyword-stuffing
rejected; leverage = machine-readable identity + share preview + de-risked copy.
Status: PROVISIONAL until master approves; gates freeze on approval.

## 1. Strategy — optimize three recruiter discovery moments, not "traffic"

| Moment | Weapon | Visible to a human reader? |
|---|---|---|
| ① Name search after receiving the résumé | `<title>` + JSON-LD Person + rich meta description | No — search results only |
| ② AI screening / "who is this person" | **JSON-LD structured data** | No — inside `<head>`, machines only |
| ③ Master shares the URL | Open Graph / Twitter card preview | No — only when shared |

All three touch ZERO on-screen content. That is the definition of "subtle."
Body keywords stay natural (ATS·근태·52시간·업무 자동화 already present); we only
remove misreadings.

## 2. Facts confirmed

- Canonical domain: `https://smjportfolio.com` (200; also the CORS ALLOWED_ORIGIN
  in functions/api/content.js). `hr-ops-portfolio.pages.dev` is the deploy alias.
- `assets/profile-illustration.png` exists and is used on-site (OG image candidate).
- Current head has ONLY: `<title>성명재 | HR Operations</title>` and
  `<meta name="description" content="성명재 HR Operations Portfolio">`. No OG,
  no JSON-LD, no canonical.
- robots.txt + sitemap.xml already return 200.
- KNOWN pre-existing bug (out of scope here, separate task): index.html sets
  `tailwind.config` before the Tailwind CDN script. Track SEO-1 MUST NOT touch
  that ordering or the tailwind/config blocks — head edits are additive only.

## 3. Track SEO-1 — index.html head (codex, code PR)

Add to `<head>` ONLY (additive; do not reorder or modify existing script/style
blocks; do not touch on-screen markup). Pull real values from content.js, do not
invent facts.

### 3a. Rich meta + canonical (replace the one-line description)
- `<meta name="description">` → one natural sentence, ~140 chars, e.g.:
  "ATS 도입·근태 시스템 재편·주 52시간 관리·업무 자동화를 직접 설계하고 운영한
  HR Operations. 700명 규모 사업장에서 근태 인식률 +12%p, 클레임 0건을 만든 실무 기록."
  (verify metrics against content.js heroImpact before shipping)
- `<link rel="canonical" href="https://smjportfolio.com/">`
- `<meta name="robots" content="index,follow">`

### 3b. Open Graph + Twitter (share preview)
- `og:type=profile`, `og:title`, `og:description` (reuse the meta description),
  `og:url=https://smjportfolio.com/`, `og:image` = absolute URL to
  `https://smjportfolio.com/assets/profile-illustration.png`, `og:locale=ko_KR`,
  `profile:first_name`/`last_name` if clean.
- `twitter:card=summary_large_image` + title/description/image.
- If the illustration is far from 1200×630, ship it anyway (a card still renders);
  a dedicated OG card is a later, optional task — flag it, do not block on it.

### 3c. JSON-LD — the AEO core (one `<script type="application/ld+json">`)
`Person` (optionally wrapped in `ProfilePage`) with values from content.js:
- `name`: 성명재 · `alternateName`: Sung Myeong Jae
- `jobTitle`: HR Operations · `url`: https://smjportfolio.com
- `image`: absolute profile-illustration URL
- `worksFor`: { "@type":"Organization", "name": "오뚜기라면" } (companyName in
  content.js; keep it — already public on-site)
- `knowsAbout`: natural array derived from the real skills + case themes —
  ["HR Operations","인사운영","ATS 도입","근태 관리","주 52시간 관리",
   "업무 자동화","Google Apps Script","Tableau","데이터 분석","채용","HR Tech"]
- `description`: 2–3 natural sentences summarizing impact (reuse the résumé voice).
- Do NOT include email (spam-harvest risk) — omit `email`/contactPoint in v1.
- Validate the JSON parses (node -e round-trip) and has no trailing commas.

### 3d. (optional, cheap) sitemap/robots sanity
Confirm sitemap.xml lists `/` with the canonical host; if it points only at the
pages.dev alias, note it (fix is a one-liner but out of this PR's required scope).

Self-check: `node -e "JSON.parse(require('fs').readFileSync(...))"` on the LD block
extracted, plus `node --check` is N/A for HTML — instead grep-assert the head
contains canonical + og:title + application/ld+json after build.

## 4. Track SEO-2 — content de-risking (Notion, codex API or master UI)

Natural-language edits to the 케이스 스터디 DB rows. "사실확인 필요" rows wait for
master-approved wording; the rest apply as written. All are property-field edits
(career bodies live in 문제/액션/결과 properties, not page bodies).

| Row | Field | Current | Final wording | Fact-check |
|---|---|---|---|---|
| career_5 | 제목 | 온보딩 개선 및 퇴사율 **제고** | **온보딩 구조화 및 조기 퇴사율 개선** | none (misread fix) |
| career_3 | desc | 타겟 맞춤형 채용 콘텐츠 제작 및 채널 다각화 | **직무 분석 기반 채용 공고 개편 — 면접 전환율 2.5배** | none |
| career_3 | 문제(본문) | …우수 인재(**MZ 세대**)의 관심… | …우수 인재의 관심… | none |
| dx2 | 문제 | 생산직 **550명**의 '전자 윤리서약서' | 생산직 **전원**의 '전자 윤리서약서' | none (branding rule) |
| dx2 | 결과 | 3일 만에 **550명 전원** 수합 | 3일 만에 **전원** 수합 (기존 2주 소요) | none |
| dx3 | 결과 | …EVP 발굴 분석 **확대 중** | 지원자 텍스트 600건+ 분석으로 직무 단위 분류·JD 개선 **완료**, EVP 발굴로 확장 중 | none |
| career_4 | 액션 | 노조와 협의하여 **CCTV, 근태로그 기반** … 이동 경로를 2주간 **추적 분석** | 노조 사전 협의 하에 **개인 식별 없는** 통행량·근태로그 데이터로 주요 거점 간 이동 패턴을 2주간 분석 | **YES — confirm this matches what was actually done** |
| career_6 | 전체 | 경조사 자동화 (dx1과 중복) | Rewrite as "자동화 총괄": lead with 증명서 발급 자동화 + 추진 과제; 경조사는 한 줄로 축약 (dx1 = detailed version) | **YES — master supplies the true scope; Claude drafts, master approves** |

Branding guardrails (from CLAUDE.md — do NOT violate):
- Headline `'원래 이랬어'를 바꾸는 HR입니다.` — never touch.
- Badge `HR Ops · 채용 · 자동화 · 구직 중` — never touch.
- Use `700명 규모`; never emphasize 550명 (dx2 fix enforces this).
- Military terms stay in 주요 활동 only.

## 5. Frozen Gates

- G-S1: after SEO-1 deploy, `curl https://smjportfolio.com/` raw HTML contains
  `application/ld+json`, `og:title`, `og:image`, and `rel="canonical"`; the
  JSON-LD block parses as valid JSON.
- G-S2: Google Rich Results / schema.org validator (or `node` JSON parse +
  manual field check) shows a valid `Person` with name, jobTitle, knowsAbout.
- G-S3: no on-screen visual change — the rendered page diff is head-only; a
  screenshot of the hero is unchanged (Claude checks via Playwright).
- G-S4: content edits — the sync run summary still shows 9 cases / 12 growth /
  13 skills; career_5 title no longer contains "제고"; no 550 in dx2; no auto-sync
  churn beyond the intended text changes.
- G-S5 (share test): an OG debugger (or fetching the tags) shows title +
  description + image resolve to absolute https URLs.

## 6. Sequencing & channels

SEO-1 (code, branch `codex/seo-head`, PR to main, Claude review, master merge)
runs independently of SEO-2 (Notion). Do SEO-1 first (pure additive, low risk,
high AEO payoff). SEO-2 content edits need master fact-confirmation on two rows,
so they proceed as master approves wording.

Rollback: SEO-1 = revert the head additions. SEO-2 = Notion page history / re-edit.
