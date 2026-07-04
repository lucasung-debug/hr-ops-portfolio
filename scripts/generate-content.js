#!/usr/bin/env node
// scripts/generate-content.js
// Notion DB → content.js 자동 생성기
// 실행: NOTION_API_KEY=... NOTION_DB_ID_CASES=... node scripts/generate-content.js

'use strict';

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
  if (p.type === 'status')    return p.status ? p.status.name : fallback;
  if (p.type === 'number')    return p.number ?? fallback;
  if (p.type === 'url')       return p.url ?? fallback;
  return fallback;
}

function propAny(page, names, fallback = '') {
  for (const name of names) {
    const value = prop(page, name, undefined);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}

const PUBLISH_STATUS_PROPERTY_ALIASES = [
  '상태',
  '선택',
  'publishStatus',
  'publish_status',
  'Publish Status',
  'Publication Status',
];

const PUBLISH_STATUS_VALUE_ALIASES = ['발행', 'Published', 'Publish', 'Live'];

const SKILL_CATEGORY_PROPERTY_ALIASES = [
  '카테고리',
  '카테코리',
  'category',
  'Category',
];

const GENERATED_ASSET_DIR = path.join(__dirname, '..', 'assets', 'notion');
const GENERATED_ASSET_PUBLIC_DIR = 'assets/notion';
const generatedAssetFiles = new Set();

const EVIDENCE_PAGE_URL = 'https://lucasung-debug.github.io/hermes-ops-dashboard-page/';

function normalizeTitle(title) {
  return String(title || '').replace(/\s+/g, '');
}

function stableHash(value, length = 12) {
  return crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, length);
}

function safeFilePart(value, fallback = 'asset') {
  const safe = String(value || '')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return safe || fallback;
}

function extensionFromUrl(url) {
  try {
    const ext = path.extname(decodeURIComponent(new URL(url).pathname)).toLowerCase();
    if (/^\.(jpg|jpeg|png|webp|gif|pdf)$/.test(ext)) return ext;
  } catch {
    return '';
  }
  return '';
}

function extensionFromContentType(contentType) {
  const normalized = String(contentType || '').split(';')[0].trim().toLowerCase();
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
  };
  return map[normalized] || '';
}

function isNotionTemporaryUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'prod-files-secure.s3.us-west-2.amazonaws.com'
      || parsed.searchParams.has('X-Amz-Signature')
      || parsed.searchParams.has('X-Amz-Credential')
      || parsed.searchParams.has('X-Amz-Date');
  } catch {
    return false;
  }
}

function extractFileUrl(fileLike) {
  if (!fileLike) return null;
  if (fileLike.type === 'file') return fileLike.file?.url || null;
  if (fileLike.type === 'external') return fileLike.external?.url || null;
  return fileLike.file?.url || fileLike.external?.url || fileLike.url || null;
}

