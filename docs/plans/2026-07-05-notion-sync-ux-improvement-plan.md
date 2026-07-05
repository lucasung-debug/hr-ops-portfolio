# Notion Sync UX Improvement Plan (Approach B)

Date: 2026-07-05
Author: Claude (orchestrator — planning/quality/verification only)
Implementer: codex (code phases). Claude does NOT modify code in this plan.
Status: PROVISIONAL until master approves; gates FREEZE on approval.

## 1. Problem And Goal

Operator profile: non-developer. Usage pattern: rarely edits, then batch-edits
right before job-application events.

Confirmed pain points (operator interview, 2026-07-05):

1. Forgets which fields to fill on each visit (3 DBs, inconsistent property names).
2. Edits are invisible until the next daily cron (KST 09:00) and there is no
   confirmation that an edit reached the site.
3. Entry path into the right Notion pages is cumbersome.
4. Notion body formatting support on the site is narrow (out of scope here — Phase D, deferred).

Goal (one sentence): the operator can open one Notion hub page, edit with
self-explanatory templates, press one button, and see confirmation inside
Notion that the site is updated — within ~2 minutes.

## 2. Non-Goals (do not do these)

- No build tools, no framework. Pure HTML/JS/Tailwind CDN only (CLAUDE.md).
- No Notion API key in any frontend code.
- No `EDITOR_TOKEN` or GitHub PAT hardcoded anywhere in the repo.
- No Notion block-renderer expansion in this pass (deferred to Phase D).
- No change to branding-locked strings in `index.html` / `content.js` hardcoded section.
- No renaming of Notion DB properties inside code — code already supports aliases.

## 3. Roles

| Who | Does |
|---|---|
| master | Phase 0 prerequisites (tokens/capabilities), final approvals, live-site checks |
| codex | Phase A and Phase B implementation on a feature branch + PR |
| Claude | This plan, gate verification on PR (adversarial review), Phase C Notion edits via MCP after master approval |

## 4. Frozen Gates (summary — verify each with evidence, not self-report)

- G-A1: `POST /api/sync` with wrong/missing token returns 401. With correct token returns 2xx and a new `sync-notion.yml` workflow run appears on `main` within 60s.
- G-A2: `sync.html` works end-to-end in a browser: enter editor password → click → visible success state. No secrets in repo (grep for token values returns nothing).
- G-A3: `node --check` passes; no new npm dependency added outside `scripts/` (Pages Functions must stay dependency-free).
- G-B1: after a triggered run with NO Notion changes, the hub-page status callout shows an "unchanged" message with a fresh KST timestamp.
- G-B2: after a run WITH a real content change, the callout shows "updated" plus row counts (cases/growth/skills/assets).
- G-B3: notify step can never fail the sync: simulate notify failure (bad block id) → workflow still succeeds and commit behavior is unaffected.
- G-C1: after property renames in Notion (`카테코리`→`카테고리`, `선택`→`상태`), a manual dispatch run succeeds and site output is unchanged.
- G-E2E: full walkthrough — master edits one Notion field, presses the button on `sync.html`, sees the Notion callout update, and sees the change live on the site, all within ~2 minutes.

## 5. Phase 0 — Prerequisites (master, with Claude guidance; blocking for A/B)

P0-1. GitHub fine-grained PAT for triggering the workflow:
  - GitHub → Settings → Developer settings → Fine-grained tokens → Generate.
  - Repository access: ONLY `lucasung-debug/hr-ops-portfolio`.
  - Permissions: Actions = Read and write. Nothing else.
  - Store as Cloudflare Pages environment variable `GH_WORKFLOW_TOKEN`
    (Pages project → Settings → Environment variables, Production).
  - NEVER paste the token into chat, code, or docs.

P0-2. Notion integration write capability:
  - The existing integration (used by `NOTION_API_KEY`) must have
    "Update content" + "Insert content" capabilities and access to the
    `Git-Notion Sync` hub page. Verify in Notion → Settings → Connections.

