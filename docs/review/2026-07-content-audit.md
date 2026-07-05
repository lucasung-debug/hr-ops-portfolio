# 2026-07 Content Audit

Source: `content.js` on latest `main`.
Source commit: `b4c68a6ad83bb9caae25013f44f83f2e0f380405`.
Mode: read-only content audit. Facts only; no rewrites or tone suggestions.

## Coverage Summary

| Group | Count | Gate target | Status |
|---|---:|---:|---|
| Cases (career + dx) | 9 | 9 | PASS |
| Growth (training + activities + certifications) | 12 | 12 | PASS |
| Skills | 13 | 13 | PASS |
| Total inventory rows | 34 | 34 | PASS |

## Inventory Table

| Section | ID | Title | Title chars | Summary chars | Body text chars | Numbers / metrics quoted | URL fields |
|---|---|---|---:|---:|---:|---|---|
| career case | career_1 | ATS(채용관리솔루션) 도입 | 15 | 58 | 457 | 8주, 6주, 4주, 27% | evidenceUrl=MISSING |
| career case | career_2 | 근태 리스크 예방 프로세스 | 14 | 51 | 421 | 52시간, 45시간, 2주, 144명, 21명, 2건, 0건, 5% | evidenceUrl=MISSING |
| career case | career_3 | 직무 분석 기반 채용 홍보 | 14 | 44 | 414 | 6%, 15%, 0.3%, 0.5%, 13회, 2회 | evidenceUrl=https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-recruit |
| career case | career_4 | 근태기 루트 효율화 | 10 | 52 | 470 | 2주, 3대, 73%, 85%, 12%p, 100건, 15건, –85% | evidenceUrl=MISSING |
| career case | career_5 | 온보딩 개선 및 퇴사율 제고 | 15 | 47 | 445 | 1주, 2주, 3주, 4주, 5주, 10%p, 3개월 | evidenceUrl=MISSING |
| career case | career_6 | 반복 행정 업무 자동화 (DX) | 17 | 47 | 336 | 90%, 0건 | evidenceUrl=MISSING |
| dx case | dx1 | 경조화환 주문 시스템 자동화 | 15 | 10 | 422 | 90% | evidenceUrl=https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-gift |
| dx case | dx2 | 전자 서명 수집 프로그램 | 13 | 10 | 351 | 550명, 2주, 3일 | evidenceUrl=https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-sign |
| dx case | dx3 | 직무 키워드 분석 | 9 | 11 | 388 | 600건 | evidenceUrl=https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-keyword |
| training | tr1 | 인사관리 기본과정 (직무급 중심) | 18 | 83 | 795 | - | certImage=MISSING |
| training | tr2 | Tableau Bootcamp 고급편 8기 | 23 | 144 | 2542 | 8기, 3주, 1단계, 52시간, 2단계, 3단계, 4단계, 5단계, 6단계 | certImage=assets/notion/training-32ac27c2-afbf-80a5-89f0-f6f737dc9aa8-e6758d401bc0.jpg |
| training | tr3 | Tableau Bootcamp 초급편 29기 | 24 | 109 | 847 | 29기, 1단계, 52시간, 2단계, 3단계, 4단계 | certImage=MISSING |
| training | tr4 | 3일만에 정복하는 노동법 마스터코스 | 19 | 92 | 1085 | 3일 | certImage=MISSING |
| activity | act1 | 공군 제15특수임무비행단 표준화평가과 | 20 | 41 | 402 | 45%, 75%, 16위, 8위, 0건, 60% | - |
| activity | act2 | 공군 연세대학교 학생군사교육단 | 16 | 50 | 142 | 100% | - |
| activity | act3 | 공군 제51항공통제비행전대 운영과 | 18 | 36 | 125 | 64점, 88점, 6%p | - |
| activity | act4 | 종로3가 주얼리 상권 리브랜딩 기획 | 19 | 54 | 293 | 12기 | - |
| activity | act5 | LCC 부가서비스 구독 모델 제안 | 18 | 35 | 116 | - | - |
| certification | cert_1 | Google Analytics Certification | 30 | 28 | 0 | - | credentialUrl=https://www.credential.net/e50ea40f-aae0-41d7-b242-d6551212a14f |
| certification | cert_2 | TOEIC Speaking IM2 | 18 | 42 | 0 | - | credentialUrl=MISSING |
| certification | cert_3 | Claude Code in Action | 21 | 37 | 0 | - | credentialUrl=https://verify.skilljar.com/c/855s5776siee |
| skill | skill_1 | Tableau | 7 | 31 | 0 | - | - |
| skill | skill_2 | Google Analytics 4 | 18 | 28 | 0 | - | - |
| skill | skill_3 | Python (Text Mining) | 20 | 24 | 0 | - | - |
| skill | skill_4 | Google Apps Script | 18 | 31 | 0 | - | - |
| skill | skill_5 | MAKE (Integromat) | 17 | 27 | 0 | - | - |
| skill | skill_6 | HTML / CSS | 10 | 24 | 0 | - | - |
| skill | skill_7 | Claude Code | 11 | 27 | 0 | - | - |
| skill | skill_8 | Ninehire (ATS) | 14 | 20 | 0 | - | - |
| skill | skill_9 | GPT Agent Design | 16 | 26 | 0 | - | - |
| skill | skill_10 | Slack / Notion / Teams | 22 | 28 | 0 | - | - |
| skill | skill_11 | Excel / Google Sheets | 21 | 33 | 0 | - | - |
| skill | skill_12 | PowerPoint | 10 | 35 | 0 | - | - |
| skill | skill_13 | Word / HWP | 10 | 35 | 0 | - | - |

