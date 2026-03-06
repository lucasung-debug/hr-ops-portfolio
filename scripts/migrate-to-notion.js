#!/usr/bin/env node
// scripts/migrate-to-notion.js
// 기존 content.js 데이터 → Notion DB/Page 일회성 마이그레이션
//
// 사전 조건:
//   1. Notion에 DB 3개 + 설정 페이지 1개 생성 완료
//   2. 각 DB/페이지에 통합(Integration) 연결 완료
//   3. .env 또는 환경변수 설정
//
// 실행:
//   cd scripts && npm install
//   NOTION_API_KEY=... NOTION_DB_ID_CASES=... node migrate-to-notion.js

'use strict';

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DB_CASES    = process.env.NOTION_DB_ID_CASES;
const DB_GROWTH   = process.env.NOTION_DB_ID_GROWTH;
const DB_SKILLS   = process.env.NOTION_DB_ID_SKILLS;
const PAGE_SETTINGS = process.env.NOTION_PAGE_ID_SETTINGS;

// ──────────────────────────────────────────────
// 원본 데이터 (content.js 에서 추출)
// ──────────────────────────────────────────────

const CAREER_PROJECTS = [
  {
    title: 'ATS(채용관리솔루션) 도입', order: 1,
    sub: '나인하이어 도입을 통한 채용 프로세스 디지털 전환',
    desc: 'Ninehire 도입 및 채용 프로세스 디지털 전환',
    problem: '이메일과 엑셀로 지원자를 관리하여 서류 분실 위험이 높고, 탈락 지원자 서류 폐기에 대한 법률 위반 리스크 상존. 전형 안내 지연으로 지원자 이탈이 발생하며 데이터 집계가 불가능.',
    actions: '솔루션 선정: 비용 대비 효율성이 높은 \'나인하이어\' 선정 및 도입 추진.\n프로세스 표준화: 서류-면접-처우협의-입사 단계별 평가표 및 알림 템플릿 전산화.\n협업 구조 개선: 현업 면접관에게 평가 링크를 자동 발송하여 실시간 평가 취합 구조 마련.',
    results: '지원자 경험 개선: 전형 결과 통보 리드타임 단축 (관리직 8주→6주, 생산직 6주→4주).\n지원자 수 증가: 채용 포털과 자체 홈페이지 연동으로 직무별 지원자 평균 27% 증가.\n데이터 자산화: 채용 채널별 ROI, 리드타임 등 데이터 분석 대시보드화.\n법적 리스크 해소: 탈락자 개인정보 자동 파기 프로세스 구축.',
  },
  {
    title: '근태 리스크 예방 프로세스', order: 2,
    sub: '주 52시간 근무제 준수 모니터링 시스템',
    desc: '주 52시간 초과 예상자 사전 알림 및 모니터링',
    problem: '생산 물량 급증 시 특정 직무/라인의 연장 근로가 법적 한도(52시간)에 육박. 중간 관리 실패로 사후 대응만 가능하여 법적 리스크에 노출됨.',
    actions: '사전 알림 체계: 주 45시간 도달 시 해당 직원 및 부서장에게 경고 메일/알림 자동 발송.\n유연근무 도입: 생산 라인별 2주 단위 탄력근무제를 테스트 시행하여 효과성 검증.\n모니터링 대시보드: 전사 근로시간 현황을 부서별/개인별로 시각화하여 매주 경영진 공유.',
    results: '법적 리스크 감소: 초과 예상 인원 144명→21명 감소, 특별연장근로 승인 건수 2건→0건 개선.\n관리자 인식 개선: 연장/휴일 근무 시간이 5% 감소했음에도 생산량이 보전됨을 증명하여 인식 개선.\n제도 개선 근거: 4조 3교대 개편 및 유연근무제 도입의 논리적 근거 강화.',
  },
  {
    title: '직무 분석 기반 채용 홍보', order: 3,
    sub: '타겟 맞춤형 채용 콘텐츠 기획',
    desc: '타겟 맞춤형 채용 콘텐츠 제작 및 채널 다각화',
    problem: '단순 개요식 채용 공고로 직무에 대한 명확한 인사이트 제공이 불가하여 오해 발생. 우수 인재(MZ 세대)의 관심을 끌지 못하고 허수 지원자가 다수 발생.',
    actions: '직무 인터뷰: 현직자 인터뷰를 통해 실제 업무 내용과 필요 역량(Keyword) 도출.\n데이터 기반 분석: 텍스트 마이닝으로 직무별 필요 스킬을 도출하고, 이를 기반으로 공고 문구 고도화.\n채널 최적화: 직무별 타겟이 모이는 특화 커뮤니티 및 학교 취업센터로 홍보 채널 확장.',
    results: '적합성 향상: 서류→1차 면접 전환율 6%→15% 상승, 최종 합격률 0.3%→0.5% 개선.\n채용 효율화: 동일 직무 재공고 횟수가 13회에서 2회로 대폭 감소.\n브랜딩: 보수적인 제조 기업 이미지를 탈피하고 소통하는 조직 이미지 구축.',
  },
  {
    title: '근태기 루트 효율화', order: 4,
    sub: '동선 분석 기반 기기 재배치 프로젝트',
    desc: '동선 데이터 분석을 통한 기기 재배치 및 인식률 개선',
    problem: '기존 근태기가 직원들의 주 이동 동선과 동떨어진 곳에 위치하여, 출퇴근 시 태깅 누락이 빈번하게 발생했습니다. 이로 인해 월말 수기 수정 요청 건수가 급증하여 행정 업무 효율 감소 및 급여 신뢰도 하락 리스크 지속.',
    actions: '동선 히트맵 분석: 노조와 협의하여 CCTV, 근태로그 기반 식당, 주차장, 탈의실 등 주요 거점과 작업장 간의 이동 경로를 2주간 추적 분석.\n병목 구간 식별: 출퇴근 피크 타임에 대기 줄이 길어지는 구역과 아예 사용되지 않는 기기 식별.\n기기 재배치: 유휴 기기 3대를 주 동선 교차점으로 이동 설치하고, 인식 속도가 느린 구형 기기 교체.',
    results: '인식률 개선: 전체 근태 태깅률 73% → 85% (12%p 개선)\n오류 감소: 월 평균 수기 수정 요청 건수 8%p 감소\n현장 만족도: 출퇴근 대기 시간 단축으로 현장 직원 불만 해소',
  },
  {
    title: '온보딩 개선 및 퇴사율 제고', order: 5,
    sub: '신규 입사자 조기 적응 지원 프로그램',
    desc: '신규 입사자 적응 프로그램 구조화 및 멘토링',
    problem: '입사 초기 체계적인 교육 부재로 인해 신규 입사자들이 조직 적응에 어려움을 겪고, 수습 기간 내 조기 퇴사율이 상승함.',
    actions: '커리큘럼 구조화: 1주차(OT) → 2주차(직무스킬) → 3주차(현장실습) → 4주차(심화실습) → 5주차(임원교류) 로드맵 구축.\n콘텐츠 고도화: 비즈니스 매너, 팀워크, AX 리터러시 교육 등 신입사원 필수 역량 교육 도입.\nPBL 기반 교류: 현업 기반 AX 과제를 통해 CDP 수립을 돕고 임원진과 의견 교류 행사 기획.\n지원 체계: 버디(Buddy) 제도 운영 및 노션 기반 온보딩 가이드북 제작.',
    results: '퇴사율 감소: 수습 기간 내 조기 퇴사율 10%p 감소.\n적응도 향상: 입사 3개월 차 설문조사 결과 직무 및 조직 만족도 상승.\n성장 기반 마련: CDP에 기반한 향후 교육 개선 방향 수립 가능.',
  },
  {
    title: '반복 행정 업무 자동화 (DX)', order: 6,
    sub: 'GAS/MAKE 활용 업무 효율화',
    desc: '경조사/증명서 발급 등 단순 반복 업무 시스템화',
    problem: '경조사 신청 등 단순 반복 행정 업무가 카톡이나 전화로 접수되어 담당자의 업무 몰입을 방해하고 이력 관리가 안 됨.',
    actions: '신청 창구 일원화: Google Apps Script를 활용한 사내 신청 웹앱 개발.\n프로세스 자동화: 신청 시 이메일 발송 (MAKE 연동).\n데이터베이스화: 모든 신청 내역이 구글 시트에 자동 기록되어 별도 대장 관리 불필요.',
    results: '시간 절감: 단순 행정 업무 소요 시간 90% 단축.\n오류 제거: 수기 입력으로 인한 오기재 및 누락 0건.\n확장 계획: 재직증명서 등 개인 발급 서류의 모바일 발급 자동화 추진 중.',
  },
];

