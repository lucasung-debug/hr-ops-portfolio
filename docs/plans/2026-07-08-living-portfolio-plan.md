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

## 10. L1 schema CORRECTION (2026-07-08) — codex PR #17 must be reworked

Claude built the 경력 DB; master then FINALIZED a richer schema. PR #17 parses the
OLD draft field names (한줄요약/핵심성과/기간) → they don't exist → period/summary/
achievements render BLANK. This is a timing mismatch, not a codex error. Rework
required before merge. Actual schema + careerHistory mapping (verified via fetch):

- 회사 (title) → company
- 직책 (text) → position
- 재직기간 (DATE: date:재직기간:start / :end) → build a display string:
  if 재직상태 = "재직 중" OR end empty → "{YYYY.MM} ~ 재직 중"; else "{start} ~ {end}".
  NOTE: prop() has NO 'date' case — codex MUST add date handling (read the expanded
  start/end, not prop(row,'기간')).
- 업무요약 (text) → summary   (was 한줄요약)
- 업무상세 (text; one achievement/line, <br>-separated) → details  (was 핵심성과)
- 구분 (select 정규직/계약직/파견직/인턴/기타) → employmentType — show as a small
  label/badge on each role.
- 재직상태 (select 재직 중/퇴사/기타(휴직 등)) → drives the "재직 중" state (NOT hardcoded).
- 퇴사사유 (text) → **PRIVACY GATE: this holds 이직 희망 사유 ("정규직으로 안정성
  확보 희망"). It MUST NOT render on the public main page (the current employer could
  see it). Include it ONLY in career.html (경력기술서, noindex, submission-time PDF),
  and even there consider it optional.**
- 상태 (초안/발행) → publish filter; 순서 (number) → sole sort (asc = newest first).

Current DB rows (Claude-entered, master-refined):
- (주)드림어스컴퍼니 · 계약직 · 매니저 · 2026.06.23~재직 중 · 순서 1 · 상태 초안
  (조직문화·교육·채용·기업 AX/인사 자동화 담당 — the AI-era HR positioning core).
- 오뚜기라면(주) · 정규직 · 인사팀 사원 · 2025.03~(퇴사, end month TBD by master) ·
  순서 2 · 상태 발행.
- 군 복무: EXCLUDED from 경력 DB (already covered in the 활동 section as achievement
  language; master said "애매하면 제외"). Decision: excluded.

Master to confirm/fill: 오뚜기 퇴사월 (재직기간 end) + 퇴사사유(optional); whether to
flip 드림어스 상태 초안→발행 when ready.

## 11. Schema update (2026-07-08) — 부서명 field added by master

Master added a `부서명` (text) field and split 직책. Current mapping addition for
codex rework (§10): 부서명 → department; 직책 → position (title within dept).
Display convention on the site: "{회사} · {부서명} · {직책}" (e.g. 오뚜기라면(주) ·
인사팀 · 사원). Also: 업무상세 must be REAL job duties entered by master — NOT
portfolio-case spin (Claude's earlier 오뚜기 각색 was removed; master fills real
duties like the 드림어스 row). 오뚜기 재직기간 confirmed 2025-03-13 ~ 2026-04-12.

## 12. Phase L1.5 — sensitive-info tiers + submission 경력기술서 with field toggles

Master decision (2026-07-08): sensitive = 퇴사/이직 사유 · 연봉/희망 처우 · 상세
연락처/주소. Photos/증빙 stay public. Protection = Cloudflare Access.

Principle (non-negotiable): sensitive data NEVER enters the public content.js.
The public site cannot leak what it never contains.

### Two data outputs from the one 경력 DB (+ 사이트 설정)
- `content.js` (PUBLIC) — sensitive fields OMITTED entirely (no 퇴사사유, no
  연봉, no 상세연락처). This is what smjportfolio.com serves.
- `career-private.js` (BEHIND ACCESS) — includes sensitive fields; written by sync
  ONLY under a path guarded by Cloudflare Access.

### Access boundary
- Move 경력기술서 to the `/career/` path (career.html + career-private.js live there).
- Master sets a Cloudflare Access policy on `/career*` (email allowlist = master),
  same mechanism as admin/preview. Public site (`/`, `/content.js`) stays open.
- career.html reads career-private.js (available only after Access auth).

### Field toggles (the "필요한 곳은 넣고 안 필요한 곳은 뺀다")
- career.html renders checkboxes: [ ] 연봉/희망처우  [ ] 이직/퇴사 사유
  [ ] 상세 연락처/주소.  Toggling shows/hides that section; then browser-print →
  a per-employer PDF. Default = all OFF (safest). Pure client-side; no data leaves.
