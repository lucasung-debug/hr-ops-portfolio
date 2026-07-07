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
| career_4 | 액션 | 노조와 협의하여 **CCTV, 근태로그 기반** … 이동 경로를 2주간 **추적 분석** | **근태 로그와 현장 확인을 교차 분석해 라인별 실제 이동 경로·태깅 누락 지점을 2주간 파악** | ⚠️ EARLIER "개인 식별 없는" wording was WRONG (fact-distorting) and is RETRACTED. Master confirmed CCTV개인확인은 사실 — so "현장 확인"에 CCTV를 흡수해 민감도만 낮춘 THIS wording. Use exactly this. |
| career_6 | 전체 | 경조사 자동화 (dx1과 중복) | **SUPERSEDED — see §8a: full rewrite to the newsletter asset** | done 2026-07-06 (master-confirmed) |

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

## 8. SEO-2 finalized (2026-07-06, master-confirmed)

### 8a. career_6 — full rewrite to the newsletter asset (was a dx1 duplicate)
Audit (subagent, Claude re-verified) found career_6 has ZERO unique assets — it
duplicates dx1 (경조사, GAS+MAKE). Repoint it to a real, live, unused asset:
`hr-newsletter-automation` (github repo 200; live https://lucasung-debug.github.io/hr-newsletter-automation/ 200; targets "오뚜기라면 HR 전략팀").
Master facts: prototype ran DAILY for ~1 month → core curation handed to local
operation, still publishing; ~2 weeks to build, most of it tuning research scope/relevance.

Final case wording (case-studies DB row currently titled "반복 행정 업무 자동화 (DX)"):
- 제목: HR 전략 뉴스레터 자동화
- sub: 뉴스 수집 → AI 분석 → 자동 발송 파이프라인
- desc: GitHub Actions·Python·Gemini 기반 주간 HR 뉴스레터 자동 생성·발송
- 문제: HR 전략팀이 매주 산업·정책 동향을 수동 수집·선별하는 데 시간이 들고 담당자별 품질 편차가 컸음.
- 액션(줄바꿈=항목):
  GitHub Actions 주간 스케줄로 뉴스 API·RSS에서 HR 관련 기사 자동 수집
  중복 제거·관련도 스코어링 후 Gemini로 구조화 요약, 품질 게이트로 발송/보류 자동 판정
  Gmail로 전략팀에 발송하고 GitHub Pages에 아카이브 자동 발행
- 결과(줄바꿈=항목):
  프로토타입을 1개월간 매일 발행하며 파이프라인 안정성 검증, 이후 핵심 큐레이션을 로컬 운영으로 이관해 현재까지 정기 발행 지속
  개발 2주 중 상당 부분을 리서치 범위·관련도 기준 튜닝에 투입해 발송 품질 확보
  HR 전략팀의 주간 수동 동향 리서치를 자동 파이프라인으로 대체
- evidenceUrl: https://lucasung-debug.github.io/hr-newsletter-automation/
- 유형: keep career (do not change 순서/유형; only overwrite the content fields).

### 8b. career_3 — keep evidenceUrl (#case-recruit = 채용 콘텐츠 도구, on-topic);
the "불일치" resolves once its live link is restored in SEO-2b. Only apply the
already-confirmed edits: desc → "직무 분석 기반 채용 공고 개편 — 면접 전환율 2.5배";
본문 "우수 인재(MZ 세대)의" → "우수 인재의".

### 8c. SEO-2b — hermes-ops-dashboard-page repo (SEPARATE repo, local at
projects/portfolio/hermes-ops-dashboard-page). Two "라이브 보기" buttons 404:
`hr-documents.vercel.app`, `ottogi-recruit.vercel.app` (source repos hr-documents /
ottogi-recruit are 200; vercel deploys gone). Fix = repoint each 404 link to a
LIVE target (the source GitHub repo, or the existing demo video already in the
site), codex to inspect the repo and pick the cleanest live replacement; do NOT
rely on re-deploying vercel. This is a code PR on the hermes repo, not Notion.

