/**
 * Heuristic Topic & Tag Extraction utilities for repository descriptions.
 * Bridges Stack Overflow tag taxonomy and GitHub repository text metadata.
 */

/**
 * Escape regular expression special characters in a string.
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check if a tag or its hyphen-separated variants appear in the text.
 * Handles cases like 'unity-vr' appearing as 'unity vr' or 'unity-vr'.
 * @param {string} tag - Tag from taxonomy dictionary (e.g. '3d-graphics', 'unity')
 * @param {string} text - Repository name or description
 * @returns {boolean}
 */
function isTagInText(tag, text) {
  if (!tag || !text) return false;
  const cleanTag = tag.trim().toLowerCase();
  const cleanText = text.toLowerCase();

  // 1. Direct word-boundary regex match (treat +, #, - as token characters for languages like C++, C#)
  const escaped = escapeRegExp(cleanTag);
  const regex = new RegExp(`(^|[^a-zA-Z0-9_+#-])${escaped}([^a-zA-Z0-9_+#-]|$)`, "i");
  if (regex.test(cleanText)) return true;

  // 2. Hyphenated variant match (e.g. 'unity-vr' in 'unity vr')
  if (cleanTag.includes("-")) {
    const spaceVariant = cleanTag.replace(/-/g, " ");
    const spaceEscaped = escapeRegExp(spaceVariant);
    const spaceRegex = new RegExp(`(^|[^a-zA-Z0-9])${spaceEscaped}([^a-zA-Z0-9]|$)`, "i");
    if (spaceRegex.test(cleanText)) return true;
  }

  return false;
}

/**
 * Extract matching tags from a description or text using a dictionary.
 * @param {Array<string|{tag: string}>} dictionary - Array of tag strings or tag objects
 * @param {string} text - Repository name and/or description
 * @returns {string[]} Array of unique matched tags
 */
function extractTagsFromText(dictionary, text) {
  if (!text || !Array.isArray(dictionary)) return [];
  const matched = new Set();

  for (const item of dictionary) {
    const tag = typeof item === "string" ? item : (item.tag || item.Key || item.Topics);
    if (tag && isTagInText(tag, text)) {
      matched.add(tag.toLowerCase());
    }
  }

  return Array.from(matched).sort();
}

/**
 * Deduplicate an array of primitives.
 * @param {Array} arr
 * @returns {Array}
 */
function deduplicate(arr) {
  if (!Array.isArray(arr)) return [];
  return Array.from(new Set(arr)).sort();
}

module.exports = {
  escapeRegExp,
  isTagInText,
  extractTagsFromText,
  deduplicate
};
