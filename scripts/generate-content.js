#!/usr/bin/env node
// scripts/generate-content.js
// Notion DB → content.js 자동 생성기
// 실행: NOTION_API_KEY=... NOTION_DB_ID_CASES=... node scripts/generate-content.js

'use strict';

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DB_CASES    = process.env.NOTION_DB_ID_CASES;
const DB_GROWTH   = process.env.NOTION_DB_ID_GROWTH;
const DB_SKILLS   = process.env.NOTION_DB_ID_SKILLS;
const PAGE_SETTINGS = process.env.NOTION_PAGE_ID_SETTINGS;

// ──────────────────────────────────────────────
// 유틸: Notion 텍스트 → HTML (인라인 서식)
// ──────────────────────────────────────────────
function richTextToHtml(richText) {
  return richText.map(t => {
    let text = t.plain_text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (t.annotations.bold)   text = `<strong>${text}</strong>`;
    if (t.annotations.italic) text = `<em>${text}</em>`;
    if (t.annotations.code)   text = `<code>${text}</code>`;
    return text;
  }).join('');
}

function plainText(richText) {
  return richText.map(t => t.plain_text).join('');
}

function prop(page, name, fallback = '') {
  const p = page.properties[name];
  if (!p) return fallback;
  if (p.type === 'title')     return plainText(p.title);
  if (p.type === 'rich_text') return plainText(p.rich_text);
  if (p.type === 'select')    return p.select ? p.select.name : fallback;
  if (p.type === 'number')    return p.number ?? fallback;
  if (p.type === 'url')       return p.url ?? fallback;
  return fallback;
}

// ──────────────────────────────────────────────
// 유틸: Notion 페이지 블록 → HTML
// ──────────────────────────────────────────────
async function fetchBlocks(blockId) {
  const blocks = [];
  let cursor;
  do {
    const resp = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    blocks.push(...resp.results);
    cursor = resp.next_cursor;
  } while (cursor);

  for (const block of blocks) {
    if (block.type === 'table') {
      block._rows = await fetchBlocks(block.id);
    }
  }
  return blocks;
}

function buildTableHtml(tableBlock) {
  const rows = tableBlock._rows || [];
  const hasHeader = tableBlock.table.has_column_header;
  let html = '<div class="overflow-hidden border border-slate-200 rounded-xl"><table class="w-full text-sm text-left text-slate-600">';
  rows.forEach((row, i) => {
    const cells = row.table_row.cells.map(cell => richTextToHtml(cell)).join('');
    if (i === 0 && hasHeader) {
      html += `<thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200"><tr>${
        row.table_row.cells.map(c => `<th class="px-4 py-3">${richTextToHtml(c)}</th>`).join('')
      }</tr></thead><tbody class="divide-y divide-slate-100">`;
    } else {
      html += `<tr>${row.table_row.cells.map(c => `<td class="px-4 py-3">${richTextToHtml(c)}</td>`).join('')}</tr>`;
    }
  });
  if (hasHeader) html += '</tbody>';
  html += '</table></div>';
  return html;
}

function notionBlocksToHtml(blocks) {
  const parts = [];
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      parts.push(`<ul class="list-disc pl-4 text-sm text-slate-600 space-y-2">${listItems.join('')}</ul>`);
      listItems = [];
    }
  }

  for (const block of blocks) {
    const type = block.type;
    const data = block[type];

    if (type !== 'bulleted_list_item') flushList();

    switch (type) {
      case 'heading_1':
        parts.push(`<h3 class="text-brand-600">${richTextToHtml(data.rich_text)}</h3>`);
        break;
      case 'heading_2':
      case 'heading_3':
        parts.push(`<h4 class="text-brand-600">${richTextToHtml(data.rich_text)}</h4>`);
        break;
      case 'heading_4':
        parts.push(`<h5 class="text-slate-800 font-bold">${richTextToHtml(data.rich_text)}</h5>`);
        break;
      case 'paragraph':
        if (data.rich_text.length > 0) {
          parts.push(`<p class="text-slate-600 text-sm leading-relaxed">${richTextToHtml(data.rich_text)}</p>`);
        }
        break;
      case 'bulleted_list_item':
        listItems.push(`<li>${richTextToHtml(data.rich_text)}</li>`);
        break;
      case 'table':
        parts.push(buildTableHtml(block));
        break;
    }
  }
  flushList();
  return `<div class="space-y-4">${parts.join('')}</div>`;
}

