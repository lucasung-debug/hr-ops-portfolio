#!/usr/bin/env node
// Temporary Phase C Notion setup runner. Remove after gate evidence is collected.

'use strict';

const NOTION_VERSION = '2022-06-28';
const HUB_PAGE_ID = '31bc27c2afbf8004a5b6e4b15d1faf9c';
const STATUS_MARKERS = ['마지막 반영', '마지막 확인', '동기화 실패'];
const QUICK_HEADING = '⚡ 빠른 실행';
const EDIT_HEADING = '✍️ 콘텐츠 편집';
const CHEATSHEET_HEADING = '📋 어떤 칸이 사이트에 나가는가';
const PUBLISH_HEADING = '🚀 발행 3단계';

const QUICK_LINKS = [
  ['사이트에 반영하기', 'https://hr-ops-portfolio.pages.dev/sync.html'],
  ['라이브 사이트 보기', 'https://hr-ops-portfolio.pages.dev/'],
  ['GitHub 실행 기록', 'https://github.com/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml'],
];

function notionId(id) {
  const compact = String(id || '').replace(/-/g, '');
  if (!/^[0-9a-f]{32}$/i.test(compact)) return id;
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join('-');
}

function apiKey() {
  if (!process.env.NOTION_API_KEY) throw new Error('Missing NOTION_API_KEY');
  return process.env.NOTION_API_KEY;
}

async function notion(method, endpoint, body) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey()}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`${method} ${endpoint} -> HTTP ${response.status}`);
  return data;
}

function plainText(richText) {
  return (richText || []).map(part => part.plain_text || '').join('');
}

function blockText(block) {
  if (!block || !block.type) return '';
  const data = block[block.type] || {};
  if (block.type === 'child_database') return data.title || '';
  if (block.type === 'child_page') return data.title || '';
  return plainText(data.rich_text);
}

function normalizedMarker(text) {
  return text.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function isStatusCallout(block) {
  if (block.type !== 'callout') return false;
  const text = normalizedMarker(blockText(block));
  return STATUS_MARKERS.some(marker => text.startsWith(marker));
}

function isEmptyParagraph(block) {
  return block.type === 'paragraph' && !blockText(block).trim();
}

function heading2(text) {
  return { object: 'block', type: 'heading_2', heading_2: { rich_text: richText(text) } };
}

function heading3(text) {
  return { object: 'block', type: 'heading_3', heading_3: { rich_text: richText(text) } };
}

function paragraph(text) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: richTextFromMarkup(text) } };
}

function bullet(text) {
  return { object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: richTextFromMarkup(text) } };
}

function richText(content, href) {
  const item = { type: 'text', text: { content } };
  if (href) item.href = href;
  if (href) item.text.link = { url: href };
  return [item];
}

function richTextFromMarkup(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let index = 0;
  for (const match of text.matchAll(regex)) {
    if (match.index > index) parts.push({ type: 'text', text: { content: text.slice(index, match.index) } });
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push({ type: 'text', text: { content: token.slice(2, -2) }, annotations: { bold: true } });
    } else {
      parts.push({ type: 'text', text: { content: token.slice(1, -1) }, annotations: { code: true } });
    }
    index = match.index + token.length;
  }
  if (index < text.length) parts.push({ type: 'text', text: { content: text.slice(index) } });
  return parts.length ? parts : richText(text);
}

function quickLinksParagraph() {
  const rich = [];
  QUICK_LINKS.forEach(([label, url], index) => {
    if (index) rich.push({ type: 'text', text: { content: ' · ' } });
    rich.push({ type: 'text', text: { content: label, link: { url } }, href: url });
  });
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: rich } };
}

