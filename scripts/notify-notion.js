#!/usr/bin/env node
// Notion sync status callout updater.

'use strict';

const fs = require('fs');
const path = require('path');

const NOTION_VERSION = '2022-06-28';
const DEFAULT_HUB_PAGE_ID = '31bc27c2afbf8004a5b6e4b15d1faf9c';
const MARKERS = ['마지막 반영', '마지막 확인', '동기화 실패'];
const SUMMARY_PATH = path.join(__dirname, '.sync-summary.json');

const args = process.argv.slice(2);
const capabilityCheck = args.includes('--capability-check');
const outcome = args.find(arg => !arg.startsWith('--')) || 'failed';

function requireToken() {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is missing');
  }
  return process.env.NOTION_API_KEY;
}

function hubPageId() {
  return formatNotionId(process.env.NOTION_SYNC_HUB_PAGE_ID || DEFAULT_HUB_PAGE_ID);
}

function formatNotionId(id) {
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

async function notionFetch(method, endpoint, body) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${requireToken()}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}

function richText(content) {
  return [{ type: 'text', text: { content } }];
}

function calloutBlock(content) {
  return {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: richText(content),
      icon: { type: 'emoji', emoji: content.startsWith('❌') ? '❌' : '✅' },
      color: 'gray_background',
    },
  };
}

function paragraphBlock(content) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: richText(content) },
  };
}

async function readJson(response, label) {
  if (!response.ok) {
    throw new Error(`${label} failed with HTTP ${response.status}`);
  }
  return response.json();
}

async function listTopLevelBlocks(pageId) {
  const results = [];
  let cursor;

  do {
    const query = new URLSearchParams({ page_size: '100' });
    if (cursor) query.set('start_cursor', cursor);
    const response = await notionFetch('GET', `/blocks/${pageId}/children?${query.toString()}`);
    const data = await readJson(response, 'List blocks');
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return results;
}

function plainText(parts) {
  return (parts || []).map(part => part.plain_text || '').join('');
}

function isStatusCallout(block) {
  if (block.type !== 'callout') return false;
  const text = plainText(block.callout.rich_text).replace(/^[✅❌]\s*/, '');
  return MARKERS.some(marker => text.startsWith(marker));
}

async function findStatusCallout(pageId) {
  const blocks = await listTopLevelBlocks(pageId);
  return { block: blocks.find(isStatusCallout), blocks };
}

function kstTimestamp() {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date())
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} KST`;
}

function readSummary() {
  try {
    return JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function appendCount(parts, label, value) {
  if (Number.isFinite(value)) parts.push(`${label} ${value}`);
}

function statusText(status) {
  const timestamp = kstTimestamp();
  if (status === 'unchanged') {
    return `✅ 마지막 확인: ${timestamp} — 변경 없음 (사이트가 이미 최신)`;
  }
  if (status === 'failed') {
    return `❌ 동기화 실패: ${timestamp} — GitHub Actions 로그 확인 필요`;
  }

  const summary = readSummary();
  const parts = [`✅ 마지막 반영: ${timestamp} — 변경 반영됨`];
  appendCount(parts, '케이스', summary.cases);
  appendCount(parts, '성장', summary.growth);
  appendCount(parts, '스킬', summary.skills);
  appendCount(parts, '이미지', summary.assets);
  return parts.join(' · ');
}

async function createStatusCallout(pageId, text, blocks) {
  const body = { children: [calloutBlock(text)] };
  if (blocks.length > 0) body.after = blocks[0].id;
  const response = await notionFetch('PATCH', `/blocks/${pageId}/children`, body);
  await readJson(response, 'Create status callout');
  console.log('Status callout created.');
}

async function updateStatusCallout(blockId, text) {
  const response = await notionFetch('PATCH', `/blocks/${blockId}`, {
    callout: calloutBlock(text).callout,
  });
  await readJson(response, 'Update status callout');
  console.log('Status callout updated.');
}

async function notify() {
  const status = ['changed', 'unchanged', 'failed'].includes(outcome) ? outcome : 'failed';
  const text = statusText(status);
  const pageId = hubPageId();
  const { block, blocks } = await findStatusCallout(pageId);

  if (block) {
    await updateStatusCallout(block.id, text);
  } else {
    await createStatusCallout(pageId, text, blocks);
  }

  console.log(`Notify Notion outcome: ${status}`);
  console.log(`Callout text: ${text}`);
}

async function runCapabilityCheck() {
  const pageId = hubPageId();
  const appendResponse = await notionFetch('PATCH', `/blocks/${pageId}/children`, {
    children: [paragraphBlock(`capability check ${new Date().toISOString()}`)],
  });
  console.log(`append status: ${appendResponse.status}`);

  if (!appendResponse.ok) {
    process.exitCode = 1;
    return;
  }

  const data = await appendResponse.json();
  const blockId = data.results && data.results[0] && data.results[0].id;
  if (!blockId) {
    process.exitCode = 1;
    return;
  }

  const deleteResponse = await notionFetch('DELETE', `/blocks/${blockId}`);
  console.log(`delete status: ${deleteResponse.status}`);
  process.exitCode = deleteResponse.ok ? 0 : 1;
}

if (capabilityCheck) {
  runCapabilityCheck().catch(error => {
    console.log('failed status: local_error');
    process.exitCode = 1;
  });
} else {
  notify().catch(error => {
    console.warn(`[warn] Notion notification skipped: ${error.message}`);
    process.exitCode = 0;
  });
}