// ──────────────────────────────────────────────
// HTML 빌더: 경력 케이스 모달
// ──────────────────────────────────────────────
function buildCareerModalHtml(problem, actions, results) {
  const toItems = text => text.split('\n').filter(Boolean)
    .map(s => `<li>${s.trim()}</li>`).join('');
  return `<div class="space-y-6"><div><h4 class="text-brand-600">🔍 문제 상황</h4><p class="text-slate-600 text-sm leading-relaxed">${problem}</p></div><div><h4 class="text-brand-600">🛠️ 실행 (Action)</h4><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2">${toItems(actions)}</ul></div><div><h4 class="text-brand-600">📈 결과 (Result)</h4><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2">${toItems(results)}</ul></div></div>`;
}

// ──────────────────────────────────────────────
// HTML 빌더: DX 케이스 카드
// ──────────────────────────────────────────────
function buildDxContentHtml(title, badge, background, solutions, result) {
  const toItems = text => text.split('\n').filter(Boolean).map(s => {
    const m = s.trim().match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (m) return `<li><span class="text-white font-bold">${m[1]}:</span> ${m[2]}</li>`;
    return `<li>${s.trim()}</li>`;
  }).join('');
  return `<div class="animate-[slideIn_0.3s_ease-out]"><div class="mb-6"><span class="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10">${badge}</span><h3 class="text-2xl font-bold text-white mt-2 mb-2 break-keep">${title}</h3></div><div class="space-y-6"><div><strong class="text-slate-300 block mb-1 text-sm uppercase tracking-wider">Background & Problem</strong><p class="text-slate-400 text-sm leading-relaxed break-keep">${background}</p></div><div><strong class="text-brand-400 block mb-1 text-sm uppercase tracking-wider">Solution Logic</strong><ul class="text-slate-300 text-sm space-y-2 list-disc pl-4 break-keep">${toItems(solutions)}</ul></div><div class="pt-4 border-t border-slate-700"><strong class="text-emerald-400 block mb-1 text-sm uppercase tracking-wider">Result</strong><p class="text-white text-sm font-bold break-keep">${result}</p></div></div></div>`;
}

// ──────────────────────────────────────────────
// HTML 빌더: 스킬 섹션
// ──────────────────────────────────────────────
function buildSkillsHtml(skillsByCategory) {
  const icons = {
    'Data & Analytics': '📊',
    'Automation & Dev': '⚙️',
    'HR Tech & AI': '🤖',
    'Office & Documentation': '📝',
  };
  const colorMap = {
    blue:    'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple:  'bg-purple-100 text-purple-600',
    indigo:  'bg-indigo-100 text-indigo-600',
    slate:   'bg-slate-200 text-slate-600',
  };
  const order = ['Data & Analytics', 'Automation & Dev', 'HR Tech & AI', 'Office & Documentation'];

  const html = order.map(cat => {
    const skills = (skillsByCategory[cat] || []);
    const icon = icons[cat] || '🔧';
    const items = skills.map(s => {
      const cls = colorMap[s.color] || 'bg-slate-200 text-slate-600';
      return `<li class="flex justify-between items-center"><span>${s.name}</span><span class="text-xs font-bold ${cls} px-2 py-0.5 rounded">${s.level}</span></li>`;
    }).join('');
    return `<div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition"><div class="flex items-center gap-3 mb-4"><span class="text-2xl bg-white p-2 rounded-lg shadow-sm">${icon}</span><h4 class="text-lg font-bold text-slate-900">${cat}</h4></div><ul class="space-y-3 text-sm text-slate-600">${items}</ul></div>`;
  }).join('');

  return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[slideIn_0.4s_ease-out]">${html}</div>`;
}

// ──────────────────────────────────────────────
// HTML 빌더: 학력 섹션
// ──────────────────────────────────────────────
function buildAcademicHtml(s) {
  return `<div class="flex flex-col md:flex-row gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-100 transition duration-300 animate-[slideIn_0.4s_ease-out]"><div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100">🎓</div><div class="flex-1"><div class="flex flex-col md:flex-row md:items-center justify-between mb-2"><h4 class="text-xl font-bold text-slate-900 break-keep">${s.school}</h4><span class="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">${s.period}</span></div><p class="text-slate-700 font-bold mb-4 break-keep">${s.major}</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전체 평점</span><span class="text-lg font-bold text-slate-800">${s.gpaTotal}</span><span class="text-xs text-slate-400 ml-1">(${s.gpaCredits}학점 이수)</span></div><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전공 평점</span><span class="text-lg font-bold text-brand-600">${s.gpaMajor}</span><span class="text-xs text-slate-400 ml-1">(${s.gpaMajorCredits}학점 이수)</span></div></div></div></div>`;
}