const DX_CASES = [
  {
    title: '경조화환 주문 시스템 자동화', order: 1,
    badge: 'GAS + MAKE',
    problem: '기존 카카오톡/문자로 건별 신청하여 누락 및 오기입(Human Error) 발생. 전표 재상신 등 회계 감사 리스크 존재.',
    actions: '**보안 로그인 웹앱:** 사번-생년월일 매칭으로 DB 정합성 검증 후 접속 (구글 폼의 익명성/보안 문제 해결)\n**신청 프로세스 표준화:** 필수 정보(일시, 장소, 부고장 첨부) 입력 시 구글 시트 자동 적재 및 \'신청 완료\' 문구 즉시 피드백\n**자동 알림 (MAKE):** 신청 즉시 업체(발주), 담당자, 팀장에게 Outlook 메일 자동 발송\n**회계 연동:** 월말 정산 데이터 자동 생성 및 회계 계정별 세금계산서 발행 리스트 원클릭 추출',
    results: '휴먼에러 Zero, 반복 행정 리소스 90% 절감, 개인정보 보안 리스크 최소화',
  },
  {
    title: '전자 서명 수집 프로그램', order: 2,
    badge: 'GAS WebApp',
    problem: '생산직 550명의 \'전자 윤리서약서\' 서명이 필요했으나 개인 PC 사용 불가. 종이 서명→스캔→자르기→등록 시 2주 이상 소요되어 심사 일정 준수 위기.',
    actions: '**Mobile First 접근:** PC가 없는 현장직도 본인 휴대폰으로 즉시 접속 가능한 웹앱 개발\n**Canvas API 활용:** 터치 스크린에 직접 서명하고, 이를 이미지 파일(Blob)로 변환하여 서버에 자동 저장\n**실시간 수합 모니터링:** 미제출자 명단 실시간 파악 및 독려 가능',
    results: '기존 2주 소요 업무를 3일 만에 550명 전원 수합 완료, 심사 성공적 종료',
  },
  {
    title: '직무 키워드 분석', order: 3,
    badge: 'Text Mining',
    problem: '직무 분류 고도화를 위해 사내 인터뷰/설문 텍스트를 분석해야 했으나, 단순 AI 활용 시 프롬프트마다 결과가 달라져 데이터 신뢰도 확보가 어려움.',
    actions: '**Agent Persona 설계:** \'직무 분석가\' 페르소나와 일관된 분석 프레임워크를 탑재한 GPT Agent 설계\n**정성 데이터의 정량화:** 텍스트 마이닝을 통해 직무별 빈출 키워드(역량, 스킬, 태도) 추출 및 군집화\n**활용 확장:** 직군이 아닌 \'직무\' 단위 분류 체계 수립, 채용 공고 JD 개선, 수당 체계 근거 마련',
    results: '외부 지원자 데이터(600건+) 대상 EVP(Employee Value Proposition) 발굴 분석 확대 중',
  },
];

