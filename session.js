/**
 * Longitudinal Tag Analysis Runner
 * Processes mined repository datasets and outputs tag frequency distributions by year.
 */

const fs = require('fs');
const path = require('path');
const { aggregateTagsByYear, toTagYearCsv } = require('./src/tagAggregator');

// Candidate dataset paths
const candidates = [
    process.argv[2],
    path.join(__dirname, 'Dir', 'tagged.json'),
    path.join(__dirname, 'Tags_file_Ultimate.json')
].filter(Boolean);

let inputFile = null;
for (const p of candidates) {
    if (fs.existsSync(p)) {
        inputFile = p;
        break;
    }
}

if (!inputFile) {
    console.error("Error: Could not find input dataset.");
    console.error("Searched candidates:", candidates);
    process.exit(1);
}

console.log(`Processing dataset from: ${inputFile}`);
const rawData = fs.readFileSync(inputFile, 'utf8');
const fileData = JSON.parse(rawData);

console.log(`Loaded ${fileData.length} repository records. Aggregating tags by year...`);
const tagData = aggregateTagsByYear(fileData);
const uniqueTagsCount = Object.keys(tagData).length;
console.log(`Found ${uniqueTagsCount} unique topics across all years.`);

// Save JSON distribution
const jsonOutPath = path.join(__dirname, 'tags.json');
fs.writeFileSync(jsonOutPath, JSON.stringify(tagData, null, 4), 'utf8');
console.log(`Exported JSON distribution to: ${jsonOutPath}`);

// Save CSV distribution
const csvData = toTagYearCsv(tagData);
const csvOutPath = path.join(__dirname, 'tagsCSV.csv');
fs.writeFileSync(csvOutPath, csvData, 'utf8');
console.log(`Exported CSV distribution to: ${csvOutPath}`);
