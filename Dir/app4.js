var fs = require('fs');
var AR = require('./Tags_file.json');

//var CS = require('./destination.csv')

const JSONToCSV = require("json2csv").parse;

var csv = JSONToCSV(AR);
fs.writeFileSync("./Tagged.csv", csv);