- Print CSS respects the toggles (hidden sections absent from the PDF).

### New fields to add (Claude via MCP, before codex)
- 경력 DB: `연봉` (text, e.g. "4,200") and/or `희망처우` (text) — per-role or overall.
- 사이트 설정 page: `phone`, `address` as private keys — but these must route ONLY
  to career-private.js, NEVER to content.js (parser must tag them private).

### codex work (L1.5, after L0/L1 merge)
- Split the generator: emit content.js (public, sensitive-stripped) AND
  career-private.js (full). A single allow-list of PUBLIC fields drives content.js;
  everything else stays private.
- Move career.html under /career/; add the toggle UI + print CSS; read career-private.js.
- Do NOT put career-private.js in sitemap; noindex; rely on Access for real protection
  (noindex is not access control — Access is).

### Gates
- L15-G1: `curl https://smjportfolio.com/content.js` contains NONE of: 퇴사사유,
  연봉, phone, address, departureReason (grep = 0).
- L15-G2: `/career/` returns Cloudflare Access login when unauthenticated.
- L15-G3: authenticated career.html with all toggles OFF prints a PDF with zero
  sensitive fields; toggling 연봉 ON adds only that section.
- L15-G4: career-private.js is NOT referenced by content.js or index.html.

### Sequencing
PR #17 (L0/L1 + departureReason removed from PUBLIC content.js) merges FIRST —
it already establishes "sensitive out of content.js" for 퇴사사유. L1.5 generalizes
it to all sensitive fields + the Access-protected toggled 경력기술서.
Master prereqs for L1.5: fill 연봉/희망처우 + phone/address in Notion; set the
Cloudflare Access policy on /career* (Claude guides click-by-click).

## 13. L1-REDESIGN (2026-07-08) — per-career carousel (헤더+케이스+업무 grouped by employer)

INCIDENT: publishing 드림어스 merged it with 오뚜기 — the L1 header went dynamic
(careerHistory) but KEY PROJECTS + OPERATIONS stayed the flat 오뚜기 case set, so
오뚜기 work rendered UNDER the 드림어스 header. Root cause: cases have no employer
link. RECOVERY DONE: 드림어스 → 초안, synced, 오뚜기-only restored.

Master decision: a per-career CAROUSEL. Each career card = that employer's header
+ ONLY that employer's cases + that employer's 업무. Arrow/dots to switch careers.
Case↔career link = a new field on the case-studies DB (master chose "field add").

### Data
- Case-studies DB: add `소속경력` (SELECT) whose option values EXACTLY equal the
  경력 DB 회사 titles ("오뚜기라면(주)", "(주)드림어스컴퍼니", …). Tag ALL existing
  cases (career_1..6 + dx1..3) = "오뚜기라면(주)". (Claude via MCP.)
  - Matching key is the exact company string; a mismatch = a case silently drops
    from every card. Consider a normalize step (trim) in the generator.
- generate-content.js: emit `company` (from 소속경력) on each careerProject and
  dxCase. Group at render time by careerHistory company.
- careerHistory already carries company/period/details per employer.

### UI (index.html career section → carousel)
- Render N career cards in careerHistory 순서 (order asc = newest first, 드림어스
  first once published). Prev/next arrows + dots; card = 헤더(careerHistory[i]) +
  KEY PROJECTS(cases where company==this) + OPERATIONS(careerHistory[i].details).
- Empty-cases career (드림어스 now) → show details only, no empty projects grid.
- Keyboard/swipe optional; respect prefers-reduced-motion; match current visual
  style (master: no redesign of the look, only the carousel mechanism).
