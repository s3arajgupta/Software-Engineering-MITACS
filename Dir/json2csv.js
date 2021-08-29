var fs = require('fs');
var object = require('./allData/topicsCount.json');

//var CS = require('./destination.csv')

const JSONToCSV = require("json2csv").parse;

var csv = JSONToCSV(object);
fs.writeFileSync("./topicsCount.csv", csv);