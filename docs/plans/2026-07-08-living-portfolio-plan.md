# Living Portfolio & Career Statement Plan

Date: 2026-07-08
Author: Claude/Fable (plan draft). Adversarial reviewer: codex (mission = REFUTE this plan, not implement).
Status: v0.2 FROZEN 2026-07-08 (dual refutation applied — codex + GLM-5.2 — Claude counter-verified, master approved). §9 is AUTHORITATIVE; §4/§5 are SUPERSEDED by §9. Implementers execute toward §9 gates and MUST NOT edit them.

## 1. Master's intent (verbatim distillation, 2026-07-08)

- Current design is fine — do NOT redesign.
- The portfolio must be a LIVING intro page: master can easily update "지금 하는
  도메인·경험·역량" at any time. (Career changed: 오뚜기라면 인사팀 퇴사 → gap →
  current CONTRACT role; site still shows the old employer.)
- print.html (PDF submission flow) stays — it exists for file submissions.
- The 이력서(résumé) download section at the site is NOT needed.
- A 경력기술서 (career statement) IS wanted: a file that sets tech aside and
  organizes DOMAIN experience in prose, with numbers-first results/achievements —
  the artifact that actually helps experienced-hire moves.
- resume-platform skill is a half-built, low-quality abandoned attempt — do NOT
  build on it; think fresh.

## 2. Root-cause fact (measured)

scripts/generate-content.js:730-743 hardcodes the MOST volatile data — profileTitle,
companyName("오뚜기라면 인사팀"), email, heroSubtitle/Description/Headline/Impact —
while the least volatile (학력, GPA, download links) is Notion-editable via the
사이트 설정 page the pipeline already parses. The design is inverted; this is the
physical reason updates feel hard. (Prior over-scoped "career hub" idea was refuted
2026-07-08; this plan is the scoped-down survivor.)

## 3. Non-goals

- No visual/design overhaul; no new frameworks; pure HTML/JS stays.
- No LinkedIn automation (no API exists — paste-only, permanently out of scope).
- No auto-résumé generator; no resume-platform revival.
- print.html untouched.
- No changes to case-study/growth/skills DB schemas.

## 4. Phase L0 — un-hardcode identity + hero (code, small PR)

Move to 사이트 설정 page keys (parser already exists; key: value lines):
`profile_title`, `company_name`, `hero_subtitle`, `hero_description`,
`hero_headline_html`, `hero_impact_html`.
- Fallback rule: if a key is missing/empty → use the CURRENT hardcoded string as
  default (site can never render blank; fail-safe).