// ──────────────────────────────────────────────
// Notion 데이터 페칭
// ──────────────────────────────────────────────
async function queryAll(dbId, filter, sorts) {
  const rows = [];
  let cursor;
  do {
    const resp = await notion.databases.query({ database_id: dbId, filter, sorts, start_cursor: cursor, page_size: 100 });
    rows.push(...resp.results);
    cursor = resp.next_cursor;
  } while (cursor);
  return rows;
}

async function fetchSettings() {
  const page = await notion.pages.retrieve({ page_id: PAGE_SETTINGS });
  return {
    resume_kr:             prop(page, 'resume_kr'),
    resume_en:             prop(page, 'resume_en'),
    portfolio_kr:          prop(page, 'portfolio_kr'),
    portfolio_en:          prop(page, 'portfolio_en'),
    school:                prop(page, 'academic_school'),
    major:                 prop(page, 'academic_major'),
    period:                prop(page, 'academic_period'),
    gpaTotal:              prop(page, 'academic_gpa_total'),
    gpaCredits:            prop(page, 'academic_gpa_credits'),
    gpaMajor:              prop(page, 'academic_gpa_major'),
    gpaMajorCredits:       prop(page, 'academic_gpa_major_credits'),
  };
}

async function fetchCases() {
  const rows = await queryAll(
    DB_CASES,
    { property: '상태', select: { equals: '발행' } },
    [{ property: '순서', direction: 'ascending' }]
  );

  const careerProjects = [];
  const dxCases = {};

  for (const row of rows) {
    const type = prop(row, '유형');
    if (type === 'career') {
      careerProjects.push({
        id:           `career_${prop(row, '순서') || careerProjects.length + 1}`,
        title:        prop(row, '제목'),
        sub:          prop(row, 'sub'),
        desc:         prop(row, 'desc'),
        modalContent: buildCareerModalHtml(
          prop(row, '문제'),
          prop(row, '액션'),
          prop(row, '결과')
        ),
      });
    } else if (type === 'dx') {
      const key = `dx${Object.keys(dxCases).length + 1}`;
      dxCases[key] = {
        title:   prop(row, '제목'),
        badge:   prop(row, '뱃지'),
        content: buildDxContentHtml(
          prop(row, '제목'),
          prop(row, '뱃지'),
          prop(row, '문제'),
          prop(row, '액션'),
          prop(row, '결과')
        ),
      };
    }
  }
  return { careerProjects, dxCases };
}

async function fetchGrowth() {
  const rows = await queryAll(
    DB_GROWTH,
    { property: '상태', select: { equals: '발행' } },
    [{ property: '순서', direction: 'ascending' }]
  );

  const trainingList = [];
  const activitiesList = [];
  const modalDetails = {};

  for (const row of rows) {
    const type = prop(row, '유형');
    const modalId = prop(row, '모달ID');

    if (type === 'training') {
      trainingList.push({
        id:       `tr${trainingList.length + 1}`,
        category: prop(row, '카테고리'),
        dates:    prop(row, '날짜'),
        title:    prop(row, '제목'),
        org:      prop(row, '기관'),
        desc:     prop(row, '설명'),
        status:   prop(row, '상태텍스트'),
        modalId:  modalId || undefined,
      });

      if (modalId) {
        const blocks = await fetchBlocks(row.id);
        if (blocks.length > 0) {
          modalDetails[modalId] = {
            title:    prop(row, '제목'),
            subtitle: prop(row, '설명'),
            content:  notionBlocksToHtml(blocks),
          };
        }
      }
    } else if (type === 'activity') {
      const blocks = await fetchBlocks(row.id);
      activitiesList.push({
        id:      `act${activitiesList.length + 1}`,
        title:   prop(row, '제목'),
        role:    prop(row, '역할'),
        period:  prop(row, '기간'),
        rank:    prop(row, '계급'),
        icon:    prop(row, '아이콘'),
        content: blocks.length > 0 ? notionBlocksToHtml(blocks) : '',
      });
    }
  }
  return { trainingList, activitiesList, modalDetails };
}