async function listBlocks(pageId = notionId(HUB_PAGE_ID)) {
  const results = [];
  let cursor;
  do {
    const query = new URLSearchParams({ page_size: '100' });
    if (cursor) query.set('start_cursor', cursor);
    const data = await notion('GET', `/blocks/${pageId}/children?${query}`);
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

async function appendAfter(afterId, children) {
  const body = { children };
  if (afterId) body.after = afterId;
  const data = await notion('PATCH', `/blocks/${notionId(HUB_PAGE_ID)}/children`, body);
  return data.results || [];
}

async function deleteBlock(blockId) {
  await notion('DELETE', `/blocks/${blockId}`);
}

async function retrieveDatabase(databaseId) {
  return notion('GET', `/databases/${databaseId}`);
}

async function searchDatabases() {
  const data = await notion('POST', '/search', {
    filter: { property: 'object', value: 'database' },
    page_size: 100,
  });
  return data.results || [];
}

function propertyNames(db) {
  return Object.keys(db.properties || {});
}

function isSkillsDatabase(db) {
  const names = propertyNames(db);
  return names.includes('스킬명') && names.includes('레벨') && names.includes('레벨색상');
}

async function resolveSkillsDatabase() {
  const blocks = await listBlocks();
  for (const block of blocks.filter(item => item.type === 'child_database')) {
    try {
      const db = await retrieveDatabase(block.id);
      if (isSkillsDatabase(db)) return db;
    } catch {
      // Some child_database IDs may not be retrievable as database IDs in older API shapes.
    }
  }
  const databases = await searchDatabases();
  const matched = databases.filter(isSkillsDatabase);
  if (matched.length !== 1) {
    throw new Error(`Expected exactly one skills database, found ${matched.length}`);
  }
  return matched[0];
}

async function renameSkills() {
  const db = await resolveSkillsDatabase();
  const before = propertyNames(db);
  console.log(`SKILLS_DB_ID=${db.id}`);
  console.log(`SKILLS_SCHEMA_BEFORE=${before.join(' | ')}`);

  const patch = {};
  if (db.properties['카테코리']) {
    if (db.properties['카테고리']) throw new Error('Both 카테코리 and 카테고리 exist; refusing ambiguous rename');
    patch['카테코리'] = { name: '카테고리' };
  }
  if (db.properties['선택']) {
    if (db.properties['상태']) throw new Error('Both 선택 and 상태 exist; refusing ambiguous rename');
    patch['선택'] = { name: '상태' };
  }

  if (Object.keys(patch).length) {
    await notion('PATCH', `/databases/${db.id}`, { properties: patch });
    console.log(`RENAMED=${Object.keys(patch).join(' | ')}`);
  } else {
    console.log('RENAMED=none (already in target schema)');
  }

  const after = await retrieveDatabase(db.id);
  console.log(`SKILLS_SCHEMA_AFTER=${propertyNames(after).join(' | ')}`);
}

function findHeading(blocks, text) {
  return blocks.find(block => block.type === 'heading_2' && blockText(block) === text);
}

function indexOfBlock(blocks, block) {
  return blocks.findIndex(item => item.id === block?.id);
}

function sectionEnd(blocks, heading) {
  const start = indexOfBlock(blocks, heading);
  if (start < 0) return heading;
  let end = start;
  for (let i = start + 1; i < blocks.length; i += 1) {
    if (blocks[i].type === 'heading_2') break;
    end = i;
  }
  return blocks[end];
}

async function removeEmptyParagraphs() {
  const blocks = await listBlocks();
  const empty = blocks.filter(isEmptyParagraph);
  for (const block of empty) await deleteBlock(block.id);
  console.log(`EMPTY_PARAGRAPHS_DELETED=${empty.length}`);
}

async function ensureStatusFirst() {
  const blocks = await listBlocks();
  const statusBlocks = blocks.filter(isStatusCallout);
  if (statusBlocks.length !== 1) throw new Error(`Expected one status callout, found ${statusBlocks.length}`);
  const statusIndex = indexOfBlock(blocks, statusBlocks[0]);
  if (statusIndex !== 0) throw new Error(`Status callout is not first after empty-paragraph cleanup; index=${statusIndex}`);
  return statusBlocks[0];
}

async function ensureQuickActions() {
  let blocks = await listBlocks();
  const existing = findHeading(blocks, QUICK_HEADING);
  if (existing) {
    console.log('QUICK_ACTIONS=exists');
    return sectionEnd(blocks, existing);
  }
  const status = await ensureStatusFirst();
  const created = await appendAfter(status.id, [heading2(QUICK_HEADING), quickLinksParagraph()]);
  console.log('QUICK_ACTIONS=created');
  return created[created.length - 1];
}

async function ensureContentHeading(afterBlock) {
  let blocks = await listBlocks();
  const existing = findHeading(blocks, EDIT_HEADING);
  if (existing) {
    console.log('CONTENT_HEADING=exists');
    return existing;
  }
  const created = await appendAfter(afterBlock.id, [heading2(EDIT_HEADING)]);
  console.log('CONTENT_HEADING=created');
  return created[0];
}

async function ensureCheatsheet() {
  let blocks = await listBlocks();
  const existing = findHeading(blocks, CHEATSHEET_HEADING);
  if (existing) {
    console.log('CHEATSHEET=exists');
    return sectionEnd(blocks, existing);
  }
  const childDbs = blocks.filter(block => block.type === 'child_database');
  if (childDbs.length !== 3) throw new Error(`Expected three child databases, found ${childDbs.length}`);
  const created = await appendAfter(childDbs[childDbs.length - 1].id, [heading2(CHEATSHEET_HEADING), ...cheatsheetBlocks()]);
  console.log('CHEATSHEET=created');
  return created[created.length - 1];
}

async function ensurePublishSteps(afterBlock) {
  let blocks = await listBlocks();
  const existing = findHeading(blocks, PUBLISH_HEADING);
  if (existing) {
    console.log('PUBLISH_STEPS=exists');
    return;
  }
  await appendAfter(afterBlock.id, [
    heading2(PUBLISH_HEADING),
    bullet("① 행의 '상태'를 '발행'으로"),
    bullet("② '사이트에 반영하기' 클릭 (편집자 비밀번호)"),
    bullet('③ 이 페이지 맨 위 콜아웃에서 결과 확인 (1~2분)'),
  ]);
  console.log('PUBLISH_STEPS=created');
}

function cheatsheetBlocks() {
  return [
    heading3('공통 규칙'),
    bullet("행이 사이트에 나가는 조건: **'상태' 칸이 '발행'** 일 때만. 초안은 절대 안 나감."),
    bullet("**'순서' 칸의 숫자가 사이트 표시 순서**를 정함 (오름차순)."),
    bullet('페이지 본문 중 사이트가 이해하는 블록: **제목(대/중/소) · 일반 문단 · 글머리 기호 목록 · 표** 뿐. 번호 목록·콜아웃·토글·구분선·이미지(수료증 예외)는 **무시됨**.'),
    heading3('케이스 스터디 DB'),
    bullet('나가는 칸: 유형(career/dx) · 제목 · 순서 · sub · desc(career 카드 문구) · 뱃지(dx) · 문제 · 액션 · 결과 · evidenceUrl(증거 링크)'),
    bullet('⚠️ **이 DB의 페이지 본문은 사이트에 안 나감** — 내용은 전부 속성 칸에.'),
    bullet("'액션'과 '결과'는 줄바꿈마다 목록 항목 하나가 됨."),
    heading3('성장 기록 DB'),
    bullet('공통으로 나가는 칸: 유형(training/activity/certification) · 제목 · 순서 · 아이콘'),
    bullet("**training(교육)**: 카테고리 · 날짜 · 기관 · 설명 · 상태텍스트 + 본문 첫 이미지/파일 = 수료증 이미지. '모달ID'가 있으면 본문 전체가 상세 팝업으로 나감."),
    bullet('**activity(활동)**: 역할 · 기간 · 계급 + 본문 = 활동 상세 내용.'),
    bullet('**certification(자격증)**: 기관 · 날짜 · 설명 + 본문의 첫 북마크/파일/링크 = 증빙 링크.'),
    heading3('스킬 DB'),
    bullet('나가는 칸: 스킬명 · 레벨 · 레벨색상 · 카테고리 · 순서'),
    bullet('카테고리는 다음 4개 중 하나여야 표시됨: Data & Analytics / Automation & Dev / HR Tech & AI / Office & Documentation'),
    bullet('페이지 본문은 안 나감.'),
    heading3('사이트 설정 페이지'),
    bullet('`key: value` 형식의 줄만 읽힘 (resume_kr, resume_en, portfolio_kr, portfolio_en, academic_school, academic_major, academic_period, academic_gpa_total, academic_gpa_credits, academic_gpa_major, academic_gpa_major_credits)'),
    bullet('콜론(:)이 빠지거나 key 철자가 다르면 조용히 무시되니 주의.'),
  ];
}

async function buildHub() {
  await removeEmptyParagraphs();
  await ensureStatusFirst();
  const quickEnd = await ensureQuickActions();
  await ensureContentHeading(quickEnd);
  const cheatEnd = await ensureCheatsheet();
  await ensurePublishSteps(cheatEnd);
  await verifyHub();
}

function linkedHrefs(block) {
  const data = block[block.type] || {};
  return (data.rich_text || []).map(item => item.href || item.text?.link?.url).filter(Boolean);
}

function logStructure(blocks) {
  console.log('HUB_STRUCTURE_START');
  blocks.forEach((block, index) => {
    console.log(`${index + 1}. ${block.type}: ${blockText(block)}`);
  });
  console.log('HUB_STRUCTURE_END');
}

async function verifyHub() {
  const blocks = await listBlocks();
  logStructure(blocks);

  const statusIndexes = blocks.map((block, index) => isStatusCallout(block) ? index : -1).filter(index => index >= 0);
  const quick = findHeading(blocks, QUICK_HEADING);
  const edit = findHeading(blocks, EDIT_HEADING);
  const cheat = findHeading(blocks, CHEATSHEET_HEADING);
  const publish = findHeading(blocks, PUBLISH_HEADING);
  const childDbIndexes = blocks.map((block, index) => block.type === 'child_database' ? index : -1).filter(index => index >= 0);

  console.log(`STATUS_CALLOUT_COUNT=${statusIndexes.length}`);
  console.log(`CHILD_DATABASE_COUNT=${childDbIndexes.length}`);
  console.log(`CHILD_DATABASE_TITLES=${blocks.filter(block => block.type === 'child_database').map(blockText).join(' | ')}`);

  if (statusIndexes.length !== 1 || statusIndexes[0] !== 0) throw new Error('G-C2 status callout position failed');
  if (!quick || !edit || !cheat || !publish) throw new Error('G-C2 required heading missing');
  if (childDbIndexes.length !== 3) throw new Error('G-C2 expected exactly three child databases');

  const quickIndex = indexOfBlock(blocks, quick);
  const editIndex = indexOfBlock(blocks, edit);
  const cheatIndex = indexOfBlock(blocks, cheat);
  const publishIndex = indexOfBlock(blocks, publish);
  if (!(quickIndex > statusIndexes[0] && editIndex > quickIndex)) throw new Error('G-C2 quick/content order failed');
  if (!childDbIndexes.every(index => index > editIndex && index < cheatIndex)) throw new Error('G-C2 database section order failed');
  if (!(cheatIndex > Math.max(...childDbIndexes) && publishIndex > cheatIndex)) throw new Error('G-C2 cheatsheet/publish order failed');

  const quickParagraph = blocks[quickIndex + 1];
  const hrefs = quickParagraph ? linkedHrefs(quickParagraph) : [];
  const expectedLinks = QUICK_LINKS.map(([, url]) => url);
  console.log(`QUICK_LINKS=${hrefs.join(' | ')}`);
  if (!expectedLinks.every(url => hrefs.includes(url))) throw new Error('G-C2 quick links missing');

  const skillDb = await resolveSkillsDatabase();
  console.log(`SKILLS_SCHEMA_VERIFY=${propertyNames(skillDb).join(' | ')}`);
  console.log('VERIFY_PASS');
}

async function main() {
  const action = process.argv[2];
  if (action === 'rename-skills') return renameSkills();
  if (action === 'build-hub') return buildHub();
  if (action === 'verify') return verifyHub();
  throw new Error(`Unknown action: ${action || '(missing)'}`);
}

main().catch(error => {
  console.error(`PHASE_C_ERROR=${error.message}`);
  process.exitCode = 1;
});