const TRAINING_LIST = [
  {
    title: '인사관리 기본과정 (직무급 중심)', order: 1,
    category: 'HRM / HRD',
    dates: '2025.07.07 ~ 09 (18H)',
    org: 'KPC 한국생산성본부',
    desc: '직무분석~보상/평가 실무 및 노동법 이슈 정리',
    status: '수료 완료',
    modalId: 'hr_basic',
    // 노션 페이지 본문은 마이그레이션 후 직접 작성 필요
    bodyNote: 'hr_basic 모달 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
  {
    title: 'Tableau Bootcamp 29기', order: 2,
    category: 'Data Visualization',
    dates: '2025.10.14 ~ 23 (40H)',
    org: 'Tableau Korea (Online)',
    desc: '대시보드 제작 실습 및 Prep 데이터 정렬 학습',
    status: '수료 완료',
    modalId: 'tableau',
    bodyNote: 'tableau 모달 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
];

const ACTIVITIES_LIST = [
  {
    title: '공군 제15특수임무비행단 표준화평가과', order: 1,
    role: '부대훈련총괄담당',
    period: '2023.12 ~ 2025.02',
    rank: '대위(진) ~ 대위',
    icon: '🪖',
    desc: '사격훈련 진행률 45%→75% 개선, 공군 사격대회 16위→8위',
    bodyNote: '활동 상세 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
  {
    title: '공군 연세대학교 학생군사교육단', order: 2,
    role: '창설 TF 팀장 / 교육행정담당',
    period: '2022.09 ~ 2023.12',
    rank: '중위 ~ 대위(진)',
    icon: '🏛️',
    desc: '창설 검열 주요 미흡사항 없음, 후보생 지원자 전년 대비 100% 증가',
    bodyNote: '활동 상세 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
  {
    title: '공군 제51항공통제비행전대 운영과', order: 3,
    role: '인사정훈담당',
    period: '2021.03 ~ 2022.09',
    rank: '소위 ~ 중위',
    icon: '✈️',
    desc: '교육 만족도 64점→88점, 연가 사용률 6%p 상승',
    bodyNote: '활동 상세 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
  {
    title: '종로3가 주얼리 상권 리브랜딩 기획', order: 4,
    role: '상상마케팅스쿨 복서울 12기 (팀장)',
    period: '2018.10 ~ 2018.11',
    rank: '베스트프레젠터상 수상',
    icon: '💎',
    desc: '데이터 기반 2030 타겟 니즈 도출, 베스트프레젠터상 수상',
    bodyNote: '활동 상세 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
  {
    title: 'LCC 부가서비스 구독 모델 제안', order: 5,
    role: '교내 비즈니스 경진대회',
    period: '2018.10.05',
    rank: '최우수상 수상',
    icon: '🏆',
    desc: '월정액 구독 모델 제안, 최우수상 수상',
    bodyNote: '활동 상세 내용을 노션 페이지 본문에 직접 작성해주세요.',
  },
];

const SKILLS_LIST = [
  // Data & Analytics
  { name: 'Tableau',              category: 'Data & Analytics',       level: 'Intermediate', color: 'blue',    order: 1 },
  { name: 'Google Analytics 4',   category: 'Data & Analytics',       level: 'Certified',    color: 'blue',    order: 2 },
  { name: 'Python (Text Mining)', category: 'Data & Analytics',       level: 'Basic',        color: 'slate',   order: 3 },
  // Automation & Dev
  { name: 'Google Apps Script',   category: 'Automation & Dev',       level: 'Intermediate', color: 'emerald', order: 1 },
  { name: 'MAKE (Integromat)',     category: 'Automation & Dev',       level: 'Workflow',     color: 'purple',  order: 2 },
  { name: 'HTML / CSS',           category: 'Automation & Dev',       level: 'Basic',        color: 'slate',   order: 3 },
  // HR Tech & AI
  { name: 'Ninehire (ATS)',        category: 'HR Tech & AI',           level: 'Admin',        color: 'slate',   order: 1 },
  { name: 'GPT Agent Design',      category: 'HR Tech & AI',           level: 'Prompt Eng.',  color: 'slate',   order: 2 },
  { name: 'Slack / Notion / Teams',category: 'HR Tech & AI',           level: 'Collaboration',color: 'slate',   order: 3 },
  // Office & Documentation
  { name: 'Excel / Google Sheets', category: 'Office & Documentation', level: 'Advanced',     color: 'indigo',  order: 1 },
  { name: 'PowerPoint',            category: 'Office & Documentation', level: 'Proficient',   color: 'slate',   order: 2 },
  { name: 'Word / HWP',            category: 'Office & Documentation', level: 'Proficient',   color: 'slate',   order: 3 },
];

const SETTINGS = {
  resume_kr:                 'https://drive.google.com/uc?export=download&id=1sTqdcd8MPOAjTG9nQo7m2SNFGWzE7Llx',
  resume_en:                 'https://drive.google.com/uc?export=download&id=1UhAHgmxX9bQ51uPwV2wTwif1-QNBn5Rh',
  portfolio_kr:              'https://drive.google.com/uc?export=download&id=1FEuhZWT7z_EjbulkEPNe9VksuVzZw4vV',
  portfolio_en:              'https://drive.google.com/uc?export=download&id=1YtTpVhKyjNThPHPFAt0_LMbHNd5MIAHm',
  academic_school:           '한국항공대학교 (4년제)',
  academic_major:            '경영학부 경영학 전공',
  academic_period:           '2017.03 ~ 2021.02',
  academic_gpa_total:        '3.67 / 4.5',
  academic_gpa_credits:      '133',
  academic_gpa_major:        '3.78 / 4.5',
  academic_gpa_major_credits: '67',
};

// ──────────────────────────────────────────────
// 블록 빌더
// ──────────────────────────────────────────────
function txt(text, bold = false) {
  return [{ type: 'text', text: { content: String(text) }, annotations: bold ? { bold: true } : undefined }].map(t => {
    if (!t.annotations) delete t.annotations;
    return t;
  });
}

const blk = {
  h2:     t => ({ object: 'block', type: 'heading_2',           heading_2:           { rich_text: txt(t) } }),
  h3:     t => ({ object: 'block', type: 'heading_3',           heading_3:           { rich_text: txt(t) } }),
  para:   t => ({ object: 'block', type: 'paragraph',           paragraph:           { rich_text: txt(t) } }),
  bullet: t => ({ object: 'block', type: 'bulleted_list_item',  bulleted_list_item:  { rich_text: txt(t) } }),
  divider:  () => ({ object: 'block', type: 'divider', divider: {} }),
  callout:(t, emoji='💡') => ({ object: 'block', type: 'callout', callout: { rich_text: txt(t), icon: { type: 'emoji', emoji } } }),
  table:  (headers, rows) => ({
    object: 'block', type: 'table',
    table: {
      table_width: headers.length,
      has_column_header: true,
      has_row_header: false,
      children: [
        { object: 'block', type: 'table_row', table_row: { cells: headers.map(h => txt(h)) } },
        ...rows.map(r => ({ object: 'block', type: 'table_row', table_row: { cells: r.map(c => txt(c)) } })),
      ],
    },
  }),
};

// ──────────────────────────────────────────────
// 모달 상세 내용 (training 항목 페이지 본문)
// ──────────────────────────────────────────────
const MODAL_BODY_BLOCKS = {
  hr_basic: [
    blk.h3('📚 Key Learning: HR 체계의 이해'),
    blk.bullet('📌 직무관리: 직무분석 절차, 직무기술서/명세서 작성, 직무평가'),
    blk.bullet('📌 채용관리: 역량 중심 면접(BEI) 설계 및 채용 브랜딩 변화'),
    blk.bullet('📌 성과관리: MBO vs OKR, 성과책임(Accountability) 규명'),
    blk.bullet('📌 보상관리: 직무급/역할급 설계 논리, Merit Increase 매트릭스'),
    blk.bullet('📌 노동법: 근로시간, 연차, 모성보호, 퇴직 관리 등 필수 법규'),
    blk.divider(),
    blk.h3('💡 My Perspective: 인사이트'),
    blk.h2('직무 기준(Job Value)이 HR의 시작점이다'),
    blk.para('직무 가치가 불명확하면 채용-평가-보상의 논리가 모두 어긋남. \'사람\'이 아닌 \'역할\'에 집중하는 것이 공정성의 핵심.'),
    blk.h2('보상은 \'금액\'보다 \'설득 논리\'가 중요하다'),
    blk.para('구성원은 결과값 자체보다 "왜 내가 이 평가/보상을 받았는가"에 대한 설명에 반응함. HR은 이 논리를 설계하고 전달하는 역할.'),
    blk.h2('리스크 관리는 \'절차적 정당성\'에서 온다'),
    blk.para('퇴직, 징계 등 민감 이슈는 결과보다 \'사전 예고-소명 기회-일관된 기준\'이라는 절차를 준수했는가가 법적/조직적 리스크를 결정함.'),
    blk.divider(),
    blk.h3('🚀 Next Step: 현업 적용 계획'),
    blk.bullet('✅ 직무 기반 HR 체계 재점검 — 현행 직무기술서의 실효성 점검 및 채용 JD와의 정합성 검증'),
    blk.bullet('✅ 보상 수용성 강화 모델링 — 평가 등급별 인상률 시뮬레이션(Top/Mid/Low) 및 커뮤니케이션 가이드 마련'),
    blk.bullet('✅ 노무 리스크 대응 매뉴얼화 — 반복되는 이슈(연차, 근로시간, 도급) 중심의 Case Study 루틴화'),
  ],
  tableau: [
    blk.h3('📊 Key Learning: 기능과 활용'),
    blk.h2('1. 시각화 기초 & 차트'),
    blk.bullet('차원 vs 측정값, 집계 원리 이해'),
    blk.bullet('이중축/콤보 차트, 트리맵, 산점도 구현'),
    blk.bullet('맵 시각화(레이어/필터) 및 대시보드 배치'),
    blk.h2('2. 계산식 & 고급 분석'),
    blk.bullet('LOD(FIXED)를 활용한 전국 기준 비율 산출'),
    blk.bullet('테이블 계산(전일 대비 등락, 구성비)'),
    blk.bullet('매개변수를 활용한 동적 측정값 전환'),
    blk.h2('3. 특수 차트 & 디자인'),
    blk.bullet('도넛, 워터폴(수익 누계), 범프(순위 변동)'),
    blk.bullet('퍼널, 간트 차트(영업시간 시각화)'),
    blk.bullet('대시보드 디자인 10원칙 적용 (Z형 배치 등)'),
    blk.h2('4. 데이터 전처리 (Prep)'),
    blk.bullet('Union/Join을 통한 데이터 결합 및 정제'),
    blk.bullet('값 그룹핑 및 불필요 필드 정리'),
    blk.bullet('분석용 데이터셋 출력 및 자동화'),
    blk.divider(),
    blk.h3('💡 My Perspective: HR 데이터 관점'),
    blk.bullet('01 \'감\'이 아닌 \'근거\' 기반의 결정: 인사 운영을 근태/채용 Pipeline/인력 투입 현황 등 실시간 데이터 모니터링 체계로 전환 가능함.'),
    blk.bullet('02 평균의 함정 탈피: 특정 부서나 공정의 과로 위험(Outlier)을 박스플롯 등으로 즉시 시각화하여 선제적 조치 가능.'),
    blk.bullet('03 전달력 있는 커뮤니케이션: 경영진과 현장 관리자가 직접 필터를 조작하며 인사이트를 얻는 대시보드 구축이 핵심.'),
    blk.divider(),
    blk.h3('🚀 Next Step: 현업 적용 계획'),
    blk.table(
      ['단계', '실행 목표'],
      [
        ['1단계: 모니터링', '부서/공정별 근태 편차 및 위험 구간(52시간 임계) 자동 시각화'],
        ['2단계: 인력 매칭', '정원(TO) vs 실 투입 인력(직영/도급) 차이 분석 및 경고 시스템'],
        ['3단계: 채용 분석', '채용 단계별(서류-면접-입사) 전환율 Funnel 및 병목 구간 시각화'],
        ['4단계: 운영 자동화', 'HR 원천 데이터 표준화 및 Tableau Prep을 활용한 전처리 자동화'],
      ]
    ),
  ],
};

// ──────────────────────────────────────────────
// DB별 사용 설명서 블록
// ──────────────────────────────────────────────
const GUIDE_CASES = [
  blk.callout('이 페이지는 사용 설명서입니다. 삭제하지 마세요.', '📖'),
  blk.h3('케이스 스터디 DB 사용 방법'),
  blk.para('이 DB는 포트폴리오 사이트의 경력 프로젝트(career)와 DX 사례(dx) 섹션을 관리합니다.'),
  blk.divider(),
  blk.h3('📋 프로퍼티 설명'),
  blk.bullet('제목 — 프로젝트명 (사이트 카드 상단에 표시)'),
  blk.bullet('유형 — career(경력 케이스) 또는 dx(DX 사례) 중 선택'),
  blk.bullet('상태 — 발행(사이트 노출) / 초안(숨김)'),
  blk.bullet('sub — [career 전용] 카드 부제목'),
  blk.bullet('desc — [career 전용] 카드 짧은 설명'),
  blk.bullet('뱃지 — [dx 전용] 기술 스택 태그 (예: GAS + MAKE)'),
  blk.bullet('문제 — 문제 상황 설명'),
  blk.bullet('액션 — 실행 내용 (줄바꿈으로 항목 구분)'),
  blk.bullet('결과 — 결과 수치 (줄바꿈으로 항목 구분)'),
  blk.bullet('순서 — 표시 순서 (숫자가 낮을수록 앞에 표시)'),
  blk.divider(),
  blk.h3('✏️ 수정 방법'),
  blk.bullet('내용 수정 후 GitHub Actions → "Sync Notion → content.js" → Run workflow'),
  blk.bullet('상태를 초안으로 바꾸면 다음 sync 때 사이트에서 제거됨'),
  blk.bullet('새 항목 추가 시 순서 번호를 지정해야 정렬이 유지됨'),
];

const GUIDE_GROWTH = [
  blk.callout('이 페이지는 사용 설명서입니다. 삭제하지 마세요.', '📖'),
  blk.h3('성장 기록 DB 사용 방법'),
  blk.para('이 DB는 직무 교육(training)과 주요 활동(activity) 섹션을 관리합니다.'),
  blk.divider(),
  blk.h3('📋 프로퍼티 설명 — 공통'),
  blk.bullet('제목 — 항목명'),
  blk.bullet('유형 — training(직무 교육) 또는 activity(주요 활동)'),
  blk.bullet('상태 — 발행 / 초안'),
  blk.bullet('설명 — 카드에 표시되는 한줄 설명'),
  blk.bullet('순서 — 표시 순서'),
  blk.h3('📋 프로퍼티 설명 — training 전용'),
  blk.bullet('카테고리 — HRM/HRD, Data Visualization 등'),
  blk.bullet('날짜 — 기간 문자열 (예: 2025.07.07 ~ 09 (18H))'),
  blk.bullet('기관 — 교육 기관명'),
  blk.bullet('상태텍스트 — 수료 완료 등'),
  blk.bullet('모달ID — 상세 팝업이 있는 경우 고유 ID 입력 (예: tableau, hr_basic)'),
  blk.callout('모달ID가 있는 training 항목은 이 페이지 본문(아래)에 상세 내용을 Notion 형식으로 작성하세요. h1/h2/h3/단락/불릿/표 모두 지원됩니다.', '✍️'),
  blk.h3('📋 프로퍼티 설명 — activity 전용'),
  blk.bullet('역할 — 직책 또는 역할명'),
  blk.bullet('기간 — 활동 기간 (예: 2023.12 ~ 2025.02)'),
  blk.bullet('계급 — 계급 또는 수상 내역'),
  blk.bullet('아이콘 — 카드에 표시될 이모지'),
  blk.callout('activity 항목도 페이지 본문에 상세 내용을 작성하면 모달 팝업에 표시됩니다.', '✍️'),
  blk.divider(),
  blk.h3('✏️ 수정 방법'),
  blk.bullet('내용 수정 후 GitHub Actions → "Sync Notion → content.js" → Run workflow'),
];

const GUIDE_SKILLS = [
  blk.callout('이 페이지는 사용 설명서입니다. 삭제하지 마세요.', '📖'),
  blk.h3('스킬 DB 사용 방법'),
  blk.para('이 DB는 포트폴리오 스킬 섹션의 카테고리별 기술 목록을 관리합니다.'),
  blk.divider(),
  blk.h3('📋 프로퍼티 설명'),
  blk.bullet('스킬명 — 기술 이름 (예: Tableau, Python)'),
  blk.bullet('카테코리 — 아래 4가지 중 정확히 일치하게 입력'),
  blk.para('  → Data & Analytics / Automation & Dev / HR Tech & AI / Office & Documentation'),
  blk.bullet('레벨 — 뱃지에 표시될 텍스트 (예: Intermediate, Certified, Basic, Admin)'),
  blk.bullet('레벨색상 — 뱃지 색상: blue / emerald / purple / indigo / slate'),
  blk.bullet('선택 — 발행 / 초안'),
  blk.bullet('순서 — 카테고리 내 표시 순서 (숫자가 낮을수록 앞)'),
  blk.divider(),
  blk.h3('🎨 레벨색상 가이드'),
  blk.table(
    ['색상값', '표시 색상', '추천 용도'],
    [
      ['blue',    '파란색',   'Intermediate, Certified'],
      ['emerald', '초록색',   'Workflow, 실무 활용'],
      ['purple',  '보라색',   '특수 기술'],
      ['indigo',  '남색',     'Advanced, 고급'],
      ['slate',   '회색',     'Basic, Admin, 기본'],
    ]
  ),
  blk.divider(),
  blk.h3('✏️ 수정 방법'),
  blk.bullet('내용 수정 후 GitHub Actions → "Sync Notion → content.js" → Run workflow'),
  blk.bullet('카테코리 값이 정확히 일치하지 않으면 해당 스킬이 누락될 수 있습니다'),
];

function noteBlock(text) {
  return blk.callout(text, '⚠️');
}

async function createPage(dbId, properties, bodyBlocks = []) {
  return notion.pages.create({
    parent: { database_id: dbId },
    properties,
    children: bodyBlocks,
  });
}

// ──────────────────────────────────────────────
// 마이그레이션 함수
// ──────────────────────────────────────────────
async function migrateSettings() {
  console.log('\n[1/5] 사이트 설정 페이지 업데이트...');
  const props = {};
  for (const [key, val] of Object.entries(SETTINGS)) {
    if (key === 'academic_school') {
      props[key] = { title: txt(val) };
    } else {
      props[key] = { rich_text: txt(val) };
    }
  }
  // 설정 페이지를 DB 페이지로 가정 — 직접 업데이트
  await notion.pages.update({ page_id: PAGE_SETTINGS, properties: props });
  console.log('  완료');
}

async function migrateCases() {
  console.log('\n[2/5] 케이스 스터디 DB (career)...');
  for (const c of CAREER_PROJECTS) {
    await createPage(DB_CASES, {
      '제목': { title: txt(c.title) },
      '유형': { select: { name: 'career' } },
      '상태': { select: { name: '발행' } },
      'sub':  { rich_text: txt(c.sub) },
      'desc': { rich_text: txt(c.desc) },
      '문제': { rich_text: txt(c.problem) },
      '액션': { rich_text: txt(c.actions) },
      '결과': { rich_text: txt(c.results) },
      '순서': { number: c.order },
    });
    console.log(`  ✓ ${c.title}`);
  }

  console.log('\n[3/5] 케이스 스터디 DB (dx)...');
  for (const d of DX_CASES) {
    await createPage(DB_CASES, {
      '제목': { title: txt(d.title) },
      '유형': { select: { name: 'dx' } },
      '상태': { select: { name: '발행' } },
      '뱃지': { rich_text: txt(d.badge) },
      '문제': { rich_text: txt(d.problem) },
      '액션': { rich_text: txt(d.actions) },
      '결과': { rich_text: txt(d.results) },
      '순서': { number: d.order },
    });
    console.log(`  ✓ ${d.title}`);
  }
}

async function migrateGrowth() {
  console.log('\n[4/5] 성장 기록 DB (training + activity)...');

  for (const t of TRAINING_LIST) {
    const body = t.modalId && MODAL_BODY_BLOCKS[t.modalId]
      ? MODAL_BODY_BLOCKS[t.modalId]
      : [noteBlock(t.bodyNote)];
    const page = await createPage(DB_GROWTH, {
      '제목':      { title: txt(t.title) },
      '유형':      { select: { name: 'training' } },
      '상태':      { select: { name: '발행' } },
      '카테고리':  { rich_text: txt(t.category) },
      '날짜':      { rich_text: txt(t.dates) },
      '기관':      { rich_text: txt(t.org) },
      '설명':      { rich_text: txt(t.desc) },
      '상태텍스트':{ rich_text: txt(t.status) },
      '모달ID':    { rich_text: txt(t.modalId || '') },
      '순서':      { number: t.order },
    }, body);
    console.log(`  ✓ ${t.title} (modalId: ${t.modalId})`);
  }

  for (const a of ACTIVITIES_LIST) {
    const body = [noteBlock(a.bodyNote)];
    await createPage(DB_GROWTH, {
      '제목':  { title: txt(a.title) },
      '유형':  { select: { name: 'activity' } },
      '상태':  { select: { name: '발행' } },
      '역할':  { rich_text: txt(a.role) },
      '기간':  { rich_text: txt(a.period) },
      '계급':  { rich_text: txt(a.rank) },
      '아이콘':{ rich_text: txt(a.icon) },
      '설명':  { rich_text: txt(a.desc) },
      '순서':  { number: a.order },
    }, body);
    console.log(`  ✓ ${a.title}`);
  }
}

async function migrateSkills() {
  console.log('\n[5/5] 스킬 DB...');
  // DB 스키마 확인
  const dbInfo = await notion.databases.retrieve({ database_id: DB_SKILLS });
  console.log('  스킬 DB 프로퍼티:', Object.keys(dbInfo.properties).join(', '));
  for (const s of SKILLS_LIST) {
    await createPage(DB_SKILLS, {
      '스킬명':   { title: txt(s.name) },
      '카테코리': { select: { name: s.category } },
      '레벨':     { rich_text: txt(s.level) },
      '레벨색상': { select: { name: s.color } },
      '선택':     { select: { name: '발행' } },
      '순서':     { number: s.order },
    });
    console.log(`  ✓ ${s.name}`);
  }
}

async function addGuidePages() {
  console.log('\n[6/6] 사용 설명서 페이지 추가...');
  await createPage(DB_CASES,  { '제목': { title: txt('📖 사용 설명서 (읽어주세요)') }, '상태': { select: { name: '초안' } }, '유형': { select: { name: 'career' } }, '순서': { number: 999 } }, GUIDE_CASES);
  console.log('  ✓ 케이스 스터디 DB');
  await createPage(DB_GROWTH, { '제목': { title: txt('📖 사용 설명서 (읽어주세요)') }, '유형': { select: { name: 'training' } }, '상태': { select: { name: '초안' } }, '순서': { number: 999 } }, GUIDE_GROWTH);
  console.log('  ✓ 성장 기록 DB');
  await createPage(DB_SKILLS, { '스킬명': { title: txt('📖 사용 설명서 (읽어주세요)') }, '선택': { select: { name: '초안' } }, '순서': { number: 999 } }, GUIDE_SKILLS);
  console.log('  ✓ 스킬 DB');
}

// ──────────────────────────────────────────────
// 메인
// ──────────────────────────────────────────────
async function main() {
  const missing = ['NOTION_API_KEY', 'NOTION_DB_ID_CASES', 'NOTION_DB_ID_GROWTH', 'NOTION_DB_ID_SKILLS', 'NOTION_PAGE_ID_SETTINGS']
    .filter(k => !process.env[k]);
  if (missing.length) {
    console.error('Missing env vars:', missing.join(', '));
    process.exit(1);
  }

  console.log('=== Notion 마이그레이션 시작 ===');
  console.log('주의: 각 DB에 중복 데이터가 생기지 않도록 처음 1회만 실행하세요.\n');

  try {
    await migrateSettings();
  } catch (e) {
    console.warn('  [skip] 설정 페이지 업데이트 실패 (일반 페이지인 경우 정상):', e.message);
  }
  await migrateCases();
  await migrateGrowth();
  await migrateSkills();
  await addGuidePages();

  console.log('\n=== 완료 ===');
  console.log('다음 단계:');
  console.log('  1. 노션에서 activity 항목의 페이지 본문에 활동 상세 내용 작성');
  console.log('  2. GitHub Actions → Sync Notion → Run workflow 로 사이트 반영');
}

main().catch(err => { console.error(err); process.exit(1); });
