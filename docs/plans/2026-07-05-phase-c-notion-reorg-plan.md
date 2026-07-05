# Phase C Plan — Notion-Side Reorganization (hub dashboard, renames, cheatsheet, templates)

Date: 2026-07-05
Parent plan: `docs/plans/2026-07-05-notion-sync-ux-improvement-plan.md` (§9; Phases 0/A/B all gates passed 2026-07-05, G-E2E verified in production)
Author: Claude (plan/gates/verification only — no code, no direct Notion writes)
Implementer: codex (everything the Notion API supports) · master (UI-only DB templates, guided)
Status: PROVISIONAL until master approves; gates FREEZE on approval.

## 1. Goal

The operator opens ONE Notion hub page and immediately knows: what is live,
where to edit, which fields actually reach the site, and how to publish.
Today's real incident to prevent from recurring: an edit returned "변경 없음"
because the edited field/row was not part of published site data, and nothing
in Notion explained which fields count.

## 2. Non-Goals

- No code changes in this phase (the alias layer on `main` already tolerates
  the renames). One temporary script + one temporary workflow are allowed and
  MUST be removed in the cleanup commit (see §6 C-4).
- No new Notion databases; no rows edited or deleted; no schema changes beyond
  the two property renames in §5 C-1.
- Do not move, rewrite, or delete the three child databases or the `사이트 설정`
  page on the hub.