- Deep-link/anchor (#career) still lands on the section.

### Privacy / SEO carryover
- No sensitive fields (already stripped). career carousel is public (non-sensitive).
- Cases moving between careers must not break the evidence links / modals.

### Gates
- L13-G1: publishing 드림어스 shows a 드림어스 card with ONLY 드림어스 업무 (zero
  오뚜기 cases under it); 오뚜기 card holds all 오뚜기 cases. No merge.
- L13-G2: a case with an unset/mismatched 소속경력 is reported by the sync summary
  (fail-loud), not silently dropped.
- L13-G3: with one career only (오뚜기), the carousel degrades to a single static
  card (no broken arrows).
- L13-G4: existing case modals + evidence links still work from inside a card.
- L13-G5: no on-screen regression to the rest of the page; counts unchanged.

### Refutation targets (codex/GLM)
1. SELECT company-string matching vs a real Notion relation — drift risk when a
   company is renamed? Argue.
2. Carousel state when careers=1 vs many; SSR/raw-HTML first-card visibility for
   crawlers (does the current role show in raw HTML, or only after JS?).
3. Where do dxCases render per-career — same grid as careerProjects, or separate?
4. Does grouping break the existing #dxcase / evidence anchors?
5. Anything simpler than a carousel that still separates employers (e.g. stacked
   sections per employer)? Challenge the carousel itself.

### Sequencing
Plan → codex+GLM refutation → Claude counter-verify → freeze → Claude adds 소속경력
field + tags existing cases via MCP → codex builds → gate review → merge → master
re-publishes 드림어스 to see the current role correctly separated.

## 14. L1-REDESIGN v2 (2026-07-09) — STACKED per-employer sections (§13 carousel RETIRED)

Triple refutation (codex + GLM-5.2 + Grok) CONVERGED: carousel loses to stacked
(current role 드림어스 has 0 cases → weakest slide first; a11y/SEO/raw-HTML cost;
N≈2 over-engineered). Master chose STACKED. §13 carousel is RETIRED.

### Data-model clarification (the real mess the refuters exposed)
Three overlapping things must get distinct roles:
- **KEY PROJECTS** = case-studies DB (careerProjects + dxCases), linked to an
  employer via a NEW `소속경력` SELECT (values = 경력 DB 회사 title, exact).
- **OPERATIONS** = 경력 DB `업무상세` (details), per employer, the day-to-day
  duties that are NOT standalone cases.
- FIX the data: Claude's earlier 오뚜기 `업무상세` = case-summary (duplicates
  KEY PROJECTS) → REPLACE with the real Operations list currently hardcoded at
  index.html:516-524 (도급/파견 정산·노무비 대시보드·정부 인건비·대관·노사협의회·
  글로벌 심사·행사). 드림어스 `업무상세` (온보딩·블로그·채용·AX) already reads as
  Operations — keep. (Claude via MCP, after freeze.)

### Generator (fail-loud, not silent — kills B1)
- Read `소속경력` per case → emit `company`. VALIDATE: every published case must
  have a 소속경력 that matches a careerHistory 회사; on empty/mismatch, the sync
  summary WARNS with the case title (fail-loud, like missingSettings). No silent drop.
- Normalize (trim) both sides before matching to avoid the "오뚜기라면" vs
  "오뚜기라면(주)" drift Grok flagged.

### UI — stacked sections (index.html)
- Replace the singleton career block with N employer sections in careerHistory
  순서 (드림어스 → 오뚜기), each = 헤더(careerHistory[i]) + KEY PROJECTS(cases
  where company==this, career grid + dx sub-block) + OPERATIONS(details[i]).
- RETIRE (explicit, per refuters): static header block index.html:487-506,
  renderCareerHeader :805, updateCareerDuration :1082, static Operations :516-524.
  Keep openModal/openDxModal + the data-action delegation (:1179) intact.
- Empty-cases employer (드림어스 now) → render 헤더 + OPERATIONS only, no empty grid.
- Preserve anchors: `#career` lands on the section; `#dxcase` still resolves
  (dx cases keep their ids/modals inside their employer section — do NOT drop DX).

### SEO / a11y (now GATES, not optional — per refuters M3/M4)
- Raw-HTML: the CURRENT role's company/title must be present in server-served HTML
  (not JS-only) OR a `<noscript>` fallback — do not regress SEO-1b's crawler
  visibility. Decide: generator can inline the first employer's header into
  index.html at build, or a noscript block.
- Keyboard/ARIA/reduced-motion: required. Stacked has no hidden state so this is
  cheap, but it is a gate.

### Scope check
- print.html: verify whether it renders a career section; if yes, group by employer
  the same way; if no, out of scope (state which).
- career.html (경력기술서) already stacks per employer — reuse its structure/idea.

### Gates
- L14-G1: 드림어스 published → 드림어스 section shows ONLY 드림어스 Operations,
  ZERO 오뚜기 cases; 오뚜기 section holds all 오뚜기 cases. No merge/bleed.
- L14-G2: a published case with empty/mismatched 소속경력 → sync summary WARNS
  (named), case not silently dropped.
- L14-G3: current-role company/title present in raw HTML or noscript (SEO gate).
- L14-G4: keyboard-reach + ARIA + reduced-motion verified (a11y gate).
- L14-G5: #career + #dxcase anchors + all case modals + external #case-* evidence
  links still work; page counts unchanged; no visual regression elsewhere.

### Sequencing
Freeze on master approval (refuters already applied) → Claude via MCP: add 소속경력
SELECT to case-studies DB, tag all existing cases = 오뚜기라면(주), replace 오뚜기
업무상세 with the real Operations list → codex builds stacked UI + generator
validation → gate review → merge → master re-publishes 드림어스 (now separated).