async function stableAssetUrl(sourceUrl, assetKey, label) {
  if (!sourceUrl || !isNotionTemporaryUrl(sourceUrl)) return sourceUrl || null;

  const parsed = new URL(sourceUrl);
  const extFromUrl = extensionFromUrl(sourceUrl);
  const urlFingerprint = stableHash(`${parsed.origin}${parsed.pathname}`);
  const safeKey = safeFilePart(assetKey, 'notion-asset');
  const baseName = `${safeKey}-${urlFingerprint}`;

  fs.mkdirSync(GENERATED_ASSET_DIR, { recursive: true });

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`[asset] Failed to download ${label}: HTTP ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = extFromUrl || extensionFromContentType(response.headers.get('content-type')) || '.bin';
  const fileName = `${baseName}${ext}`;
  const filePath = path.join(GENERATED_ASSET_DIR, fileName);

  if (!fs.existsSync(filePath) || !fs.readFileSync(filePath).equals(buffer)) {
    fs.writeFileSync(filePath, buffer);
  }

  generatedAssetFiles.add(fileName);
  return `${GENERATED_ASSET_PUBLIC_DIR}/${fileName}`;
}

function pruneUnusedGeneratedAssets() {
  if (!fs.existsSync(GENERATED_ASSET_DIR)) return;
  for (const entry of fs.readdirSync(GENERATED_ASSET_DIR)) {
    const filePath = path.join(GENERATED_ASSET_DIR, entry);
    if (fs.statSync(filePath).isFile() && !generatedAssetFiles.has(entry)) {
      fs.unlinkSync(filePath);
    }
  }
}

function evidenceUrlForCase(row, type, title) {
  const explicit = prop(row, 'evidenceUrl') || prop(row, '증거URL') || prop(row, '증거 URL') || prop(row, 'Evidence URL');
  if (explicit) return explicit;

  const normalized = normalizeTitle(title);
  if (type === 'dx') {
    if (normalized.includes('경조화환')) return `${EVIDENCE_PAGE_URL}#case-gift`;
    if (normalized.includes('전자서명')) return `${EVIDENCE_PAGE_URL}#case-sign`;
    if (normalized.includes('직무키워드')) return `${EVIDENCE_PAGE_URL}#case-keyword`;
  }
  if (type === 'career' && normalized.includes('직무분석기반채용홍보')) {
    return `${EVIDENCE_PAGE_URL}#case-recruit`;
  }
  return '';
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
        parts.push(`<h3 class="text-primary-600">${richTextToHtml(data.rich_text)}</h3>`);
        break;
      case 'heading_2':
      case 'heading_3':
        parts.push(`<h4 class="text-primary-600">${richTextToHtml(data.rich_text)}</h4>`);
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
  return `<div class="space-y-6"><div><h4 class="text-primary-600">🔍 문제 상황</h4><p class="text-slate-600 text-sm leading-relaxed">${problem}</p></div><div><h4 class="text-primary-600">🛠️ 실행 (Action)</h4><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2">${toItems(actions)}</ul></div><div><h4 class="text-primary-600">📈 결과 (Result)</h4><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2">${toItems(results)}</ul></div></div>`;
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
  return `<div class="flex flex-col md:flex-row gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-100 transition duration-300 animate-[slideIn_0.4s_ease-out]"><div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-100">🎓</div><div class="flex-1"><div class="flex flex-col md:flex-row md:items-center justify-between mb-2"><h4 class="text-xl font-bold text-slate-900 break-keep">${s.school}</h4><span class="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">${s.period}</span></div><p class="text-slate-700 font-bold mb-4 break-keep">${s.major}</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전체 평점</span><span class="text-lg font-bold text-slate-800">${s.gpaTotal}</span><span class="text-xs text-slate-400 ml-1">(${s.gpaCredits}학점 이수)</span></div><div class="bg-white p-4 rounded-xl border border-slate-100"><span class="text-xs text-slate-400 block mb-1">전공 평점</span><span class="text-lg font-bold text-primary-600">${s.gpaMajor}</span><span class="text-xs text-slate-400 ml-1">(${s.gpaMajorCredits}학점 이수)</span></div></div></div></div>`;
}

// ──────────────────────────────────────────────
// Notion 데이터 페칭
// ──────────────────────────────────────────────
async function queryAll(dbId, filter, sorts, label = 'database') {
  const rows = [];
  let cursor;
  const params = { database_id: dbId, sorts, page_size: 100 };
  if (filter) params.filter = filter;
  do {
    let resp;
    try {
      resp = await notion.databases.query({ ...params, start_cursor: cursor });
    } catch (e) {
      if (e.code === 'validation_error' && filter) {
        throw new Error(
          `[schema] ${label}: Notion rejected a publish filter. Refusing to query without the filter because that could publish drafts. ${e.message}`
        );
      }
      throw e;
    }
    rows.push(...resp.results);
    cursor = resp.next_cursor;
  } while (cursor);
  return rows;
}

function publishValueFilter(propertyName, propertyType) {
  const conditions = PUBLISH_STATUS_VALUE_ALIASES.map(value => ({
    property: propertyName,
    [propertyType]: { equals: value },
  }));
  return conditions.length === 1 ? conditions[0] : { or: conditions };
}