- Do not touch the status callout's marker format (`마지막 반영 / 마지막 확인 /
  동기화 실패`) — `scripts/notify-notion.js` finds its callout by these markers.

## 3. Execution Channel

Audit A5 found no local Notion credentials, so all API work runs inside
GitHub Actions where `NOTION_API_KEY` lives:

- New temporary script `scripts/notion-phasec.js` with subcommands:
  `rename-skills` | `build-hub` | `verify`.
- New temporary workflow `.github/workflows/phasec-setup.yml`:
  `workflow_dispatch` with an `action` input, runs
  `node scripts/notion-phasec.js "$ACTION"`, env `NOTION_API_KEY` only.
- Both files are TEMPORARY: after G-C gates pass, a cleanup commit removes them.
- Every subcommand must be IDEMPOTENT (safe to re-run: check-before-create,
  rename only if the old name exists).

## 4. Frozen Gates

- G-C1 (from parent plan): after renames, a manual sync dispatch succeeds and
  site output is unchanged — evidence: the sync run summary shows the same row
  counts using property `상태`, and content.js has no diff (no auto-sync commit).
- G-C2: hub page contains, top to bottom: status callout → quick actions →
  the three databases → cheatsheet → publish steps. All links resolve (sync
  page URL and live-site URL return HTTP 200). Evidence: page fetch + curl.
- G-C3: the notify callout still works after restructure — one dispatch run
  updates the SAME single callout (log says "updated", no duplicate).
- G-C4: temporary script + workflow are deleted; `git log` shows the cleanup
  commit; no `phasec` references remain (grep evidence).
- G-C5 (master walkthrough): creating a new row from each DB template yields
  상태=초안 and the correct 유형 preset; master confirms the cheatsheet answers
  "which fields reach the site" without asking Claude.

## 5. Work Items (codex)

### C-1. Property renames — 스킬 DB only

Notion API: `PATCH /v1/databases/{DB_SKILLS_ID}` with
`properties: { "카테코리": { "name": "카테고리" }, "선택": { "name": "상태" } }`.
- Only rename if the old key exists (idempotency). Log schema before/after
  (property names only).
- The alias layer on `main` covers both directions; the publish filter
  auto-detects the property from live schema, so no code change is needed.
- 케이스/성장 DBs already use `상태` and `카테고리` — do NOT touch them.
- Then trigger one sync dispatch and verify G-C1.

### C-2. Hub page restructure (`Git-Notion Sync`, id 31bc27c2afbf8004a5b6e4b15d1faf9c)

Target layout, top to bottom (append/move blocks via API; keep existing
databases in place; delete only the stray empty paragraph blocks):

1. Status callout — ALREADY EXISTS; keep it the first matching callout.
   Never create another callout whose text starts with the marker words.
2. `⚡ 빠른 실행` (heading_2) + a paragraph of three links:
   - `사이트에 반영하기` → https://hr-ops-portfolio.pages.dev/sync.html
   - `라이브 사이트 보기` → https://hr-ops-portfolio.pages.dev/
   - `GitHub 실행 기록` → https://github.com/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml
3. `✍️ 콘텐츠 편집` (heading_2) — the three existing child databases stay here.
4. `📋 어떤 칸이 사이트에 나가는가` (heading_2) + the cheatsheet below,
   VERBATIM from §7 (Korean, operator-facing). Use heading_3 + paragraphs +
   bulleted lists only (these block types are what the site renderer also
   understands — dogfooding). Tables allowed.
5. `🚀 발행 3단계` (heading_2) + three bullets:
   `① 행의 '상태'를 '발행'으로 → ② '사이트에 반영하기' 클릭 (편집자 비밀번호) → ③ 이 페이지 맨 위 콜아웃에서 결과 확인 (1~2분)`

Idempotency: before inserting each section, check whether a heading with the
same text already exists; skip if so.

### C-3. DB input templates — MASTER (UI-only; the public API cannot create
database templates). Claude delivers a click-by-click Korean guide at
execution time. Presets per template:
- 케이스 스터디 DB: template `새 케이스` — 상태=초안; two variants career/dx
  (or one template + guide line to set 유형).
- 성장 기록 DB: three templates `교육(training)` / `활동(activity)` /
  `자격증(certification)` — 상태=초안, 유형 preset, body placeholder matching
  the cheatsheet's per-type body rules.
- 스킬 DB: template `새 스킬` — 상태=초안 (post-rename name).

### C-4. Cleanup commit

Remove `scripts/notion-phasec.js` and `.github/workflows/phasec-setup.yml`
once G-C1..C-3 evidence is collected. working.md records the evidence.

## 6. Sequencing

C-1 renames → G-C1 → C-2 hub build → G-C2/G-C3 → C-4 cleanup → G-C4 →
C-3 templates (master, guided) → G-C5 walkthrough.
Rollback: renames are reversible by the same API call; hub layout restorable
from Notion page history; cleanup commit is a plain revert.

## 7. Cheatsheet Content (VERBATIM — do not paraphrase)

> 아래 내용은 Claude가 scripts/generate-content.js 정독으로 도출·검증한 것.
> codex는 이 내용을 그대로 Notion 블록으로 옮긴다 (의역 금지).

### 공통 규칙
- 행이 사이트에 나가는 조건: **'상태' 칸이 '발행'** 일 때만. 초안은 절대 안 나감.
- **'순서' 칸의 숫자가 사이트 표시 순서**를 정함 (오름차순).
- 페이지 본문 중 사이트가 이해하는 블록: **제목(대/중/소) · 일반 문단 · 글머리 기호 목록 · 표** 뿐.
  번호 목록·콜아웃·토글·구분선·이미지(수료증 예외)는 **무시됨**.

### 케이스 스터디 DB
- 나가는 칸: 유형(career/dx) · 제목 · 순서 · sub · desc(career 카드 문구) ·
  뱃지(dx) · 문제 · 액션 · 결과 · evidenceUrl(증거 링크)
- ⚠️ **이 DB의 페이지 본문은 사이트에 안 나감** — 내용은 전부 속성 칸에.
- '액션'과 '결과'는 줄바꿈마다 목록 항목 하나가 됨.

### 성장 기록 DB
- 공통으로 나가는 칸: 유형(training/activity/certification) · 제목 · 순서 · 아이콘
- **training(교육)**: 카테고리 · 날짜 · 기관 · 설명 · 상태텍스트 + 본문 첫 이미지/파일
  = 수료증 이미지. '모달ID'가 있으면 본문 전체가 상세 팝업으로 나감.
- **activity(활동)**: 역할 · 기간 · 계급 + 본문 = 활동 상세 내용.
- **certification(자격증)**: 기관 · 날짜 · 설명 + 본문의 첫 북마크/파일/링크 = 증빙 링크.

### 스킬 DB
- 나가는 칸: 스킬명 · 레벨 · 레벨색상 · 카테고리 · 순서
- 카테고리는 다음 4개 중 하나여야 표시됨: Data & Analytics / Automation & Dev /
  HR Tech & AI / Office & Documentation
- 페이지 본문은 안 나감.

### 사이트 설정 페이지
- `key: value` 형식의 줄만 읽힘 (resume_kr, resume_en, portfolio_kr, portfolio_en,
  academic_school, academic_major, academic_period, academic_gpa_total,
  academic_gpa_credits, academic_gpa_major, academic_gpa_major_credits)
- 콜론(:)이 빠지거나 key 철자가 다르면 조용히 무시되니 주의.

## 8. Working Agreements For codex

- Branch `codex/phase-c-notion` from latest `main`; PR to `main`; no merge
  without Claude gate review + master approval. (The PR carries only the
  temporary script/workflow and their later removal — Notion changes happen
  via the dispatched workflow, evidenced in logs.)
- Gates in §4 are FROZEN on master approval. Deviations stop and report.
- No credential values in code, logs, PR, or working.md.
- Log progress in working.md (context → goal → progress → decisions/failures).
- TASK_DONE = per-gate evidence: schema before/after property lists, run ids,
  hub page structure fetch, grep for cleanup. Claude re-verifies independently
  (hub page via master-account fetch).