- Keep hardcoded: profileName/En (names don't change), email, lastUpdated (auto).
- Remove the 이력서 download buttons from index.html (keep 포트폴리오 PDF buttons);
  confirm print.html QR/downloads flow unaffected.
- CLAUDE.md branding-rule re-scope (needs master approval): the frozen headline/badge
  copy stops being "code-frozen" and becomes "master-owned via Notion — AGENTS must
  still never change them; master edits freely." Guardrail intent kept, mechanism moved.

Gates (provisional):
- L0-G1: master changes company_name in Notion → sync button → live in ≤2 min,
  zero code edits.
- L0-G2: with no Notion keys set, rendered site is byte-identical to today
  (fallback proof).
- L0-G3: 이력서 buttons gone, 포트폴리오 PDF buttons + print.html flow intact.
- L0-G4: hero fields flow into meta description/JSON-LD consistently or the head
  stays static-but-true (decide: head stays as-is since it cites on-screen numbers;
  flag if hero numbers change later).

## 5. Phase L1 — 경력 DB + 경력기술서 page (code + Notion, medium PR)

- New Notion DB `경력` on the hub page, minimal schema:
  회사(title) · 직책 · 기간(text, e.g. "2024.01 – 2025.12") · 한줄요약 ·
  핵심성과(rich text; one line per achievement; NUMBERS-FIRST convention:
  each line leads with the metric) · 상태(초안/발행) · 순서(number).
- generate-content.js: fetch via the existing publish-filter util → `careerHistory`
  in content.js. New env: NOTION_DB_ID_CAREER (GitHub secret; master shares DB with
  the integration — known drill).
- New `career.html` = 경력기술서: print-optimized A4, numbers-first layout
  (metric leads each bullet, large; prose stays domain-focused, tech set aside),
  noindex + excluded from sitemap, follows the proven print.html pattern.
  Master opens → browser print → PDF file for submissions. Reads content.js →
  ALWAYS current ("살아있는 파일").
- The site's main page does NOT change in L1 (career.html is a standalone output).

Gates (provisional):
- L1-G1: every 발행 row renders in 기간-order with numbers-first bullets.
- L1-G2: career.html has noindex and is absent from sitemap.xml.
- L1-G3: browser-print produces a clean A4 PDF (no nav/buttons in print media).
- L1-G4: sync summary reports the new DB count; existing counts unchanged.

## 6. Phase L2 — content repositioning (editorial, no infra)

After L0: master (with Claude review support) rewrites via Notion —
current contract role, hero copy for the "HR 도메인을 키우며 AI 활용을 계속
고민하는 성장형 인재" positioning, and case ordering. Candidate new material:
the newsletter pipeline, GPT-agent work, and this portfolio's own automation
as an AI-era case. Pure content; uses L0's new keys; B-2-style review loop.

## 7. Open questions (explicit refutation targets for codex)

1. 경력 DB vs existing 케이스 DB: should roles be a 4th DB, or rows in the case DB
   with 유형=role? Argue for/against merge (schema noise vs pipeline simplicity).
2. 기간 as free text vs start/end dates (sorting & future timeline use).
3. career.html exposure: public+noindex enough, or should it sit behind
   Cloudflare Access like admin? (It contains employer history — already on the
   public site today, but argue it.)
4. Removing 이력서 buttons in L0 (code) vs leaving them and just clearing the
   Notion download keys (content-only) — which is cleaner?
5. L0 fallback duplication: defaults live in code AND Notion — drift risk. Better
   pattern? (e.g., fail-loud if key missing instead of silent fallback?)
6. Anything in §4-§6 that repeats the refuted "career hub" over-engineering?

## 8. Sequencing

L0 (small PR, unblocks everything) → master updates current-role content same day →
L1 (경력기술서) → L2 (repositioning editorial). Each phase independently shippable.

## 9. Revision v0.2 — after dual refutation (codex + GLM-5.2, Claude counter-verified)

Verdicts (all re-measured by Claude): B1/B2 CONFIRMED (index.html:494 hardcodes the
employer block, 0 refs to companyName; settings parser is school-fallback-only with
a closed keyMap). codex's gate contradiction + heroImpact/print findings CONFIRMED.
GLM M1/M2/M4 CONFIRMED. **GLM M3 REFUTED** — sync.html + /api/sync exist on main and
serve 200 in production (built and E2E-verified this week; reviewer likely read a
stale checkout). L1-기간 gate conflict CONFIRMED → order by 순서.

§4/§5 are SUPERSEDED by the following:

### L0 (revised) — parser + hero + head evergreen + buttons (small PR)
- Settings body parser: parse key:value lines ALWAYS (not only when school empty);
  extend keyMap with `hero_headline_html`, `hero_description` (the two fields
  updateHero actually reads). Values are single-line by convention (HTML with <br>
  allowed on one line); fail-loud at sync (warn in summary, per existing
  missingSettings pattern), silent-safe at render (fallback to current copy).
- Remove the hardcoded 이력서 CTA buttons (hardcoded Drive href — Notion-key
  clearing cannot remove them; code removal is correct). 포트폴리오 PDF CTA stays
  and becomes the primary.
- **Drop `worksFor` from JSON-LD** — the only head field that rots with job changes
  (and is already false today). Head becomes permanently true; no manual checklist.
- Do NOT move company_name to settings — superseded by L1 (the stale employer
  display is the CAREER SECTION, not the hero).
- Gates: L0-G1 hero headline/description editable via Notion ≤2min zero-code;
  L0-G2 rendered site identical EXCEPT intended removals (이력서 buttons, worksFor);
  L0-G3 sync summary warns when hero keys missing; L0-G4 print flow intact
  (print content changing with content.js is INTENDED living-doc behavior).

### L1 (revised) — 경력 DB feeds BOTH the main career section and career.html
- 경력 DB (4th DB confirmed by both reviewers): 회사(title) · 직책 · 기간(free text,
  display-only) · 한줄요약 · 핵심성과(one line per achievement, numbers-first) ·
  상태(초안/발행) · 순서(number; sole sort key).
- generate-content.js → `careerHistory` in content.js.
- index.html career-section header block (the :494 hardcode) is REWIRED to render
  from careerHistory (top row = current role; "재직 중" comes from data).
- career.html 경력기술서: A4 print-optimized, numbers-first, noindex + absent from
  sitemap, print.html pattern. Redaction note: contains only what the public site
  already shows; anything sensitive stays out of the 경력 DB by policy.
- Gates: L1-G1 renders 발행 rows in 순서-order; L1-G2 index career section shows the
  CURRENT contract role with zero code edits after DB row edit; L1-G3 career.html
  noindex + not in sitemap + clean A4 print; L1-G4 existing counts unchanged.

### Also adopted
- admin.html's hero/company inputs are dead weight (KV loses to content.js) —
  flagged; cleanup deferred to a separate small task, documented here.
- L0+L1 ship as one train (L0 alone does not fix the stale employer — codex).
- L2 unchanged (editorial repositioning after the train).

Status: v0.2 ready for freeze on master approval (or one more codex pass on §9 only).