async function fetchSkills() {
  const rows = await queryAll(
    DB_SKILLS,
    { property: '상태', select: { equals: '발행' } },
    [{ property: '순서', direction: 'ascending' }]
  );

  const byCategory = {};
  for (const row of rows) {
    const cat = prop(row, '카테고리');
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({
      name:  prop(row, '스킬명'),
      level: prop(row, '레벨'),
      color: prop(row, '레벨색상'),
    });
  }
  return byCategory;
}

// ──────────────────────────────────────────────
// content.js 파일 생성
// ──────────────────────────────────────────────
function buildContentJs(data) {
  const { settings, careerProjects, dxCases, trainingList, activitiesList, modalDetails, skillsHtml, academicHtml } = data;

  const serialize = val => JSON.stringify(val, null, 2)
    .replace(/"modalContent":/g, 'modalContent:')
    .replace(/"content":/g, 'content:');

  return `// content.js - 포트폴리오 기본 콘텐츠 데이터
// !! 이 파일은 GitHub Actions (sync-notion.yml) 이 자동 생성합니다 !!
// 직접 편집하지 마세요 — Notion DB 에서 수정하세요.
// 마지막 생성: ${new Date().toISOString()}

const SITE_CONTENT = {

  // ===== 기본 정보 (하드코딩) =====
  profileName: "성명재",
  profileNameEn: "Sung Myeong Jae",
  profileTitle: "HR Operations",
  email: "proposition97@gmail.com",
  companyName: "오뚜기라면 인사팀",
  lastUpdated: "${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' }).replace(/\. /g, '.').replace('.', '')}",

  // ===== 히어로 섹션 (하드코딩) =====
  heroSubtitle: "HR Operations",
  heroDescription: \`ATS 도입 · 근태 시스템 재편 · 52시간 관리 · 업무 자동화<br>1년 안에 4개 영역을 직접 설계하고 작동시켰습니다.\`,
  heroHeadlineHTML: \`'원래 이랬어'를 <span class="text-brand-600">바꾸는</span> HR입니다.\`,
  heroImpactHTML: \`700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span class="text-brand-600">+12%p</span>, 수기 정정 <span class="text-brand-600">–8%p</span>, 클레임 <span class="text-brand-600">0건</span>\`,

  // ===== 다운로드 링크 (Notion: 사이트 설정) =====
  downloads: ${JSON.stringify(settings.downloads, null, 4)},

  // ===== 교육 모달 상세 (Notion: 성장 기록 페이지 본문) =====
  modalDetails: ${JSON.stringify(modalDetails, null, 4)},

  // ===== 경력 프로젝트 (Notion: 케이스 스터디 DB, 유형=career) =====
  careerProjects: ${JSON.stringify(careerProjects, null, 4)},

  // ===== DX 사례 (Notion: 케이스 스터디 DB, 유형=dx) =====
  dxCases: ${JSON.stringify(dxCases, null, 4)},

  // ===== 직무 교육 목록 (Notion: 성장 기록 DB, 유형=training) =====
  trainingList: ${JSON.stringify(trainingList, null, 4)},

  // ===== 교육 정보 =====
  education: {
    'academic': \`${academicHtml}\`,
    'training': '',
    'activities': '',
    'skills': \`${skillsHtml}\`
  },

  // ===== 주요 활동 (Notion: 성장 기록 DB, 유형=activity) =====
  activitiesList: ${JSON.stringify(activitiesList, null, 4)}

};
`;
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

  console.log('Fetching Notion data...');
  const [settings, caseData, growthData, skillsByCategory] = await Promise.all([
    fetchSettings(),
    fetchCases(),
    fetchGrowth(),
    fetchSkills(),
  ]);

  const academicHtml  = buildAcademicHtml(settings);
  const skillsHtml    = buildSkillsHtml(skillsByCategory);

  const content = buildContentJs({
    settings: {
      downloads: {
        resume_kr:    settings.resume_kr,
        resume_en:    settings.resume_en,
        portfolio_kr: settings.portfolio_kr,
        portfolio_en: settings.portfolio_en,
      },
    },
    careerProjects: caseData.careerProjects,
    dxCases:        caseData.dxCases,
    trainingList:   growthData.trainingList,
    activitiesList: growthData.activitiesList,
    modalDetails:   growthData.modalDetails,
    skillsHtml,
    academicHtml,
  });

  const outPath = path.join(__dirname, '..', 'content.js');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`content.js written (${content.length} bytes)`);
}

main().catch(err => { console.error(err); process.exit(1); });
