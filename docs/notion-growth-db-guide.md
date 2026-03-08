# Notion Growth DB Guide

Notion "성장 기록" DB에 항목을 추가할 때 참고하는 가이드입니다.

---

## 1. DB Properties (속성 설명)

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| **제목** | Title | 항목 이름 | `인사관리 기본과정 (직무급 중심)` |
| **유형** | Select | `training` / `activity` / `certification` | `certification` |
| **상태** | Select | `발행` 시 포트폴리오에 반영 | `발행` |
| **카테고리** | Text | 교육 분류 (training용) | `HRM / HRD` |
| **날짜** | Text | 기간 또는 취득일 | `2025.07.07 ~ 09 (18H)` or `2026.01.11` |
| **기관** | Text | 발급/주관 기관 | `Google`, `KPC 한국생산성본부` |
| **설명** | Text | 한 줄 요약 | `GA4 인증` |
| **아이콘** | Text | 이모지 1개 | `📜`, `🗣️` |
| **모달ID** | Text | training 모달 연결 키 (training only) | `hr_basic` |
| **역할** | Text | 직책/역할 (activity only) | `부대훈련총괄담당` |
| **기간** | Text | 활동 기간 (activity only) | `2023.12 ~ 2025.02` |
| **계급** | Text | 계급/수상 (activity only) | `대위(진) ~ 대위` |
| **순서** | Number | 표시 순서 (오름차순) | `1` |
| **상태텍스트** | Text | 이수 상태 표시 (training only) | `수료 완료` |

---

## 2. Body Content Guide by Type

### 2-1. `training` — Modal Content

모달에 표시될 상세 내용입니다. Notion 본문에 아래 구조로 작성하세요.

**Recommended Structure:**

```
📚 Key Learning: [핵심 학습 주제]
- 학습 내용 1
- 학습 내용 2
- ...

💡 My Perspective: [인사이트 제목]
인사이트 설명 텍스트

🚀 Next Step: [현업 적용 계획]
- 적용 계획 1
- 적용 계획 2
```

> **Note:** `모달ID` 속성을 반드시 설정해야 모달이 연결됩니다. 영문 snake_case로 입력 (예: `hr_basic`, `tableau`).

---

### 2-2. `activity` — Accordion Content

아코디언 펼침 시 표시될 내용입니다.

**Recommended Structure:**

```
💡 성과 요약
- 핵심 성과 1
- 핵심 성과 2

🚀 주요 프로젝트: [프로젝트명]
문제: [문제 상황 설명]
해결: [해결 방법 설명]

핵심 역량
[역량 키워드 나열]
```

---

### 2-3. `certification` — Credential Link

자격증/인증서 항목입니다. 본문에 **인증 링크**를 넣으면 클릭 시 새 탭에서 열립니다.

**How to add a credential link:**

1. **Bookmark block (recommended):** Notion 본문에서 `/bookmark` 입력 → 인증서 URL 붙여넣기
2. **Link in paragraph:** 본문 텍스트에 URL 하이퍼링크 추가
3. **File/PDF attachment:** 본문에 파일 첨부

> 링크가 없으면 포트폴리오에서 클릭 불가 카드로 표시됩니다.

**Example:**
- Title: `Google Analytics Certification`
- Org: `Google`
- Date: `2026.01.11`
- Icon: `📜`
- Body: `/bookmark` → `https://www.credential.net/e50ea40f-...`

---

## 3. Setting Up Notion Templates

Notion DB에 템플릿을 추가하면 매번 구조를 기억할 필요가 없습니다.

### Steps:

1. DB 우측 상단 `New` 옆 `▼` 클릭
2. `+ New template` 선택
3. 템플릿 이름 설정 (예: `Training Template`)
4. 속성 기본값 설정 (유형 = `training`, 상태 = `초안`)
5. 본문에 위 가이드 구조를 미리 작성
6. 저장

### Recommended Templates:

| Template Name | 유형 | Pre-filled Body |
|---------------|------|-----------------|
| Training Template | `training` | Key Learning / Perspective / Next Step 구조 |
| Activity Template | `activity` | 성과 요약 / 주요 프로젝트 구조 |
| Certification Template | `certification` | `/bookmark` placeholder |

---

## 4. Pipeline Flow

```
Notion DB (성장 기록)
  ↓ GitHub Actions (sync-notion.yml)
scripts/generate-content.js
  ↓ fetchGrowth()
content.js (certificationList, trainingList, activitiesList)
  ↓ Cloudflare Pages deploy
index.html (dynamic rendering)
```

> **Important:** 항목의 `상태`가 `발행`이어야 포트폴리오에 반영됩니다.
