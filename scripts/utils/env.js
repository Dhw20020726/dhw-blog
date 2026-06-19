const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf(':');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && value && !process.env[key]) process.env[key] = value;
  });
}

function hydrateAlgoliaEnv() { loadEnv(); }

function resolveAlgoliaEnv(opts = {}) {
  const result = {
    appId: process.env.ALGOLIA_APP_ID || process.env['Application ID'] || '',
    searchApiKey: process.env.ALGOLIA_SEARCH_API_KEY || process.env['Search API Key'] || '',
    indexName: process.env.ALGOLIA_INDEX_NAME || process.env['Index Name'] || 'dhw-blog',
    adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY || process.env['Admin API Key'] || '',
  };
  if (opts.requireAdmin && !result.adminApiKey) throw new Error('请在 .env 中设置 Admin API Key');
  if (opts.requireSearch && !result.searchApiKey) throw new Error('请在 .env 中设置 Search API Key');
  return result;
}

module.exports = { hydrateAlgoliaEnv, resolveAlgoliaEnv };