async function publishFilterForDatabase(dbId, label) {
  const db = await notion.databases.retrieve({ database_id: dbId });
  const properties = db.properties || {};
  const candidates = PUBLISH_STATUS_PROPERTY_ALIASES
    .map(name => ({ name, property: properties[name] }))
    .filter(item => item.property);

  const supported = candidates.find(item => ['select', 'status'].includes(item.property.type));
  if (!supported) {
    const found = candidates.length
      ? candidates.map(item => `${item.name} (${item.property.type})`).join(', ')
      : 'none';
    throw new Error(
      `[schema] ${label}: missing publish status property. Expected one of: ${PUBLISH_STATUS_PROPERTY_ALIASES.join(', ')}. Found: ${found}.`
    );
  }

  return {
    filter: publishValueFilter(supported.name, supported.property.type),
    propertyName: supported.name,
    propertyType: supported.property.type,
  };
}

async function fetchSettings() {
  const page = await notion.pages.retrieve({ page_id: PAGE_SETTINGS });
  // 먼저 페이지 속성에서 읽기
  const result = {
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
  // 속성에 학력 데이터가 없으면 본문 텍스트에서 "key: value" 형식 파싱
  if (!result.school) {
    const blocks = await fetchBlocks(PAGE_SETTINGS);
    const keyMap = {
      academic_school: 'school', academic_major: 'major',
      academic_period: 'period', academic_gpa_total: 'gpaTotal',
      academic_gpa_credits: 'gpaCredits', academic_gpa_major: 'gpaMajor',
      academic_gpa_major_credits: 'gpaMajorCredits',
      resume_kr: 'resume_kr', resume_en: 'resume_en',
      portfolio_kr: 'portfolio_kr', portfolio_en: 'portfolio_en',
    };
    for (const b of blocks) {
      const texts = b[b.type]?.rich_text;
      if (!texts) continue;
      const line = texts.map(t => t.plain_text).join('').trim();
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m && keyMap[m[1]]) {
        const key = keyMap[m[1]];
        if (!result[key]) result[key] = m[2].trim();
      }
    }
  }
  return result;
}

async function fetchCases() {
  const publishFilter = await publishFilterForDatabase(DB_CASES, 'Case studies');
  const rows = await queryAll(
    DB_CASES,
    publishFilter.filter,
    [{ property: '순서', direction: 'ascending' }],
    'Case studies'
  );

  const careerProjects = [];
  const dxCases = {};

  for (const row of rows) {
    const type = prop(row, '유형');
    if (type === 'career') {
      const title = prop(row, '제목');
      const evidenceUrl = evidenceUrlForCase(row, type, title);
      const project = {
        id:           `career_${prop(row, '순서') || careerProjects.length + 1}`,
        title,
        sub:          prop(row, 'sub'),
        desc:         prop(row, 'desc'),
        modalContent: buildCareerModalHtml(
          prop(row, '문제'),
          prop(row, '액션'),
          prop(row, '결과')
        ),
      };
      if (evidenceUrl) project.evidenceUrl = evidenceUrl;
      careerProjects.push(project);
    } else if (type === 'dx') {
      const key = `dx${Object.keys(dxCases).length + 1}`;
      const title = prop(row, '제목');
      const badge = prop(row, '뱃지');
      const evidenceUrl = evidenceUrlForCase(row, type, title);
      dxCases[key] = {
        title,
        badge,
        content: buildDxContentHtml(
          title,
          badge,
          prop(row, '문제'),
          prop(row, '액션'),
          prop(row, '결과')
        ),
      };
      if (evidenceUrl) dxCases[key].evidenceUrl = evidenceUrl;
    }
  }
  return {
    careerProjects,
    dxCases,
    sync: {
      publishedRows: rows.length,
      publishProperty: publishFilter.propertyName,
      publishPropertyType: publishFilter.propertyType,
    },
  };
}

