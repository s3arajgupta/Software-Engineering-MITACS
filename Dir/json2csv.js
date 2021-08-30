var fs = require('fs');
var object = require('./tagged.json');

//var CS = require('./destination.csv')

const JSONToCSV = require("json2csv").parse;

var csv = JSONToCSV(object);
fs.writeFileSync("./Dir/csv/tagged.csv", csv);