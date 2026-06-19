#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const matter = require('gray-matter');
const removeMd = require('remove-markdown');
const algoliasearch = require('algoliasearch');
const { hydrateAlgoliaEnv, resolveAlgoliaEnv } = require('./utils/env');

hydrateAlgoliaEnv();

const siteConfig = require('../docusaurus.config');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const OUTPUT_DIR = path.join(ROOT, 'build');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'algolia-index.json');
const MAX_CHUNK_LENGTH = 8000;
const SUMMARY_LENGTH = 500;
const DEFAULT_LANGUAGE = siteConfig.i18n?.defaultLocale || 'en';
const DEFAULT_DOCUSUARUS_TAGS = ['default', 'docs-default-current'];

const docsRouteBasePath = (() => {
  const presets = siteConfig.presets || [];
  const classicPreset = presets.find((p) => Array.isArray(p) && p[0] === 'classic');
  return classicPreset?.[1]?.docs?.routeBasePath?.replace(/^\//, '') || 'docs';
})();

function joinUrl(...parts) {
  return parts.filter(Boolean).map((p, i) => i === 0 ? p.replace(/\/$/, '') : p.replace(/^\/+/, '').replace(/\/$/, '')).join('/');
}

function normalizeSlug(rawSlug, relativePath) {
  const slug = rawSlug || relativePath;
  return slug.replace(/index$/i, '').replace(/\.mdx?$/, '').replace(/\/+$/, '').replace(/^\//, '');
}

function extractTitle(content, frontmatterTitle, fallback) {
  if (frontmatterTitle) return frontmatterTitle;
  const m = content.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  return fallback;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^\w一-鿿\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

function createSectionSlugger() {
  const seen = new Map();
  return {
    getUniqueSlug(section, heading) {
      const key = section ? `${section}::${heading}` : heading;
      const base = slugify(heading);
      if (!seen.has(key)) seen.set(key, new Set());
      const used = seen.get(key);
      let slug = base;
      let n = 2;
      while (used.has(slug)) slug = `${base}-${n++}`;
      used.add(slug);
      return slug;
    },
  };
}

function resolveHeadingAnchor({ level, text, currentSection, slugger }) {
  const slug = slugger.getUniqueSlug(currentSection, text);
  const sectionSlug = currentSection ? slugify(currentSection) : '';
  const anchor = sectionSlug ? `${sectionSlug}-${slug}` : slug;
  const sectionLabel = level === 2 ? text : currentSection;
  return { anchor, sectionLabel };
}

function chunkPlainText(lines) {
  const rawContent = lines.join('\n');
  const plain = removeMd(rawContent).replace(/\s+/g, ' ').trim();
  const truncated = plain.slice(0, MAX_CHUNK_LENGTH);
  const summary = truncated.length > SUMMARY_LENGTH ? truncated.slice(0, SUMMARY_LENGTH) : null;
  return { plain, truncated, summary };
}

function splitIntoChunks(parsed, options) {
  const { slug, relativePath, docTitle, url } = options;
  const lines = parsed.content.split(/\r?\n/);
  const headingRegex = /^(#{1,6})\s+(.+)$/;
  const anchorByLevel = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  const slugger = createSectionSlugger();
  let currentSection = '';
  let activeHeadingTitle = null;

  const records = [];
  let chunkLines = [];
  let chunkAnchor = null;
  let chunkTitle = docTitle;
  let chunkParent = url;
  let chunkIndex = 0;

  const pushChunk = () => {
    const { plain, truncated, summary } = chunkPlainText(chunkLines);
    if (!plain) { chunkLines = []; return; }
    const headingList = [currentSection || null, activeHeadingTitle].filter(Boolean);
    records.push({
      objectID: `${slug || relativePath}#${chunkIndex}`,
      title: chunkTitle,
      url: chunkAnchor ? `${url}#${chunkAnchor}` : url,
      url_without_anchor: url,
      anchor: chunkAnchor,
      type: 'content',
      summary,
      content: truncated || null,
      hierarchy: { lvl0: currentSection || docTitle, lvl1: activeHeadingTitle, lvl2: null, lvl3: null, lvl4: null, lvl5: null, lvl6: null },
      hierarchy_camel: { lvl0: currentSection || docTitle, lvl1: activeHeadingTitle, lvl2: null, lvl3: null, lvl4: null, lvl5: null, lvl6: null },
      parent: chunkParent,
      tags: parsed.data.tags || [],
      category: parsed.data.sidebar_label || parsed.data.category || undefined,
      source: relativePath,
      language: DEFAULT_LANGUAGE,
      docusaurus_tag: DEFAULT_DOCUSUARUS_TAGS,
      headings: headingList,
      doc_breadcrumb: currentSection || docTitle,
    });
    chunkLines = [];
    chunkIndex += 1;
  };

  lines.forEach((line) => {
    const m = line.match(headingRegex);
    if (m) {
      pushChunk();
      const level = m[1].length;
      const headingText = m[2].trim();
      const { anchor, sectionLabel } = resolveHeadingAnchor({ level, text: headingText, currentSection, slugger });
      anchorByLevel[level] = anchor;
      if (level === 2) currentSection = sectionLabel;
      else if (level < 2) currentSection = '';
      for (let i = level + 1; i <= 6; i++) anchorByLevel[i] = null;
      let parentAnchor = null;
      for (let i = level - 1; i >= 1; i--) if (anchorByLevel[i]) { parentAnchor = anchorByLevel[i]; break; }
      chunkAnchor = anchor;
      chunkTitle = headingText;
      activeHeadingTitle = headingText === currentSection ? null : headingText;
      chunkParent = parentAnchor ? `${url}#${parentAnchor}` : url;
      chunkLines = [];
      return;
    }
    if (!line.trim() && chunkLines.length > 0) { chunkLines.push(line); pushChunk(); return; }
    chunkLines.push(line);
  });
  pushChunk();
  return records;
}

function buildDocRecords(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const slug = normalizeSlug(parsed.data.slug, relativePath.replace(/\/index\.mdx?$/, '/').replace(/\.mdx?$/, ''));
  const docTitle = extractTitle(parsed.content, parsed.data.title, path.parse(relativePath).name);
  const url = joinUrl(siteConfig.url, siteConfig.baseUrl, docsRouteBasePath, slug);
  return splitIntoChunks(parsed, { slug, relativePath, docTitle, url });
}

function generateIndex() {
  if (!fs.existsSync(DOCS_DIR)) throw new Error('docs 目录不存在');
  const docFiles = fg.sync('**/*.{md,mdx}', { cwd: DOCS_DIR, absolute: true });
  const records = docFiles.flatMap((f) => buildDocRecords(f));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(records, null, 2), 'utf8');
  const { indexName } = resolveAlgoliaEnv();
  console.log(`已生成 ${records.length} 条记录至 ${OUTPUT_FILE}，索引名：${indexName}`);
  return records;
}

function readIndexFile() {
  if (!fs.existsSync(OUTPUT_FILE)) throw new Error('未找到 build/algolia-index.json，请先运行 npm run index:generate');
  return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
}

async function uploadIndex(recordsFromCaller) {
  const { appId, adminApiKey, indexName } = resolveAlgoliaEnv({ requireAdmin: true, requireSearch: true });
  const records = recordsFromCaller || readIndexFile();
  const client = algoliasearch(appId, adminApiKey);
  const index = client.initIndex(indexName);

  console.log(`App ID: ${appId}\n索引名: ${indexName}\n准备上传 ${records.length} 条记录...`);

  try {
    await index.replaceAllObjects(records, { safe: true });
    console.log('记录上传成功');
  } catch (err) {
    console.error('上传记录失败:', err.message);
    throw err;
  }

  try {
    await index.setSettings({
      searchableAttributes: ['hierarchy.lvl0', 'hierarchy.lvl1', 'hierarchy.lvl2', 'hierarchy.lvl3', 'hierarchy.lvl4', 'hierarchy.lvl5', 'hierarchy.lvl6', 'title', 'headings', 'summary', 'content'],
      attributesToSnippet: ['summary:50', 'content:25'],
      attributesToHighlight: ['hierarchy.lvl0', 'hierarchy.lvl1', 'hierarchy.lvl2', 'hierarchy.lvl3', 'hierarchy.lvl4', 'hierarchy.lvl5', 'hierarchy.lvl6', 'summary', 'content'],
      attributesForFaceting: ['filterOnly(tags)', 'filterOnly(category)', 'filterOnly(language)', 'filterOnly(docusaurus_tag)'],
    });
    console.log('索引设置更新成功');
  } catch (err) {
    console.error('设置索引失败:', err.message);
    throw err;
  }

  console.log('索引上传完成');
}

async function main() {
  const action = (process.argv[2] || 'generate').toLowerCase();
  if (action === 'generate') return generateIndex();
  if (action === 'upload') return await uploadIndex();
  if (action === 'all') { const records = generateIndex(); return await uploadIndex(records); }
  console.error('未知指令，请使用：generate | upload | all');
  process.exitCode = 1;
}

main().catch((err) => { console.error('Algolia 索引任务失败：', err.message); process.exitCode = 1; });
