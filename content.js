// content.js - 포트폴리오 기본 콘텐츠 데이터
// !! 이 파일은 GitHub Actions (sync-notion.yml) 이 자동 생성합니다 !!
// 직접 편집하지 마세요 — Notion DB 에서 수정하세요.
// 마지막 생성: 2026-03-06T15:46:34.152Z

const SITE_CONTENT = {

  // ===== 기본 정보 (하드코딩) =====
  profileName: "성명재",
  profileNameEn: "Sung Myeong Jae",
  profileTitle: "HR Operations",
  email: "proposition97@gmail.com",
  companyName: "오뚜기라면 인사팀",
  lastUpdated: "20263.",

  // ===== 히어로 섹션 (하드코딩) =====
  heroSubtitle: "HR Operations",
  heroDescription: `ATS 도입 · 근태 시스템 재편 · 52시간 관리 · 업무 자동화<br>1년 안에 4개 영역을 직접 설계하고 작동시켰습니다.`,
  heroHeadlineHTML: `'원래 이랬어'를 <span class="text-brand-600">바꾸는</span> HR입니다.`,
  heroImpactHTML: `700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span class="text-brand-600">+12%p</span>, 수기 정정 <span class="text-brand-600">–8%p</span>, 클레임 <span class="text-brand-600">0건</span>`,

  // ===== 다운로드 링크 (Notion: 사이트 설정) =====
  downloads: {
    "resume_kr": "",
    "resume_en": "",
    "portfolio_kr": "",
    "portfolio_en": ""
},

  // ===== 교육 모달 상세 (Notion: 성장 기록 페이지 본문) =====
  modalDetails: {},

  // ===== 경력 프로젝트 (Notion: 케이스 스터디 DB, 유형=career) =====
  careerProjects: [],

  // ===== DX 사례 (Notion: 케이스 스터디 DB, 유형=dx) =====
  dxCases: {},

  // ===== 직무 교육 목록 (Notion: 성장 기록 DB, 유형=training) =====
  trainingList: [],

  // ===== 교육 정보 =====
  education: {
    'academic': `<div class="flex flex-col md:flex-row gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-100 transition duration-300 animate-[slideIn_0.4s_ease-out]"><div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100">🎓</div><div class="flex-1"><div class="flex flex-col md:flex-row md:items-center justify-between mb-2"><h4 class="text-xl font-bold text-slate-900 break-keep"></h4><span class="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full w-fit mt-2 md:mt-0"></span></div><p class="text-slate-700 font-bold mb-4 break-keep"></p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전체 평점</span><span class="text-lg font-bold text-slate-800"></span><span class="text-xs text-slate-400 ml-1">(학점 이수)</span></div><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전공 평점</span><span class="text-lg font-bold text-brand-600"></span><span class="text-xs text-slate-400 ml-1">(학점 이수)</span></div></div></div></div>`,
    'training': '',
    'activities': '',
    'skills': `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[slideIn_0.4s_ease-out]"><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">📊</span><h4 class="text-lg font-bold text-slate-900">Data & Analytics</h4></div><ul class="space-y-3 text-sm text-slate-600"></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">⚙️</span><h4 class="text-lg font-bold text-slate-900">Automation & Dev</h4></div><ul class="space-y-3 text-sm text-slate-600"></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">🤖</span><h4 class="text-lg font-bold text-slate-900">HR Tech & AI</h4></div><ul class="space-y-3 text-sm text-slate-600"></ul></div><div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">📝</span><h4 class="text-lg font-bold text-slate-900">Office & Documentation</h4></div><ul class="space-y-3 text-sm text-slate-600"></ul></div></div>`
  },

  // ===== 주요 활동 (Notion: 성장 기록 DB, 유형=activity) =====
  activitiesList: []

};
