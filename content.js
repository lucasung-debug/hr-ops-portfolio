// content.js - 포트폴리오 기본 콘텐츠 데이터
// !! 이 파일은 GitHub Actions (sync-notion.yml) 이 자동 생성합니다 !!
// 직접 편집하지 마세요 — Notion DB 에서 수정하세요.
// 마지막 생성: 2026-03-22T01:11:17.636Z

const SITE_CONTENT = {

  // ===== 기본 정보 (하드코딩) =====
  profileName: "성명재",
  profileNameEn: "Sung Myeong Jae",
  profileTitle: "HR Operations",
  email: "proposition97@gmail.com",
  companyName: "오뚜기라면 인사팀",
  lastUpdated: "2026년 3월",

  // ===== 히어로 섹션 (하드코딩) =====
  heroSubtitle: "HR Operations",
  heroDescription: `ATS 도입 · 근태 시스템 재편 · 52시간 관리 · 업무 자동화<br>1년 안에 4개 영역을 직접 설계하고 작동시켰습니다.`,
  heroHeadlineHTML: `'원래 이랬어'를 <span style="color: var(--primary)">바꾸는</span> HR입니다.`,
  heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>`,

  // ===== 다운로드 링크 (Notion: 사이트 설정) =====
  downloads: {
    "resume_kr": "https://drive.google.com/uc?export=download&id=1sTqdcd8MPOAjTG9nQo7m2SNFGWzE7Llx",
    "resume_en": "https://drive.google.com/uc?export=download&id=1UhAHgmxX9bQ51uPwV2wTwif1-QNBn5Rh",
    "portfolio_kr": "https://drive.google.com/uc?export=download&id=1FEuhZWT7z_EjbulkEPNe9VksuVzZw4vV",
    "portfolio_en": "https://drive.google.com/uc?export=download&id=1YtTpVhKyjNThPHPFAt0_LMbHNd5MIAHm"
},

  // ===== 교육 모달 상세 (Notion: 성장 기록 페이지 본문) =====
  modalDetails: {
    "hr_basic": {
        "title": "인사관리 기본과정 (직무급 중심)",
        "subtitle": "직무분석~보상/평가 실무 및 노동법 이슈 정리",
        "content": "<div class=\"space-y-4\"><h4 class=\"text-primary-600\">📚 Key Learning: HR 운영 구조의 이해</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>📌 직무관리: 직무분석, 직무기술서, 직무평가 체계</li><li>📌 채용관리: 역량 중심 선발, 직무 적합성 검증, 채용 브랜딩 변화</li><li>📌 성과관리: MBO와 OKR의 차이, 목표 설계 방식, 성과책임의 명확화</li><li>📌 보상관리: 직무급과 역할급의 설계 논리, 평가와 보상의 연계 구조</li><li>📌 노동법: 근로시간, 연차, 모성보호, 퇴직 관리 등 HR 운영의 법적 기준</li></ul><h4 class=\"text-primary-600\">💡 My Perspective: 인사이트</h4><h4 class=\"text-primary-600\">직무 기준은 HR 운영 전반의 출발점</h4><p class=\"text-slate-600 text-sm leading-relaxed\">직무 기준의 명확화는 채용 평가 보상 전반의 정합성 확보.</p><p class=\"text-slate-600 text-sm leading-relaxed\">사람 중심 접근보다 역할과 책임 중심 설계의 중요성 확인.</p><h4 class=\"text-primary-600\">보상은 금액보다 설명 가능한 논리의 영역</h4><p class=\"text-slate-600 text-sm leading-relaxed\">구성원 수용성은 결과 자체보다 평가와 보상 기준의 납득 가능성에 좌우.</p><p class=\"text-slate-600 text-sm leading-relaxed\">HR의 핵심 역할은 제도 운영 자체보다 설명 가능한 기준 설계와 커뮤니케이션 체계 구축.</p><h4 class=\"text-primary-600\">리스크 관리는 결과보다 절차적 정당성의 문제</h4><p class=\"text-slate-600 text-sm leading-relaxed\">퇴직 징계 근로시간 연차 이슈의 핵심은 결과보다 기준 절차 기록의 일관성 확보.</p><p class=\"text-slate-600 text-sm leading-relaxed\">법적 리스크와 조직 내 수용성 관리를 위한 절차 중심 운영의 필요성 재확인.</p><h4 class=\"text-primary-600\">🚀 Next Step: 현업 적용 계획</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>✅ 직무 기반 운영 점검 — 직무기술서와 채용 JD 간 정합성 검토, 채용 기준 일관성 강화</li><li>✅ 평가 보상 구조 보완 — 평가 등급별 보상 차등 논리 정리, 수용성 제고를 위한 커뮤니케이션 기준 마련</li><li>✅ 노무 리스크 대응 체계화 — 연차 근로시간 징계 등 반복 이슈 중심 대응 기준 정리</li><li>✅ 제도 운영 문서화 강화 — 기준 절차 예외 처리 원칙 명확화, 실무 적용력 제고</li></ul></div>"
    },
    "tableau_advanced": {
        "title": "Tableau Bootcamp 고급편 8기",
        "subtitle": "기준일 기반 시계열 분석, LOD 계산식, 테이블 계산, 맵 시각화, Set Action 대시보드 구현 학습",
        "certImage": "assets/certs/tableau-advanced.jpg",
        "content": "<div class=\"space-y-4\"><h4 class=\"text-primary-600\">📊 Key Learning | Tableau Bootcamp 고급편 이수 내용</h4><h4 class=\"text-primary-600\">1. 시간 데이터 처리와 기준일 기반 분석 설계</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>DATEPARSE, DATEPART, DATETRUNC, DATEADD, DATEDIFF 등 날짜 함수를 활용한 다양한 형태의 날짜 데이터 정제</li><li>날짜 데이터의 시계열 분석 구조 전환 및 기준일 중심 비교 체계 설계</li><li>기준월·전월 비교, MTD, YTD, 전년 동기 비교(YoY) 로직 구현</li><li>회계연도 시작월 변경 등 실제 비즈니스 기준에 맞춘 날짜 속성 설정 방식 이해</li></ul><h4 class=\"text-primary-600\">2. LOD를 활용한 계산 기준 제어</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>FIXED, INCLUDE, EXCLUDE를 활용한 시각화 수준과 계산 수준 분리</li><li>시각화 세부 수준과 계산 세부 수준 차이로 발생하는 왜곡 구조 이해</li><li>FIXED를 활용한 빈 행 보정 및 비교 계산 가능 구조 재구성</li><li>기준값과 집계 단위를 별도로 설계하는 방식 학습</li></ul><h4 class=\"text-primary-600\">3. 비교형 분석과 동적 정보 표시 구조 구현</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>선택된 기간을 시트 제목에 동적으로 반영하는 구조 구현</li><li>기준기간과 전년동기간을 구분한 텍스트·라인차트·이중축 차트 설계</li><li>키워드 주간 평균 순위 분석 및 최근 3주 연속 상승 키워드 탐색</li><li>고객별 평균 주문 단가 증감율 계산 및 증가·감소 고객군 시각화 실습</li></ul><h4 class=\"text-primary-600\">4. 테이블 계산 기반 순위·성장률·누계 분석</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>Partition과 Address 개념에 대한 이해</li><li>LOOKUP, RANK, INDEX, LAST, RUNNING_SUM 등을 활용한 성장률·순위·누계 계산 구현</li><li>제품군별 Top N 분석, 전월 대비 성장률 계산, 최근 N개 구간 필터링 수행</li><li>파레토 차트 및 움직이는 참조선 구현을 통한 누계 기반 해석형 분석 실습</li></ul><h4 class=\"text-primary-600\">5. 공간 데이터 준비와 맵 시각화 확장</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>지리적 역할 부여, 계층 구성, 지오코딩, 모호한 위치 편집 방식 학습</li><li>makepoint와 intersects 조인을 활용한 점 데이터와 공간 파일 결합</li><li>이중축 맵, 맵인맵, 다중 맵 레이어 구현</li><li>AREA 함수를 활용한 면적 계산 및 공간 정보 시각화 확장 경험 확보</li></ul><h4 class=\"text-primary-600\">6. 집합(Set)과 인터랙티브 대시보드 설계</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>정적 집합, 동적 집합, 결합된 집합 개념 이해</li><li>필터와 집합의 차이 및 IN/OUT 동시 분석 구조 학습</li><li>Set Action을 활용한 사용자 선택 기반 분석 흐름 설계</li><li>지역별 순위 비교, 장바구니 분석, 교차판매 대상 추출 대시보드 구현</li></ul><h4 class=\"text-primary-600\">7. 통합 적용 중심의 최종 과제 수행</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>날짜 함수, LOD, 테이블 계산, 공간 분석, 집합과 동작을 하나의 분석 문제에 통합 적용</li><li>개별 기능 학습을 넘어 문제 정의부터 계산 구조 설계, 시각화 선택, 탐색 흐름 구성까지 연결</li><li>기능 단위 학습이 아닌 분석 프로젝트 단위 사고 방식 강화</li></ul><h4 class=\"text-primary-600\">💡 My Perspective | 고급편 학습을 통해 확장된 분석 관점</h4><h4 class=\"text-primary-600\">시점 비교 중심의 운영 데이터 해석 관점 강화</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>특정 시점 수치 확인보다 기준일을 중심으로 전월, 전년, 누적 흐름을 함께 해석하는 방식의 중요성 체감</li><li>운영 데이터 해석 시 단일 숫자보다 변화 방향과 비교 구조를 함께 보는 관점 확보</li></ul><h4 class=\"text-primary-600\">평균보다 계산 기준과 비교 구조를 먼저 설계하는 접근 강화</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>동일한 데이터라도 집계 수준과 비교 기준에 따라 해석이 달라진다는 점 확인</li><li>단순 평균과 총합보다 계산 단위와 비교 로직 설계가 우선이라는 분석 관점 정립</li></ul><h4 class=\"text-primary-600\">대시보드를 보고서가 아닌 탐색형 의사결정 도구로 바라보는 관점 확장</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>매개변수, 집합, 동작을 활용한 사용자 선택 기반 탐색 구조 학습</li><li>정적 보고서보다 인터랙티브 구조가 실제 현업 활용도와 의사결정 효율성 측면에서 더 유효하다는 판단</li></ul><h4 class=\"text-primary-600\">분석 관점의 시계열·공간·세분화 구조 확장 가능성 확인</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>날짜 함수, 공간 시각화, 집합 기반 분석이 단순 매출 분석을 넘어 다양한 업무 영역으로 확장 가능함을 확인</li><li>인사 운영, 조직 관리, 채용 분석, 리스크 모니터링 등 HR 데이터에도 응용 가능한 분석 프레임으로 인식</li></ul><h4 class=\"text-primary-600\">🚀 Next Step | HR 데이터에 적용할 계획</h4><div class=\"overflow-hidden border border-slate-200 rounded-xl\"><table class=\"w-full text-sm text-left text-slate-600\"><thead class=\"bg-slate-50 text-slate-700 font-bold border-b border-slate-200\"><tr><th class=\"px-4 py-3\">단계</th><th class=\"px-4 py-3\">실행 목표</th></tr></thead><tbody class=\"divide-y divide-slate-100\"><tr><td class=\"px-4 py-3\">1단계. 기준일 기반 근태 분석</td><td class=\"px-4 py-3\">기준일 선택형 MTD·YTD 구조로 부서별 근로시간 추이와 52시간 임계구간 모니터링 체계 구축</td></tr><tr><td class=\"px-4 py-3\">2단계. 조직 단위 기준값 설계</td><td class=\"px-4 py-3\">LOD를 활용한 부서·공정별 기준 인원, 실투입 인원, 편차 비교 구조 설계</td></tr><tr><td class=\"px-4 py-3\">3단계. 채용 시계열 분석</td><td class=\"px-4 py-3\">채용 단계별 전환율과 시점별 병목 변화 비교 대시보드 구현</td></tr><tr><td class=\"px-4 py-3\">4단계. 리스크 우선순위 분석</td><td class=\"px-4 py-3\">테이블 계산과 Pareto 구조를 활용한 초과근로, 이탈, 채용 지연 등 주요 리스크 집중 구간 식별</td></tr><tr><td class=\"px-4 py-3\">5단계. 사업장·지역 단위 시각화</td><td class=\"px-4 py-3\">맵 기반 분석을 활용한 사업장·조직 단위 인력 운영 현황 및 리스크 분포 시각화</td></tr><tr><td class=\"px-4 py-3\">6단계. 인터랙티브 HR 대시보드 구축</td><td class=\"px-4 py-3\">집합과 동작을 활용한 부서, 기간, 이슈 선택형 탐색 환경 구현</td></tr></tbody></table></div><h4 class=\"text-primary-600\">✅ Summary</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>기준일 기반 시계열 비교, LOD를 활용한 계산 기준 제어, 테이블 계산 기반 성장률·순위·누계 분석 역량 강화</li><li>공간 데이터 시각화와 집합·액션 기반 인터랙티브 대시보드 설계 경험 확보</li><li>단순 차트 작성 수준을 넘어 문제 정의, 계산 구조 설계, 탐색 흐름 구성까지 연결하는 분석 사고 방식 확장</li><li>향후 HR 데이터에서 근태, 채용, 인력 운영, 조직 리스크를 보다 구조적이고 탐색 가능한 방식으로 해석할 수 있는 기반 확보</li></ul></div>"
    },
    "tableau_basic": {
        "title": "Tableau Bootcamp 초급편 29기",
        "subtitle": "대시보드 제작 실습 및 Prep 데이터 정렬 학습",
        "certImage": "assets/certs/tableau-basic.jpg",
        "content": "<div class=\"space-y-4\"><h4 class=\"text-primary-600\">📊 Key Learning: Tableau 기반 HR 데이터 분석 역량</h4><h4 class=\"text-primary-600\">1. 시각화 설계</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>차원과 측정값, 집계 원리 이해</li><li>이중축, 콤보 차트, 트리맵, 산점도 구현</li><li>맵 시각화와 대시보드 레이아웃 설계</li></ul><h4 class=\"text-primary-600\">2. 계산식 및 분석 로직</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>LOD FIXED 기반 기준값 산출</li><li>테이블 계산을 활용한 전일 대비 등락 및 구성비 분석</li><li>매개변수 기반 동적 측정값 전환</li></ul><h4 class=\"text-primary-600\">3. 특수 차트 및 대시보드 구성</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>도넛, 워터폴, 범프 차트 구현</li><li>퍼널, 간트 차트를 통한 흐름 및 시간 구조 시각화</li><li>대시보드 디자인 원칙 적용 및 정보 우선순위 설계</li></ul><h4 class=\"text-primary-600\">4. 데이터 전처리 및 자동화</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>Union Join 기반 데이터 결합 및 정제</li><li>값 그룹핑과 불필요 필드 정리</li><li>Tableau Prep 기반 분석용 데이터셋 출력 및 전처리 자동화</li></ul><h4 class=\"text-primary-600\">💡 My Perspective: HR 데이터 관점</h4><h4 class=\"text-primary-600\">데이터 기반 인사 운영 체계로의 전환</h4><p class=\"text-slate-600 text-sm leading-relaxed\">근태, 채용, 인력 운영 데이터를 실시간 모니터링 체계로 연결하는 분석 관점 확보.</p><h4 class=\"text-primary-600\">평균이 아닌 편차와 이상치 중심의 리스크 진단</h4><p class=\"text-slate-600 text-sm leading-relaxed\">부서별 편차, 과로 위험, 병목 구간을 Outlier 중심으로 식별하는 시각화 접근 이해.</p><h4 class=\"text-primary-600\">보고용 자료가 아닌 의사결정용 대시보드 설계</h4><p class=\"text-slate-600 text-sm leading-relaxed\">경영진과 현장 관리자가 직접 탐색하고 판단할 수 있는 인터랙티브 분석 구조 지향.</p><h4 class=\"text-primary-600\">🚀 Next Step: 현업 적용 계획</h4><div class=\"overflow-hidden border border-slate-200 rounded-xl\"><table class=\"w-full text-sm text-left text-slate-600\"><thead class=\"bg-slate-50 text-slate-700 font-bold border-b border-slate-200\"><tr><th class=\"px-4 py-3\">단계</th><th class=\"px-4 py-3\">실행 목표</th></tr></thead><tbody class=\"divide-y divide-slate-100\"><tr><td class=\"px-4 py-3\">1단계. 근태 모니터링</td><td class=\"px-4 py-3\">부서 공정별 근로시간 편차와 52시간 임계구간 가시화</td></tr><tr><td class=\"px-4 py-3\">2단계. 인력 운영 분석</td><td class=\"px-4 py-3\">정원 대비 실투입 인력 차이 및 직영 도급 운영 구조 분석</td></tr><tr><td class=\"px-4 py-3\">3단계. 채용 퍼널 분석</td><td class=\"px-4 py-3\">서류 면접 입사 단계별 전환율 및 병목 구간 진단</td></tr><tr><td class=\"px-4 py-3\">4단계. 데이터 자동화</td><td class=\"px-4 py-3\">HR 원천 데이터 표준화 및 Prep 기반 전처리 자동화 체계 구축</td></tr></tbody></table></div></div>"
    },
    "er-master": {
        "title": "3일만에 정복하는 노동법 마스터코스",
        "subtitle": "노동법과 노사관계 전반에 대한 실무 판단 기준과 절차적 정당성 정리",
        "content": "<div class=\"space-y-4\"><h4 class=\"text-primary-600\">📚 Key Learning: 노동법 실무 체계의 이해</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>📌 노동법 일반: 사용자 개념, 도급과 파견의 구별, 불법파견과 직접고용의무</li><li>📌 근로계약: 시용과 수습의 차이, 기간제와 갱신기대권, 근로계약서 작성 및 교부 의무</li><li>📌 근로시간 및 휴가: 법정근로시간, 연장근로 한도, 연차유급휴가 운영과 사용촉진 제도</li><li>📌 임금: 통상임금과 평균임금의 구별, 최저임금, 임금 삭감과 퇴직금 산정 기준</li><li>📌 취업규칙 및 징계해고: 취업규칙 불이익변경, 해고 절차, 부당해고 구제</li><li>📌 집단적 노사관계: 노동조합, 단체교섭, 쟁의행위, 단체협약, 노사협의회 운영</li><li>📌 제도 변화 이해: 노란봉투법 관련 쟁점, 사용자성 확대 이슈, 사측 대응 방향 검토</li></ul><h4 class=\"text-primary-600\">💡 My Perspective: 인사이트</h4><h4 class=\"text-primary-600\">노동법 실무의 핵심은 제도 암기가 아닌 판단 기준의 정립</h4><p class=\"text-slate-600 text-sm leading-relaxed\">근로계약, 근로시간, 임금, 취업규칙, 해고, 노사관계는 개별 제도의 집합이 아니라 연결된 운영 체계.</p><p class=\"text-slate-600 text-sm leading-relaxed\">하나의 판단이 다른 법적 리스크로 이어지는 만큼, 조문 이해보다 기준과 연결 구조에 대한 해석 역량이 핵심.</p><h4 class=\"text-primary-600\">리스크 관리의 출발점은 결과보다 절차적 정당성</h4><p class=\"text-slate-600 text-sm leading-relaxed\">징계, 해고, 취업규칙 변경, 연차 운영과 같은 이슈는 결론 자체보다 사전 고지, 기준의 명확성, 일관된 적용, 기록 관리가 중요.</p><p class=\"text-slate-600 text-sm leading-relaxed\">실제 분쟁 예방의 핵심은 법 조항 암기보다 절차 설계와 운영의 정합성 확보.</p><h4 class=\"text-primary-600\">노사 이슈 대응의 본질은 회피가 아닌 구조 점검</h4><p class=\"text-slate-600 text-sm leading-relaxed\">노란봉투법과 국제 사례를 함께 검토하며, 사측 대응의 핵심은 갈등 회피가 아니라 사용자성, 통제 구조, 교섭 대응 체계에 대한 사전 점검이라는 점 확인.</p><p class=\"text-slate-600 text-sm leading-relaxed\">특히 원하청 구조에서는 계약 명칭보다 실질적 운영 방식이 더 중요하다는 점 인식.</p><h4 class=\"text-primary-600\">🚀 Next Step: 현업 적용 계획</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>✅ 근로시간 및 연차 운영 기준 재점검 — 반복 이슈 예방 중심 운영 기준 정비</li><li>✅ 근로계약서 및 취업규칙 정합성 점검 — 문서와 실제 운영 간 불일치 최소화</li><li>✅ 징계 해고 프로세스 정비 — 사전 고지, 소명 기회, 기록 관리 중심 절차 강화</li><li>✅ 도급 파견 노무 이슈 체크리스트화 — 사례 중심 리스크 판단 기준 구축</li><li>✅ 노사관계 대응력 강화 — 노란봉투법 쟁점 반영한 사용자성 및 교섭 대응 관점 정리</li></ul></div>"
    }
},

  // ===== 경력 프로젝트 (Notion: 케이스 스터디 DB, 유형=career) =====
  careerProjects: [
    {
        "id": "career_1",
        "title": "ATS(채용관리솔루션) 도입",
        "sub": "나인하이어 도입을 통한 채용 프로세스 디지털 전환",
        "desc": "Ninehire 도입 및 채용 프로세스 디지털 전환",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">이메일과 엑셀로 지원자를 관리하여 서류 분실 위험이 높고, 탈락 지원자 서류 폐기에 대한 법률 위반 리스크 상존. 전형 안내 지연으로 지원자 이탈이 발생하며 데이터 집계가 불가능.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>솔루션 선정: 비용 대비 효율성이 높은 '나인하이어' 선정 및 도입 추진.</li><li>프로세스 표준화: 서류-면접-처우협의-입사 단계별 평가표 및 알림 템플릿 전산화.</li><li>협업 구조 개선: 현업 면접관에게 평가 링크를 자동 발송하여 실시간 평가 취합 구조 마련.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>지원자 경험 개선: 전형 결과 통보 리드타임 단축 (관리직 8주→6주, 생산직 6주→4주).</li><li>지원자 수 증가: 채용 포털과 자체 홈페이지 연동으로 직무별 지원자 평균 27% 증가.</li><li>데이터 자산화: 채용 채널별 ROI, 리드타임 등 데이터 분석 대시보드화.</li><li>법적 리스크 해소: 탈락자 개인정보 자동 파기 프로세스 구축.</li></ul></div></div>"
    },
    {
        "id": "career_2",
        "title": "근태 리스크 예방 프로세스",
        "sub": "주 52시간 근무제 준수 모니터링 시스템",
        "desc": "주 52시간 초과 예상자 사전 알림 및 모니터링",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">생산 물량 급증 시 특정 직무/라인의 연장 근로가 법적 한도(52시간)에 육박. 중간 관리 실패로 사후 대응만 가능하여 법적 리스크에 노출됨.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>사전 알림 체계: 주 45시간 도달 시 해당 직원 및 부서장에게 경고 메일/알림 자동 발송.</li><li>유연근무 도입: 생산 라인별 2주 단위 탄력근무제를 테스트 시행하여 효과성 검증.</li><li>모니터링 대시보드: 전사 근로시간 현황을 부서별/개인별로 시각화하여 매주 경영진 공유.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>법적 리스크 감소: 초과 예상 인원 144명→21명 감소, 특별연장근로 승인 건수 2건→0건 개선.</li><li>관리자 인식 개선: 연장/휴일 근무 시간이 5% 감소했음에도 생산량이 보전됨을 증명하여 인식 개선.</li><li>제도 개선 근거: 4조 3교대 개편 및 유연근무제 도입의 논리적 근거 강화.</li></ul></div></div>"
    },
    {
        "id": "career_3",
        "title": "직무 분석 기반 채용 홍보",
        "sub": "타겟 맞춤형 채용 콘텐츠 기획",
        "desc": "타겟 맞춤형 채용 콘텐츠 제작 및 채널 다각화",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">단순 개요식 채용 공고로 직무에 대한 명확한 인사이트 제공이 불가하여 오해 발생. 우수 인재(MZ 세대)의 관심을 끌지 못하고 허수 지원자가 다수 발생.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>직무 인터뷰: 현직자 인터뷰를 통해 실제 업무 내용과 필요 역량(Keyword) 도출.</li><li>데이터 기반 분석: 텍스트 마이닝으로 직무별 필요 스킬을 도출하고, 이를 기반으로 공고 문구 고도화.</li><li>채널 최적화: 직무별 타겟이 모이는 특화 커뮤니티 및 학교 취업센터로 홍보 채널 확장.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>적합성 향상: 서류→1차 면접 전환율 6%→15% 상승, 최종 합격률 0.3%→0.5% 개선.</li><li>채용 효율화: 동일 직무 재공고 횟수가 13회에서 2회로 대폭 감소.</li><li>브랜딩: 보수적인 제조 기업 이미지를 탈피하고 소통하는 조직 이미지 구축.</li></ul></div></div>"
    },
    {
        "id": "career_4",
        "title": "근태기 루트 효율화",
        "sub": "동선 분석 기반 기기 재배치 프로젝트",
        "desc": "동선 데이터 분석을 통한 기기 재배치 및 인식률 개선",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">기존 근태기가 직원들의 주 이동 동선과 동떨어진 곳에 위치하여, 출퇴근 시 태깅 누락이 빈번하게 발생했습니다. 이로 인해 월말 수기 수정 요청 건수가 급증하여 행정 업무 효율 감소 및 급여 신뢰도 하락 리스크 지속.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>동선 히트맵 분석: 노조와 협의하여 CCTV, 근태로그 기반 식당, 주차장, 탈의실 등 주요 거점과 작업장 간의 이동 경로를 2주간 추적 분석.</li><li>병목 구간 식별: 출퇴근 피크 타임에 대기 줄이 길어지는 구역과 아예 사용되지 않는 기기 식별.</li><li>기기 재배치: 유휴 기기 3대를 주 동선 교차점으로 이동 설치하고, 인식 속도가 느린 구형 기기 교체.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>인식률 개선: 전체 근태 태깅률 73% → 85% (12%p 개선)</li><li>오류 감소: 월 평균 수기 수정 요청 건수 8%p 감소</li><li>현장 만족도: 출퇴근 대기 시간 단축으로 현장 직원 불만 해소</li></ul></div></div>"
    },
    {
        "id": "career_5",
        "title": "온보딩 개선 및 퇴사율 제고",
        "sub": "신규 입사자 조기 적응 지원 프로그램",
        "desc": "신규 입사자 적응 프로그램 구조화 및 멘토링",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">입사 초기 체계적인 교육 부재로 인해 신규 입사자들이 조직 적응에 어려움을 겪고, 수습 기간 내 조기 퇴사율이 상승함.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>커리큘럼 구조화: 1주차(OT) → 2주차(직무스킬) → 3주차(현장실습) → 4주차(심화실습) → 5주차(임원교류) 로드맵 구축.</li><li>콘텐츠 고도화: 비즈니스 매너, 팀워크, AX 리터러시 교육 등 신입사원 필수 역량 교육 도입.</li><li>PBL 기반 교류: 현업 기반 AX 과제를 통해 CDP 수립을 돕고 임원진과 의견 교류 행사 기획.</li><li>지원 체계: 버디(Buddy) 제도 운영 및 노션 기반 온보딩 가이드북 제작.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>퇴사율 감소: 수습 기간 내 조기 퇴사율 10%p 감소.</li><li>적응도 향상: 입사 3개월 차 설문조사 결과 직무 및 조직 만족도 상승.</li><li>성장 기반 마련: CDP에 기반한 향후 교육 개선 방향 수립 가능.</li></ul></div></div>"
    },
    {
        "id": "career_6",
        "title": "반복 행정 업무 자동화 (DX)",
        "sub": "GAS/MAKE 활용 업무 효율화",
        "desc": "경조사/증명서 발급 등 단순 반복 업무 시스템화",
        "modalContent": "<div class=\"space-y-6\"><div><h4 class=\"text-primary-600\">🔍 문제 상황</h4><p class=\"text-slate-600 text-sm leading-relaxed\">경조사 신청 등 단순 반복 행정 업무가 카톡이나 전화로 접수되어 담당자의 업무 몰입을 방해하고 이력 관리가 안 됨.</p></div><div><h4 class=\"text-primary-600\">🛠️ 실행 (Action)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>신청 창구 일원화: Google Apps Script를 활용한 사내 신청 웹앱 개발.</li><li>프로세스 자동화: 신청 시 이메일 발송 (MAKE 연동).</li><li>데이터베이스화: 모든 신청 내역이 구글 시트에 자동 기록되어 별도 대장 관리 불필요.</li></ul></div><div><h4 class=\"text-primary-600\">📈 결과 (Result)</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>시간 절감: 단순 행정 업무 소요 시간 90% 단축.</li><li>오류 제거: 수기 입력으로 인한 오기재 및 누락 0건.</li><li>확장 계획: 재직증명서 등 개인 발급 서류의 모바일 발급 자동화 추진 중.</li></ul></div></div>"
    }
],

  // ===== DX 사례 (Notion: 케이스 스터디 DB, 유형=dx) =====
  dxCases: {
    "dx1": {
        "title": "경조화환 주문 시스템 자동화",
        "badge": "GAS + MAKE",
        "content": "<div class=\"animate-[slideIn_0.3s_ease-out]\"><div class=\"mb-6\"><span class=\"text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10\">GAS + MAKE</span><h3 class=\"text-2xl font-bold text-white mt-2 mb-2 break-keep\">경조화환 주문 시스템 자동화</h3></div><div class=\"space-y-6\"><div><strong class=\"text-slate-300 block mb-1 text-sm uppercase tracking-wider\">Background & Problem</strong><p class=\"text-slate-400 text-sm leading-relaxed break-keep\">기존 카카오톡/문자로 건별 신청하여 누락 및 오기입(Human Error) 발생. 전표 재상신 등 회계 감사 리스크 존재.</p></div><div><strong class=\"text-brand-400 block mb-1 text-sm uppercase tracking-wider\">Solution Logic</strong><ul class=\"text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep\"><li><span class=\"text-white font-bold\">보안 로그인 웹앱:</span> 사번-생년월일 매칭으로 DB 정합성 검증 후 접속 (구글 폼의 익명성/보안 문제 해결)</li><li><span class=\"text-white font-bold\">신청 프로세스 표준화:</span> 필수 정보(일시, 장소, 부고장 첨부) 입력 시 구글 시트 자동 적재 및 '신청 완료' 문구 즉시 피드백</li><li><span class=\"text-white font-bold\">자동 알림 (MAKE):</span> 신청 즉시 업체(발주), 담당자, 팀장에게 Outlook 메일 자동 발송</li><li><span class=\"text-white font-bold\">회계 연동:</span> 월말 정산 데이터 자동 생성 및 회계 계정별 세금계산서 발행 리스트 원클릭 추출</li></ul></div><div class=\"pt-4 border-t border-slate-700\"><strong class=\"text-emerald-400 block mb-1 text-sm uppercase tracking-wider\">Result</strong><p class=\"text-white text-sm font-bold break-keep\">휴먼에러 Zero, 반복 행정 리소스 90% 절감, 개인정보 보안 리스크 최소화</p></div></div></div>"
    },
    "dx2": {
        "title": "전자 서명 수집 프로그램",
        "badge": "GAS WebApp",
        "content": "<div class=\"animate-[slideIn_0.3s_ease-out]\"><div class=\"mb-6\"><span class=\"text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10\">GAS WebApp</span><h3 class=\"text-2xl font-bold text-white mt-2 mb-2 break-keep\">전자 서명 수집 프로그램</h3></div><div class=\"space-y-6\"><div><strong class=\"text-slate-300 block mb-1 text-sm uppercase tracking-wider\">Background & Problem</strong><p class=\"text-slate-400 text-sm leading-relaxed break-keep\">생산직 550명의 '전자 윤리서약서' 서명이 필요했으나 개인 PC 사용 불가. 종이 서명→스캔→자르기→등록 시 2주 이상 소요되어 심사 일정 준수 위기.</p></div><div><strong class=\"text-brand-400 block mb-1 text-sm uppercase tracking-wider\">Solution Logic</strong><ul class=\"text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep\"><li><span class=\"text-white font-bold\">Mobile First 접근:</span> PC가 없는 현장직도 본인 휴대폰으로 즉시 접속 가능한 웹앱 개발</li><li><span class=\"text-white font-bold\">Canvas API 활용:</span> 터치 스크린에 직접 서명하고, 이를 이미지 파일(Blob)로 변환하여 서버에 자동 저장</li><li><span class=\"text-white font-bold\">실시간 수합 모니터링:</span> 미제출자 명단 실시간 파악 및 독려 가능</li></ul></div><div class=\"pt-4 border-t border-slate-700\"><strong class=\"text-emerald-400 block mb-1 text-sm uppercase tracking-wider\">Result</strong><p class=\"text-white text-sm font-bold break-keep\">기존 2주 소요 업무를 3일 만에 550명 전원 수합 완료, 심사 성공적 종료</p></div></div></div>"
    },
    "dx3": {
        "title": "직무 키워드 분석",
        "badge": "Text Mining",
        "content": "<div class=\"animate-[slideIn_0.3s_ease-out]\"><div class=\"mb-6\"><span class=\"text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10\">Text Mining</span><h3 class=\"text-2xl font-bold text-white mt-2 mb-2 break-keep\">직무 키워드 분석</h3></div><div class=\"space-y-6\"><div><strong class=\"text-slate-300 block mb-1 text-sm uppercase tracking-wider\">Background & Problem</strong><p class=\"text-slate-400 text-sm leading-relaxed break-keep\">직무 분류 고도화를 위해 사내 인터뷰/설문 텍스트를 분석해야 했으나, 단순 AI 활용 시 프롬프트마다 결과가 달라져 데이터 신뢰도 확보가 어려움.</p></div><div><strong class=\"text-brand-400 block mb-1 text-sm uppercase tracking-wider\">Solution Logic</strong><ul class=\"text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep\"><li><span class=\"text-white font-bold\">Agent Persona 설계:</span> '직무 분석가' 페르소나와 일관된 분석 프레임워크를 탑재한 GPT Agent 설계</li><li><span class=\"text-white font-bold\">정성 데이터의 정량화:</span> 텍스트 마이닝을 통해 직무별 빈출 키워드(역량, 스킬, 태도) 추출 및 군집화</li><li><span class=\"text-white font-bold\">활용 확장:</span> 직군이 아닌 '직무' 단위 분류 체계 수립, 채용 공고 JD 개선, 수당 체계 근거 마련</li></ul></div><div class=\"pt-4 border-t border-slate-700\"><strong class=\"text-emerald-400 block mb-1 text-sm uppercase tracking-wider\">Result</strong><p class=\"text-white text-sm font-bold break-keep\">외부 지원자 데이터(600건+) 대상 EVP(Employee Value Proposition) 발굴 분석 확대 중</p></div></div></div>"
    }
},

  // ===== 직무 교육 목록 (Notion: 성장 기록 DB, 유형=training) =====
  trainingList: [
    {
        "id": "tr1",
        "category": "HRM / HRD",
        "dates": "2025.07.07 ~ 09 (18H)",
        "title": "인사관리 기본과정 (직무급 중심)",
        "org": "KPC 한국생산성본부",
        "desc": "직무분석~보상/평가 실무 및 노동법 이슈 정리",
        "status": "수료 완료",
        "modalId": "hr_basic"
    },
    {
        "id": "tr2",
        "category": "Data Visualization",
        "dates": "2026.02.27 ~ 3.16 (18 days)",
        "title": "Tableau Bootcamp 고급편 8기",
        "org": "Tableau Korea (Online)",
        "desc": "기준일 기반 시계열 분석, LOD 계산식, 테이블 계산, 맵 시각화, Set Action 대시보드 구현 학습",
        "status": "수료 완료",
        "certImage": "assets/certs/tableau-advanced.jpg",
        "modalId": "tableau_advanced"
    },
    {
        "id": "tr3",
        "category": "Data Visualization",
        "dates": "2025.10.14 ~ 23 (10 days)",
        "title": "Tableau Bootcamp 초급편 29기",
        "org": "Tableau Korea (Online)",
        "desc": "대시보드 제작 실습 및 Prep 데이터 정렬 학습",
        "status": "수료 완료",
        "certImage": "assets/certs/tableau-basic.jpg",
        "modalId": "tableau_basic"
    },
    {
        "id": "tr4",
        "category": "ER / HRM",
        "dates": "2026.02.25 ~ 27 (20H)",
        "title": "3일만에 정복하는 노동법 마스터코스",
        "org": "중앙경제HR교육원",
        "desc": "노동법과 노사관계 전반에 대한 실무 판단 기준과 절차적 정당성 정리",
        "status": "수료 완료",
        "modalId": "er-master"
    }
],

  // ===== 자격 & 어학 (Notion: 성장 기록 DB, 유형=certification) =====
  certificationList: [
    {
        "id": "cert_1",
        "title": "Google Analytics Certification",
        "org": "Google",
        "date": "2026.01.11",
        "icon": "📜",
        "desc": "GA4 인증",
        "credentialUrl": "https://www.credential.net/e50ea40f-aae0-41d7-b242-d6551212a14f"
    },
    {
        "id": "cert_2",
        "title": "TOEIC Speaking IM2",
        "org": "ETS",
        "date": "2026.03.14",
        "icon": "🗣️",
        "desc": "Practical Communication",
        "credentialUrl": null
    },
    {
        "id": "cert_3",
        "title": "Claude Code in Action",
        "org": "Anthropic",
        "date": "2026.03.08",
        "icon": "📜",
        "desc": "클로드 코드 교육 수료",
        "credentialUrl": "https://verify.skilljar.com/c/855s5776siee"
    }
],

  // ===== 교육 정보 =====
  education: {
    'academic': `<div class="flex flex-col md:flex-row gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-100 transition duration-300 animate-[slideIn_0.4s_ease-out]"><div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100">🎓</div><div class="flex-1"><div class="flex flex-col md:flex-row md:items-center justify-between mb-2"><h4 class="text-xl font-bold text-slate-900 break-keep">한국항공대학교(Korea Aerospace University)</h4><span class="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">2017.03 ~ 2021.02</span></div><p class="text-slate-700 font-bold mb-4 break-keep">경영학부 경영학 전공(B.B.A)</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전체 평점</span><span class="text-lg font-bold text-slate-800">3.67 / 4.5</span><span class="text-xs text-slate-400 ml-1">(133학점 이수)</span></div><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전공 평점</span><span class="text-lg font-bold text-primary-600">3.78 / 4.5</span><span class="text-xs text-slate-400 ml-1">(67학점 이수)</span></div></div></div></div>`,
    'training': '',
    'activities': '',
    'skills': `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[slideIn_0.4s_ease-out]"><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">📊</span><h4 class="text-lg font-bold text-slate-900">Data & Analytics</h4></div><ul class="space-y-3 text-sm text-slate-600"><li class="flex justify-between items-center"><span>Tableau</span><span class="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Intermediate</span></li><li class="flex justify-between items-center"><span>Google Analytics 4</span><span class="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Certified</span></li><li class="flex justify-between items-center"><span>Python (Text Mining)</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Basic</span></li></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">⚙️</span><h4 class="text-lg font-bold text-slate-900">Automation & Dev</h4></div><ul class="space-y-3 text-sm text-slate-600"><li class="flex justify-between items-center"><span>Google Apps Script</span><span class="text-xs font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded">Intermediate</span></li><li class="flex justify-between items-center"><span>MAKE (Integromat)</span><span class="text-xs font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Workflow</span></li><li class="flex justify-between items-center"><span>HTML / CSS</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Basic</span></li></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">🤖</span><h4 class="text-lg font-bold text-slate-900">HR Tech & AI</h4></div><ul class="space-y-3 text-sm text-slate-600"><li class="flex justify-between items-center"><span>Claude Code</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Intermediate</span></li><li class="flex justify-between items-center"><span>Ninehire (ATS)</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Admin</span></li><li class="flex justify-between items-center"><span>GPT Agent Design</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Prompt Eng.</span></li><li class="flex justify-between items-center"><span>Slack / Notion / Teams</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Collaboration</span></li></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">📝</span><h4 class="text-lg font-bold text-slate-900">Office & Documentation</h4></div><ul class="space-y-3 text-sm text-slate-600"><li class="flex justify-between items-center"><span>Excel / Google Sheets</span><span class="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">Advanced</span></li><li class="flex justify-between items-center"><span>PowerPoint</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Proficient</span></li><li class="flex justify-between items-center"><span>Word / HWP</span><span class="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Proficient</span></li></ul></div></div>`
  },

  // ===== 주요 활동 (Notion: 성장 기록 DB, 유형=activity) =====
  activitiesList: [
    {
        "id": "act1",
        "title": "공군 제15특수임무비행단 표준화평가과",
        "role": "부대훈련총괄담당",
        "period": "2023.12 ~ 2025.02",
        "rank": "대위(진) ~ 대위",
        "icon": "🪖",
        "content": "<div class=\"space-y-4\"><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 성과 요약</strong></p><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>사격훈련 진행률 45% → 75% 대폭 개선</li><li>공군 사격대회 순위 16위 → 8위로 상승</li><li>시설 수리 및 훈련 병행 기간 안전사고 0건 유지</li></ul><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>🚀 주요 프로젝트 1: 사격훈련 운영 체계 개편</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>문제:</strong> 무기고 봉인 등 예측 불가능한 일정으로 훈련 중단 반복</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> 방첩/보안 부서와 봉인 일정 사전 통보 체계 확립 및 인트라넷 예약 시스템 구축으로 '예측 가능한 훈련 리듬' 설계</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>🔧 주요 프로젝트 2: 노후 사격장 부분 수리 전략</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>문제:</strong> 사로 60% 파손으로 전면 수리 시 훈련 중단 위기</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> 긴급 구역 우선 수리 및 안전 가드 확보를 통한 '부분 수리 + 훈련 병행' 프로세스 설계로 운영 연속성 확보</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>핵심 역량</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">계획-현장-안전 연동 운영 설계, 다부서 이해관계 조율(Facility/Security)</p></div>"
    },
    {
        "id": "act2",
        "title": "공군 연세대학교 학생군사교육단",
        "role": "창설 TF 팀장 / 교육행정담당",
        "period": "2022.09 ~ 2023.12",
        "rank": "중위 ~ 대위(진)",
        "icon": "🏛️",
        "content": "<div class=\"space-y-4\"><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 성과 요약</strong></p><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>창설 검열 시 '주요 미흡사항 없음' 인정</li><li>후보생 지원자 전년 대비 100% 증가</li></ul><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>📢 주요 프로젝트 1: 후보생 모집 브랜딩 리뉴얼</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> '병역'이 아닌 '전문 커리어'로 소구점 전환</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>핵심 역량</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">0 to 1 조직 구축, 이해관계자 관리</p></div>"
    },
    {
        "id": "act3",
        "title": "공군 제51항공통제비행전대 운영과",
        "role": "인사정훈담당",
        "period": "2021.03 ~ 2022.09",
        "rank": "소위 ~ 중위",
        "icon": "✈️",
        "content": "<div class=\"space-y-4\"><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 성과 요약</strong></p><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>교육 만족도 64점 → 88점 향상</li><li>코로나 시기 연가 사용률 6%p 상승</li></ul><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>🎓 주요 프로젝트 1: 내부 강사 양성</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>해결:</strong> 외부 전문가 초빙 강사 코칭 프로그램 도입</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>핵심 역량</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">HRD 시스템 내재화, 규정 준수</p></div>"
    },
    {
        "id": "act4",
        "title": "종로3가 주얼리 상권 리브랜딩 기획",
        "role": "상상마케팅스쿨 복서울 12기 (팀장)",
        "period": "2018.10 ~ 2018.11",
        "rank": "베스트프레젠터상 수상",
        "icon": "💎",
        "content": "<div class=\"space-y-4\"><h4 class=\"text-primary-600\">💡 성과 요약</h4><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>베스트프레젠터상 수상</li><li>GIS 데이터 기반 소비자 밀집 시간 분석 수행</li><li>2030 타깃 유입 접점 도출</li><li>서순라길 중심 공간 브랜딩 전략 기획</li></ul><h4 class=\"text-primary-600\">🔎 문제 정의: 제품이 아닌 경험의 문제</h4><p class=\"text-slate-600 text-sm leading-relaxed\">핵심은 상품 자체보다도, 2030세대가 방문하고 체험하며 공유할 만한 경험 요소가 부족했다는 점</p><h4 class=\"text-primary-600\">🧭 주요 역할</h4><p class=\"text-slate-600 text-sm leading-relaxed\">팀장으로서 전체 발표 방향과 액션 플랜을 총괄하고, PPT 스토리라인 설계 및 GIS 데이터 기반 소비자 밀집 시간 분석을 담당</p><h4 class=\"text-primary-600\">핵심 역량</h4><p class=\"text-slate-600 text-sm leading-relaxed\">문제 구조화, 데이터 기반 분석, 공간 브랜딩 기획, 팀 리딩 및 발표 총괄</p></div>"
    },
    {
        "id": "act5",
        "title": "LCC 부가서비스 구독 모델 제안",
        "role": "교내 비즈니스 경진대회",
        "period": "2018.10.05",
        "rank": "최우수상 수상",
        "icon": "🏆",
        "content": "<div class=\"space-y-4\"><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 성과 요약</strong></p><ul class=\"list-disc pl-4 text-sm text-slate-600 space-y-2\"><li>최우수상 수상</li><li>사용자 경험(UX) 개선 모델 제시</li></ul><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>💡 솔루션: 여행 경험의 단순화</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">수하물/좌석/기내식을 묶은 <strong>'월정액 구독 모델'</strong> 제안</p><p class=\"text-slate-600 text-sm leading-relaxed\"><strong>핵심 역량</strong></p><p class=\"text-slate-600 text-sm leading-relaxed\">비즈니스 모델 설계, UX 중심 사고</p></div>"
    }
]

};
