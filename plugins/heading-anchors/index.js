const { toString } = require('mdast-util-to-string');
const { visit } = require('unist-util-visit');

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

module.exports = function slugNormalizePlugin() {
  return (tree) => {
    const { getUniqueSlug } = createSectionSlugger();
    let currentSection = '';

    visit(tree, 'heading', (node) => {
      const text = toString(node).trim();
      if (node.depth === 2) {
        const slug = slugify(text);
        node.data = node.data || {};
        node.data.id = slug;
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.id = slug;
        currentSection = text;
        return;
      }

      const slug = getUniqueSlug(currentSection, text);
      const sectionSlug = currentSection ? slugify(currentSection) : '';
      const resolvedId = sectionSlug ? `${sectionSlug}-${slug}` : slug;

      node.data = node.data || {};
      node.data.id = resolvedId;
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = resolvedId;
    });
  };
};