## Evidence-Link Check

Only populated `evidenceUrl` / `credentialUrl` / `certImage` values are checked here. Missing fields are recorded under Gap Flags.

| Owner | Field | Value | Command | Status | Result |
|---|---|---|---|---|---|
| career case:career_3 | evidenceUrl | https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-recruit | `curl.exe -L -s -o NUL -w "%{http_code}" "https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-recruit"` | 200 | PASS |
| dx case:dx1 | evidenceUrl | https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-gift | `curl.exe -L -s -o NUL -w "%{http_code}" "https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-gift"` | 200 | PASS |
| dx case:dx2 | evidenceUrl | https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-sign | `curl.exe -L -s -o NUL -w "%{http_code}" "https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-sign"` | 200 | PASS |
| dx case:dx3 | evidenceUrl | https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-keyword | `curl.exe -L -s -o NUL -w "%{http_code}" "https://lucasung-debug.github.io/hermes-ops-dashboard-page/#case-keyword"` | 200 | PASS |
| training:tr2 | certImage | assets/notion/training-32ac27c2-afbf-80a5-89f0-f6f737dc9aa8-e6758d401bc0.jpg | `Test-Path "assets/notion/training-32ac27c2-afbf-80a5-89f0-f6f737dc9aa8-e6758d401bc0.jpg"` | LOCAL_FILE_EXISTS | PASS |
| certification:cert_1 | credentialUrl | https://www.credential.net/e50ea40f-aae0-41d7-b242-d6551212a14f | `curl.exe -L -s -o NUL -w "%{http_code}" "https://www.credential.net/e50ea40f-aae0-41d7-b242-d6551212a14f"` | 200 | PASS |
| certification:cert_3 | credentialUrl | https://verify.skilljar.com/c/855s5776siee | `curl.exe -L -s -o NUL -w "%{http_code}" "https://verify.skilljar.com/c/855s5776siee"` | 200 | PASS |

## Branding-Rule Scan

Verbatim rules from the plan:

- headline must be `'원래 이랬어'를 바꾸는 HR입니다.` — confirm present;
- `700명 규모` used (not 550명 강조) — list every occurrence of headcount;
- forbidden strings anywhere: `제조 현장 전문`; military rank/career terms in hero/badges (allowed only in 주요 활동);
- metric consistency: list all occurrences of `+12%p`, `–8%p`, `0건` and flag contradictions.

