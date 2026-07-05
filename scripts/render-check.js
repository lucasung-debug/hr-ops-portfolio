#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { richTextToHtml, notionBlocksToHtml } = require('./generate-content');

function rt(text, extra = {}) {
  return [{
    type: 'text',
    plain_text: text,
    href: extra.href || null,
    annotations: {
      bold: false,
      italic: false,
      code: false,
      ...extra.annotations,
    },
  }];
}

function block(type, data) {
  return { type, [type]: data };
}

function check(name, actual, expected) {
  assert.strictEqual(actual, expected, name);
}

check(
  'rich text links keep text and escape href attributes',
  richTextToHtml(rt('Open', { href: 'https://example.com/?a=1&b=2' })),
  '<a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="noreferrer" class="underline">Open</a>'
);

check(
  'numbered_list_item renders ordered lists',
  notionBlocksToHtml([
    block('numbered_list_item', { rich_text: rt('First') }),
    block('numbered_list_item', { rich_text: rt('Second') }),
  ]),
  '<div class="space-y-4"><ol class="list-decimal pl-4 text-sm text-slate-600 space-y-2"><li>First</li><li>Second</li></ol></div>'
);

check(
  'divider renders hr',
  notionBlocksToHtml([block('divider', {})]),
  '<div class="space-y-4"><hr class="border-slate-200 my-4"></div>'
);

check(
  'callout renders slate box with emoji',
  notionBlocksToHtml([block('callout', { rich_text: rt('Note'), icon: { type: 'emoji', emoji: '✅' } })]),
  '<div class="space-y-4"><div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 flex gap-3"><span class="mt-0.5">✅</span><div>Note</div></div></div>'
);

check(
  'quote renders blockquote',
  notionBlocksToHtml([block('quote', { rich_text: rt('Quoted') })]),
  '<div class="space-y-4"><blockquote class="border-l-4 border-slate-200 pl-4 text-slate-500">Quoted</blockquote></div>'
);

check(
  'one-level nested lists render inside parent item',
  notionBlocksToHtml([{
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: rt('Parent') },
    has_children: true,
    _children: [
      block('numbered_list_item', { rich_text: rt('Child 1') }),
      block('numbered_list_item', { rich_text: rt('Child 2') }),
    ],
  }]),
  '<div class="space-y-4"><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2"><li>Parent<ol class="list-decimal pl-4 mt-2 space-y-1"><li>Child 1</li><li>Child 2</li></ol></li></ul></div>'
);

check(
  'existing headings paragraphs bullets and tables still render',
  notionBlocksToHtml([
    block('heading_1', { rich_text: rt('Heading') }),
    block('paragraph', { rich_text: rt('Paragraph', { annotations: { bold: true } }) }),
    block('bulleted_list_item', { rich_text: rt('Bullet') }),
    {
      type: 'table',
      table: { has_column_header: true },
      _rows: [
        { type: 'table_row', table_row: { cells: [rt('A'), rt('B')] } },
        { type: 'table_row', table_row: { cells: [rt('1'), rt('2')] } },
      ],
    },
  ]),
  '<div class="space-y-4"><h3 class="text-primary-600">Heading</h3><p class="text-slate-600 text-sm leading-relaxed"><strong>Paragraph</strong></p><ul class="list-disc pl-4 text-sm text-slate-600 space-y-2"><li>Bullet</li></ul><div class="overflow-hidden border border-slate-200 rounded-xl"><table class="w-full text-sm text-left text-slate-600"><thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200"><tr><th class="px-4 py-3">A</th><th class="px-4 py-3">B</th></tr></thead><tbody class="divide-y divide-slate-100"><tr><td class="px-4 py-3">1</td><td class="px-4 py-3">2</td></tr></tbody></table></div></div>'
);

console.log('render-check PASS');
