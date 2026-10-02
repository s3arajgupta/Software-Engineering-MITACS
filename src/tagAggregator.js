/**
 * Longitudinal Tag Aggregator.
 * Compiles yearly frequency distributions of tags across mined repositories.
 */

/**
 * Aggregate tags by year from a repository dataset.
 * @param {Array<Object>} repositories - Array of repository records
 * @returns {Record<string, Record<string, number>>} tagData mapping tag -> { year -> count }
 */
function aggregateTagsByYear(repositories) {
  if (!Array.isArray(repositories)) return {};
  const tagData = {};

  for (let i = 0; i < repositories.length; i++) {
    const project = repositories[i];
    if (!project) continue;

    const tags = project.tags || project._tags || [];
    if (!Array.isArray(tags) || tags.length === 0) continue;

    const createdAt = project.createdAt || "";
    const year = createdAt.length >= 4 ? createdAt.substring(0, 4) : "unknown";

    for (let j = 0; j < tags.length; j++) {
      const tag = String(tags[j]).trim().toLowerCase();
      if (!tag) continue;

      if (!tagData[tag]) {
        tagData[tag] = {};
      }
      if (!tagData[tag][year]) {
        tagData[tag][year] = 0;
      }
      tagData[tag][year]++;
    }
  }

  return tagData;
}

/**
 * Convert aggregated tag-year data to CSV format.
 * @param {Record<string, Record<string, number>>} tagData
 * @returns {string} CSV formatted content
 */
function toTagYearCsv(tagData) {
  let csv = "tag,year,count";
  const tags = Object.keys(tagData).sort();

  for (const tag of tags) {
    const years = Object.keys(tagData[tag]).sort();
    for (const year of years) {
      csv += `\n${tag},${year},${tagData[tag][year]}`;
    }
  }

  return csv;
}

module.exports = {
  aggregateTagsByYear,
  toTagYearCsv
};