| Rule | Status | Evidence |
|---|---|---|
| Headline exact phrase present | PASS | heroHeadlineHTML text: '원래 이랬어'를 바꾸는 HR입니다. |
| 700명 규모 used; 550명 occurrences listed | FLAG | 700명: line 19: heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>`,<br>550명: line 115: "content": "<div class=\"animate-[slideIn_0.3s_ease-out]\"><div class=\"mb-6\"><span class=\"text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10\">GAS WebApp</span><h3 class=\"text-2xl font-bold text-white mt-2 mb-2 break-keep\">전자 서명 수집 프로그램</h3></div><div class=\"space-y-6\"><div><strong class=\"text-slate-300 block mb-1 text-sm uppercase tracking-wider\">Background & Problem</strong><p class=\"text-slate-400 text-sm leading-relaxed break-keep\">생산직 550명의 '전자 윤리서약서' 서명이 필요했으나 개인 PC 사용 불가. 종이 서명→스캔→자르기→등록 시 2주 이상 소요되어 심사 일정 준수 위기.</p></div><div><strong class=\"text-brand-400 block mb-1 text-sm uppercase tracking-wider\">Solution Logic</strong><ul class=\"text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep\"><li><span class=\"text-white font-bold\">Mobile First 접근:</span> PC가 없는 현장직도 본인 휴대폰으로 즉시 접속 가능한 웹앱 개발</li><li><span class=\"text-white font-bold\">Canvas API 활용:</span> 터치 스크린에 직접 서명하고, 이를 이미지 파일(Blob)로 변환하여 서버에 자동 저장</li><li><span class=\"text-white font-bold\">실시간 수합 모니터링:</span> 미제출자 명단 실시간 파악 및 독려 가능</li></ul></div><div class=\"pt-4 border-t border-slate-700\"><strong class=\"text-emerald-400 block mb-1 text-sm uppercase tracking-wider\">Result</strong><p class=\"text-white text-sm font-bold break-keep\">기존 2주 소요 업무를 3일 만에 550명 전원 수합 완료, 심사 성공적 종료</p></div></div></div>", |
| Forbidden string `제조 현장 전문` absent | PASS | no occurrences |
| Military rank/career terms absent from hero/badges | PASS | no occurrences in hero fields or dx badge fields |
| Metric consistency occurrences for `+12%p`, `–8%p`, `0건` | PASS | +12%p: line 19: heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>`,<br>–8%p: line 19: heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>`,<br>0건: line 19: heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>`,<br>line 71: "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">생산 물량 급증 시 특정 직무/라인의 연장 근로가 법적 한도(52시간)에 육박. 중간 관리 실패로 사후 대응만 가능하여 법적 리스크에 노출됨.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>사전 알림 체계: 주 45시간 도달 시 해당 직원 및 부서장에게 경고 메일/알림 자동 발송.</li><li>유연근무 도입: 생산 라인별 2주 단위 탄력근무제를 테스트 시행하여 효과성 검증.</li><li>모니터링 대시보드: 전사 근로시간 현황을 부서별/개인별로 시각화하여 매주 경영진 공유.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>법적 리스크 감소: 초과 예상 인원 144명→21명 감소, 특별연장근로 승인 건수 2건→0건 개선.</li><li>관리자 인식 개선: 연장/휴일 근무 시간이 5% 감소했음에도 생산량이 보전됨을 증명하여 인식 개선.</li><li>제도 개선 근거: 4조 3교대 개편 및 유연근무제 도입의 논리적 근거 강화.</li></ul></div></div>"<br>line 86: "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">기존 근태기가 직원들의 주 이동 동선과 동떨어진 곳에 위치하여, 출퇴근 시 태깅 누락이 빈번하게 발생했습니다. 이로 인해 월말 수기 수정 요청 건수가 급증하여 행정 업무 효율 감소 및 급여 신뢰도 하락 리스크 지속.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>동선 히트맵 분석: 노조와 협의하여 CCTV, 근태로그 기반 식당, 주차장, 탈의실 등 주요 거점과 작업장 간의 이동 경로를 2주간 추적 분석.</li><li>병목 구간 식별: 출퇴근 피크 타임에 대기 줄이 길어지는 구역과 아예 사용되지 않는 기기 식별.</li><li>기기 재배치: 유휴 기기 3대를 주 동선 교차점으로 이동 설치하고, 인식 속도가 느린 구형 기기 교체.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>인식률 개선: 전체 근태 태깅률 73% → 85% (12%p 개선)</li><li>오류 감소: 월 평균 수기 수정 요청 건수 약 100건 → 15건 (–85%)</li><li>현장 만족도: 출퇴근 대기 시간 단축으로 현장 직원 불만 해소</li></ul></div></div>"<br>line 100: "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">경조사 신청 등 단순 반복 행정 업무가 카톡이나 전화로 접수되어 담당자의 업무 몰입을 방해하고 이력 관리가 안 됨.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>신청 창구 일원화: Google Apps Script를 활용한 사내 신청 웹앱 개발.</li><li>프로세스 자동화: 신청 시 이메일 발송 (MAKE 연동).</li><li>데이터베이스화: 모든 신청 내역이 구글 시트에 자동 기록되어 별도 대장 관리 불필요.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>시간 절감: 단순 행정 업무 소요 시간 90% 단축.</li><li>오류 제거: 수기 입력으로 인한 오기재 및 누락 0건.</li><li>확장 계획: 재직증명서 등 개인 발급 서류의 모바일 발급 자동화 추진 중.</li></ul></div></div>"<br>line 121: "content": "<div class=\"animate-[slideIn_0.3s_ease-out]\"><div class=\"mb-6\"><span class=\"text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10\">Text Mining</span><h3 class=\"text-2xl font-bold text-white mt-2 mb-2 break-keep\">직무 키워드 분석</h3></div><div class=\"space-y-6\"><div><strong class=\"text-slate-300 block mb-1 text-sm uppercase tracking-wider\">Background & Problem</strong><p class=\"text-slate-400 text-sm leading-relaxed break-keep\">직무 분류 고도화를 위해 사내 인터뷰/설문 텍스트를 분석해야 했으나, 단순 AI 활용 시 프롬프트마다 결과가 달라져 데이터 신뢰도 확보가 어려움.</p></div><div><strong class=\"text-brand-400 block mb-1 text-sm uppercase tracking-wider\">Solution Logic</strong><ul class=\"text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep\"><li><span class=\"text-white font-bold\">Agent Persona 설계:</span> '직무 분석가' 페르소나와 일관된 분석 프레임워크를 탑재한 GPT Agent 설계</li><li><span class=\"text-white font-bold\">정성 데이터의 정량화:</span> 텍스트 마이닝을 통해 직무별 빈출 키워드(역량, 스킬, 태도) 추출 및 군집화</li><li><span class=\"text-white font-bold\">활용 확장:</span> 직군이 아닌 '직무' 단위 분류 체계 수립, 채용 공고 JD 개선, 수당 체계 근거 마련</li></ul></div><div class=\"pt-4 border-t border-slate-700\"><strong class=\"text-emerald-400 block mb-1 text-sm uppercase tracking-wider\">Result</strong><p class=\"text-white text-sm font-bold break-keep\">외부 지원자 데이터(600건+) 대상 EVP(Employee Value Proposition) 발굴 분석 확대 중</p></div></div></div>",<br>line 222: "content": "<div class=\"space-y-4\"><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 성과 요약</strong></p><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>사격훈련 진행률 45% → 75% 대폭 개선</li><li>공군 사격대회 순위 16위 → 8위로 상승</li><li>시설 수리 및 훈련 병행 기간 안전사고 0건 유지</li></ul><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>🚀 주요 프로젝트 1: 사격훈련 운영 체계 개편</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>문제:</strong> 무기고 봉인 등 예측 불가능한 일정으로 훈련 중단 반복</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> 방첩/보안 부서와 봉인 일정 사전 통보 체계 확립 및 인트라넷 예약 시스템 구축으로 '예측 가능한 훈련 리듬' 설계</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>🔧 주요 프로젝트 2: 노후 사격장 부분 수리 전략</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>문제:</strong> 사로 60% 파손으로 전면 수리 시 훈련 중단 위기</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> 긴급 구역 우선 수리 및 안전 가드 확보를 통한 '부분 수리 + 훈련 병행' 프로세스 설계로 운영 연속성 확보</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>핵심 역량</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">계획-현장-안전 연동 운영 설계, 다부서 이해관계 조율(Facility/Security)</p></div>" |

## Gap Flags

| Check | Status | Evidence |
|---|---|---|
| Empty `desc` / 설명 where a desc field exists | PASS | none |
| Cases without evidenceUrl | FLAG | career case:career_1:ATS(채용관리솔루션) 도입<br>career case:career_2:근태 리스크 예방 프로세스<br>career case:career_4:근태기 루트 효율화<br>career case:career_5:온보딩 개선 및 퇴사율 제고<br>career case:career_6:반복 행정 업무 자동화 (DX) |
| Certifications without credentialUrl | FLAG | cert_2:TOEIC Speaking IM2 |
| Training records without certImage | FLAG | tr1:인사관리 기본과정 (직무급 중심)<br>tr3:Tableau Bootcamp 초급편 29기<br>tr4:3일만에 정복하는 노동법 마스터코스 |
| Skill categories with fewer than 2 items | PASS | Data & Analytics: 3<br>Automation & Dev: 3<br>HR Tech & AI: 4<br>Office & Documentation: 3 |

## Gates

- G-b1: PASS — inventory covers 9 cases, 12 growth records, and 13 skills.
- G-b2: PASS — every populated URL/path in the inventory has a recorded status.
- G-b3: PASS — branding scan section is present with explicit PASS/FLAG per rule.