### 8d. Added gates
- G-S6: after career_6 rewrite + sync, case count still 9; career_6 evidenceUrl
  resolves 200; the 경조사 wording no longer appears in career_6 (only dx1 keeps it).
- G-S7: on the hermes site, no `*.vercel.app` 404 remains under "라이브 보기";
  each replaced link returns 200.

## 9. SEO-1b — GLM-5.2 cross-critique findings (2026-07-06, master-approved)

Fresh-critic pass by GLM-5.2, re-verified by Claude against the live site.
SEO-1/2a/2b are merged + production-verified; this is the additive follow-up.
IMPLEMENTER RULE: use REAL values from content.js / the 사이트 설정 page —
GLM's guessed specifics (e.g. school name) are NOT authoritative; verify each.

Channel: index.html <head> (additive; NEVER touch the tailwind.config-before-CDN
block) + 3 new static files + print.html. Branch codex/seo-1b, PR to main, no merge.

Items:
- 1b-1 [상/하] JSON-LD `sameAs`: add the LinkedIn URL that already exists in
  index.html body (linkedin.com/in/leo-sung — extract the exact href). AEO's
  top lever: lets an answer engine cross-verify the person.
- 1b-2 [상/하] Real `sitemap.xml` + `robots.txt` static files (currently both
  are SPA-fallback index.html → GSC "could not read"). sitemap lists the
  canonical https://smjportfolio.com/ ; robots allows all + points to sitemap.
  Confirm Cloudflare serves the real file (a real file wins over the SPA catch-all).
- 1b-3 [중/하] print.html: add `<meta name="robots" content="noindex,follow">`
  (+ optional canonical to /) so /print doesn't compete with / in name search.
- 1b-4 [중/하] JSON-LD `hasCredential`: from content.js certificationList,
  add EducationalOccupationalCredential entries for the ones with a real
  credentialUrl (GA credential.net, Claude Code skilljar). Skip ones without URL.
- 1b-5 [중/하] Name unification: add `additionalName` for the LinkedIn display
  name (confirm the actual name on the profile/body; do NOT hardcode "Leo Sung"
  without checking the real value).
- 1b-6 [하/하] Wrap Person in `@type: ProfilePage` → `mainEntity: Person`; add
  `knowsLanguage: ["ko","en"]`, `nationality: "KR"`. Add `alumniOf` ONLY with
  the REAL school from the 사이트 설정 page (academic_school) — not a guess.
  Do NOT add HowTo/FAQPage (overkill for a personal portfolio).
- 1b-7 [확인] heroImpactHTML dead code: content.js heroImpactHTML (line ~19,
  "+12%p / –8%p / 0건") is NOT rendered by index.html (grep: 0 refs). The SEO-1
  meta description + JSON-LD description quote these numbers, so they appear in
  search snippets but nowhere on the visible page. FIX: either surface
  heroImpactHTML on the hero, OR change the meta/JSON-LD description to numbers
  that ARE on-screen. Report which and why. (Note: –8%p and –85% are DIFFERENT
  metrics — do not "reconcile" them; GLM conflated them.)
- 1b-8 [보너스] Add `llms.txt` at site root (the evidence site already has one;
  the main portfolio does not) — a short AI-crawler summary of who/what. AEO.

Added gates:
- G-S8: production raw HTML JSON-LD parses and now contains sameAs + hasCredential
  (≥1) + ProfilePage/mainEntity; still no email field.
- G-S9: /sitemap.xml and /robots.txt return REAL content (not <!DOCTYPE html>),
  sitemap references the canonical host.
- G-S10: /print raw HTML contains robots noindex.
- G-S11: /llms.txt returns 200 with real summary text.
- G-S12: no on-screen change except the intended heroImpact fix (Claude checks).