P0-3. Status callout block:
  - Create one callout block on the `Git-Notion Sync` hub page with initial
    text: `마지막 반영: (아직 없음)`.
  - Copy its block ID (Copy link to block → the 32-char id after `#`).
  - Store as GitHub Actions repository **variable** (not secret)
    `NOTION_SYNC_STATUS_BLOCK_ID` (repo → Settings → Variables → Actions).
  - Claude can create this block via Notion MCP on master approval; master
    copies the id.

## 6. Phase A — "Sync now" button (codex)

New files only; do not touch existing pages except one link no-op (none required).

### A-1. `functions/api/sync.js` (new Cloudflare Pages Function)

Follow the existing pattern in `functions/api/content.js` (respond helper,
CORS/security headers, Bearer parsing). Behavior:

- `POST /api/sync`
  - Auth: `Authorization: Bearer <token>`; token must equal `env.EDITOR_TOKEN`
    (identical check to `content.js` PUT). Missing/mismatch → 401 JSON.
  - Action: `fetch('https://api.github.com/repos/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml/dispatches', { method:'POST', headers:{ 'Authorization': 'Bearer ' + env.GH_WORKFLOW_TOKEN, 'Accept': 'application/vnd.github+json', 'User-Agent': 'hr-ops-portfolio-sync' }, body: JSON.stringify({ ref: 'main' }) })`
    - Note: GitHub REST requires a `User-Agent` header. GitHub returns 204 on success.
  - Success → `{ ok: true }` with status 202.
  - GitHub error → status 502 with `{ error: 'GitHub dispatch failed' }`
    (do NOT echo GitHub response bodies or any token).
  - `env.GH_WORKFLOW_TOKEN` missing → 500 `{ error: 'Server not configured' }`.
- `OPTIONS` → 204 with same CORS headers as `content.js`.
- No rate limiting in v1 (token-gated, single operator). Add a
  `// ponytail:` style note naming this ceiling.

### A-2. `sync.html` (new static page)

- Same look-and-feel stack as `admin.html`: Tailwind CDN + Pretendard, `lang="ko"`.
- Content: title "사이트 반영", one password input (type=password, placeholder
  `편집자 비밀번호`), one primary button `지금 사이트에 반영`, one status area.
- On click: `fetch('/api/sync', { method:'POST', headers:{ 'Authorization': 'Bearer ' + token } })`.
  - 202 → status area: `✅ 동기화 시작! 1~2분 뒤 Notion 허브의 '마지막 반영' 칸을 확인하세요.`
    plus two links: the Notion hub page URL and the GitHub Actions runs URL
    (`https://github.com/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml`).
  - 401 → `비밀번호가 올바르지 않습니다.`
  - other → `동기화 요청 실패 — 잠시 후 다시 시도하세요.`
- Keep it under ~120 lines. No polling in v1.
- All user-facing text in Korean.

### A-3. Verification evidence codex must attach (Claude re-checks)

- `curl -X POST .../api/sync` without token → 401 body shown.
- `curl` with correct token (master runs locally, token not in logs) → 202,
  and `gh run list --workflow sync-notion.yml --limit 1` shows a fresh run.
- `grep -rn "ghp_\|github_pat_\|EDITOR_TOKEN\s*=" --include="*.html" --include="*.js" .` → no hardcoded secrets (env references excluded).

## 7. Phase B — Sync result written back into Notion (codex)

### B-1. `scripts/generate-content.js` (small addition, surgical)

- After building content, also write a machine summary to
  `scripts/.sync-summary.json`:
  `{ cases, career, dx, growth, training, activities, certifications, skills, skillCategories, assets, contentBytes }`
  using numbers already computed for `printSyncSummary`.
- Add `scripts/.sync-summary.json` to `.gitignore` (tracked file; one line).
- Do not restructure existing functions; keep the diff minimal.

### B-2. `scripts/notify-notion.js` (new)

- Usage: `node scripts/notify-notion.js <changed|unchanged|failed>`.
- Env: `NOTION_API_KEY`, `NOTION_SYNC_STATUS_BLOCK_ID`.
- Reads `scripts/.sync-summary.json` if present.
- Updates the callout block (`notion.blocks.update`, rich_text single line):
  - changed:   `✅ 마지막 반영: {YYYY-MM-DD HH:mm KST} — 변경 반영됨 · 케이스 {n} · 성장 {n} · 스킬 {n} · 이미지 {n}`
  - unchanged: `✅ 마지막 확인: {timestamp KST} — 변경 없음 (사이트가 이미 최신)`
  - failed:    `❌ 동기화 실패: {timestamp KST} — GitHub Actions 로그 확인 필요`