async function fetchGrowth() {
  const publishFilter = await publishFilterForDatabase(DB_GROWTH, 'Growth records');
  const rows = await queryAll(
    DB_GROWTH,
    publishFilter.filter,
    [{ property: '순서', direction: 'ascending' }],
    'Growth records'
  );

  const trainingList = [];
  const activitiesList = [];
  const certificationList = [];
  const modalDetails = {};

  for (const row of rows) {
    const type = prop(row, '유형');
    const modalId = prop(row, '모달ID');

    if (type === 'training') {
      const blocks = await fetchBlocks(row.id);
      let certImage = null;

      for (const b of blocks) {
        if (b.type === 'image') {
          const img = b.image;
          const rawUrl = extractFileUrl(img);
          certImage = await stableAssetUrl(rawUrl, `training-${row.id}`, prop(row, '제목') || 'training image');
          break;
        }
        if (b.type === 'file' || b.type === 'pdf') {
          const rawUrl = extractFileUrl(b[b.type]);
          certImage = await stableAssetUrl(rawUrl, `training-${row.id}`, prop(row, '제목') || 'training file');
          if (certImage) break;
        }
      }

      trainingList.push({
        id:       `tr${trainingList.length + 1}`,
        category: prop(row, '카테고리'),
        dates:    prop(row, '날짜'),
        title:    prop(row, '제목'),
        org:      prop(row, '기관'),
        desc:     prop(row, '설명'),
        status:   prop(row, '상태텍스트'),
        certImage: certImage,
        modalId:  modalId || undefined,
      });

      if (modalId && blocks.length > 0) {
        modalDetails[modalId] = {
          title:    prop(row, '제목'),
          subtitle: prop(row, '설명'),
          content:  notionBlocksToHtml(blocks),
          certImage: certImage,
        };
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
    } else if (type === 'certification') {
      const blocks = await fetchBlocks(row.id);
      let credentialUrl = null;
      for (const b of blocks) {
        if (b.type === 'bookmark' && b.bookmark && b.bookmark.url) {
          credentialUrl = b.bookmark.url;
          break;
        }
        if (b.type === 'file' || b.type === 'pdf') {
          const rawUrl = extractFileUrl(b[b.type]);
          credentialUrl = await stableAssetUrl(rawUrl, `credential-${row.id}`, prop(row, '제목') || 'credential file');
          if (credentialUrl) break;
        }
        if (b.type === 'paragraph' && b.paragraph && b.paragraph.rich_text) {
          for (const t of b.paragraph.rich_text) {
            if (t.href) { credentialUrl = t.href; break; }
          }
          if (credentialUrl) break;
        }
      }
      certificationList.push({
        id:            `cert_${certificationList.length + 1}`,
        title:         prop(row, '제목'),
        org:           prop(row, '기관'),
        date:          prop(row, '날짜'),
        icon:          prop(row, '아이콘') || '📜',
        desc:          prop(row, '설명'),
        credentialUrl: credentialUrl,
      });
    }
  }
  return {
    trainingList,
    activitiesList,
    certificationList,
    modalDetails,
    sync: {
      publishedRows: rows.length,
      publishProperty: publishFilter.propertyName,
      publishPropertyType: publishFilter.propertyType,
    },
  };
}

async function fetchSkills() {
  const publishFilter = await publishFilterForDatabase(DB_SKILLS, 'Skills');
  const rows = await queryAll(
    DB_SKILLS,
    publishFilter.filter,
    [{ property: '순서', direction: 'ascending' }],
    'Skills'
  );

  const byCategory = {};
  for (const row of rows) {
    const cat = propAny(row, SKILL_CATEGORY_PROPERTY_ALIASES, 'Uncategorized');
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({
      name:  prop(row, '스킬명'),
      level: prop(row, '레벨'),
      color: prop(row, '레벨색상'),
    });
  }
  return {
    byCategory,
    sync: {
      publishedRows: rows.length,
      categories: Object.keys(byCategory).length,
      publishProperty: publishFilter.propertyName,
      publishPropertyType: publishFilter.propertyType,
    },
  };
}

// ──────────────────────────────────────────────
// content.js 파일 생성
// ──────────────────────────────────────────────
function buildContentJs(data) {
  const { settings, careerProjects, dxCases, trainingList, activitiesList, certificationList, modalDetails, skillsHtml, academicHtml } = data;

  const serialize = val => JSON.stringify(val, null, 2)
    .replace(/"modalContent":/g, 'modalContent:')
    .replace(/"content":/g, 'content:');

  return `// content.js - 포트폴리오 기본 콘텐츠 데이터
// !! 이 파일은 GitHub Actions (sync-notion.yml) 이 자동 생성합니다 !!
// 직접 편집하지 마세요 — Notion DB 에서 수정하세요.

const SITE_CONTENT = {

  // ===== 기본 정보 (하드코딩) =====
  profileName: "성명재",
  profileNameEn: "Sung Myeong Jae",
  profileTitle: "HR Operations",
  email: "proposition97@gmail.com",
  companyName: "오뚜기라면 인사팀",
  lastUpdated: "${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}",

  // ===== 히어로 섹션 (하드코딩) =====
  heroSubtitle: "HR Operations",
  heroDescription: \`ATS 도입 · 근태 시스템 재편 · 52시간 관리 · 업무 자동화<br>1년 안에 4개 영역을 직접 설계하고 작동시켰습니다.\`,
  heroHeadlineHTML: \`'원래 이랬어'를 <span style="color: var(--primary)">바꾸는</span> HR입니다.\`,
  heroImpactHTML: \`700명 규모 사업장 근태 시스템 재설계 →<br>인식률 <span style="color: var(--primary)">+12%p</span>, 수기 정정 <span style="color: var(--primary)">–8%p</span>, 클레임 <span style="color: var(--primary)">0건</span>\`,

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

  // ===== 자격 & 어학 (Notion: 성장 기록 DB, 유형=certification) =====
  certificationList: ${JSON.stringify(certificationList, null, 4)},

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

function printSyncSummary(settings, caseData, growthData, skillData, contentLength) {
  const totalSkills = Object.values(skillData.byCategory)
    .reduce((sum, items) => sum + items.length, 0);

  console.log('Sync summary:');
  console.log(`- Case studies: ${caseData.sync.publishedRows} published rows using "${caseData.sync.publishProperty}" (${caseData.sync.publishPropertyType})`);
  console.log(`  - Career projects: ${caseData.careerProjects.length}`);
  console.log(`  - DX cases: ${Object.keys(caseData.dxCases).length}`);
  console.log(`- Growth records: ${growthData.sync.publishedRows} published rows using "${growthData.sync.publishProperty}" (${growthData.sync.publishPropertyType})`);
  console.log(`  - Training: ${growthData.trainingList.length}`);
  console.log(`  - Activities: ${growthData.activitiesList.length}`);
  console.log(`  - Certifications: ${growthData.certificationList.length}`);
  console.log(`- Skills: ${skillData.sync.publishedRows} published rows across ${skillData.sync.categories} categories using "${skillData.sync.publishProperty}" (${skillData.sync.publishPropertyType})`);
  console.log(`  - Skill items rendered: ${totalSkills}`);
  console.log(`- Stable Notion assets: ${generatedAssetFiles.size} files in ${GENERATED_ASSET_PUBLIC_DIR}`);

  const missingSettings = [
    ['resume_kr', settings.resume_kr],
    ['resume_en', settings.resume_en],
    ['portfolio_kr', settings.portfolio_kr],
    ['portfolio_en', settings.portfolio_en],
    ['academic_school', settings.school],
    ['academic_major', settings.major],
    ['academic_period', settings.period],
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missingSettings.length) {
    console.warn(`[warn] Settings page is missing recommended values: ${missingSettings.join(', ')}`);
  }

  console.log(`- content.js size: ${contentLength} bytes`);
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
  const [settings, caseData, growthData, skillData] = await Promise.all([
    fetchSettings(),
    fetchCases(),
    fetchGrowth(),
    fetchSkills(),
  ]);
  pruneUnusedGeneratedAssets();

  const skillsByCategory = skillData.byCategory;
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
    trainingList:      growthData.trainingList,
    activitiesList:    growthData.activitiesList,
    certificationList: growthData.certificationList,
    modalDetails:      growthData.modalDetails,
    skillsHtml,
    academicHtml,
  });

  const outPath = path.join(__dirname, '..', 'content.js');
  fs.writeFileSync(outPath, content, 'utf8');
  printSyncSummary(settings, caseData, growthData, skillData, content.length);
  console.log(`content.js written (${content.length} bytes)`);
}

main().catch(err => { console.error(err); process.exit(1); });