- MUST be failure-safe: wrap everything in try/catch, log a warning, always
  `process.exit(0)`. A broken notification must never break the sync (G-B3).
- KST formatting: use `Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', ... })`.

### B-3. `.github/workflows/sync-notion.yml` (edit commit step + add notify step)

- Restructure the final step so the commit outcome is captured:

```yaml
      - name: Commit and push if changed
        id: commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content.js
          if [ -d assets/notion ]; then git add assets/notion; fi
          if git diff --staged --quiet; then
            echo "outcome=unchanged" >> "$GITHUB_OUTPUT"
          else
            git commit -m "chore: auto-sync content from Notion"
            git pull --rebase
            git push
            echo "outcome=changed" >> "$GITHUB_OUTPUT"
          fi

      - name: Notify Notion (status callout)
        if: always()
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_SYNC_STATUS_BLOCK_ID: ${{ vars.NOTION_SYNC_STATUS_BLOCK_ID }}
        run: node scripts/notify-notion.js "${{ steps.commit.outputs.outcome || 'failed' }}"
```

- Preserve existing behavior exactly when nothing changed (no commit).
- If `NOTION_SYNC_STATUS_BLOCK_ID` is unset, notify script logs and exits 0.

### B-4. Verification evidence codex must attach

- One dispatch run with no Notion edits → Actions log shows notify ran with
  `unchanged`; Claude/master confirm the callout text updated in Notion.
- One dispatch run after a trivial Notion edit (master flips one field) →
  callout shows `변경 반영됨` with counts; a single auto-sync commit exists.
- Simulated failure: run notify locally with a bogus block id → exits 0,
  prints warning (paste output).

## 8. Phase C — Notion-side reorganization (master + Claude via MCP; AFTER A/B are live)

C-1. Property renames (safe due to alias layer already on `main`):
  - 스킬 DB: `카테코리` → `카테고리`; `선택` → `상태`.
  - Then run one manual sync and verify G-C1.
C-2. Hub page becomes the single entry point ("관제탑"):
  - Top: status callout (from P0-3) + `사이트 반영` link (`sync.html`) + live site link.
  - Middle: three big links — 케이스 스터디 DB / 성장 기록 DB / 스킬 DB.
  - Each DB gets a Notion template with required properties preset
    (`상태=초안`, correct `유형`, placeholder guidance in body).
  - One-page cheatsheet: "발행하려면 상태를 '발행'으로 → sync.html에서 반영 → 콜아웃 확인".
C-3. All Notion edits are proposed by Claude, approved by master before writing.

## 9. Sequencing And Rollback

Order: Phase 0 → A → B → (verify E2E) → C. A and B may share one branch/PR.
Each phase independently revertable:
- A: delete `sync.html` + `functions/api/sync.js`.
- B: revert workflow step + delete notify script (generator summary write is inert).
- C: rename properties back (aliases cover both directions).

## 10. Working Agreements For codex

- Follow karpathy guidelines: minimal surgical diff, no drive-by refactoring,
  match existing code style (Korean comments OK — repo convention), keep new
  functions short.
- Branch: `codex/notion-sync-ux-b` from latest `main`. PR to `main`; do not merge
  without Claude gate review + master approval.
- Preserve LF/CRLF hygiene: normal diff and `--ignore-all-space` diff must match.
- TASK_DONE must include: file list, gate-by-gate evidence (curl outputs, run
  ids, screenshots or callout text), and any deviation from this plan flagged
  explicitly. Deviations require plan revision (Act phase), not silent edits —
  gates are frozen for the implementer.

## 11. Deferred (Phase D backlog, not in this pass)

- `notionBlocksToHtml()` expansion: numbered lists, callouts, dividers, nested lists.
- Documented block-support matrix in the hub cheatsheet.
- sync.html run-status polling (public repo Actions API allows unauthenticated reads).
