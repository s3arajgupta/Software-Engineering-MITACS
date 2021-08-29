var fs = require('fs');
var AR = fs.readFileSync('./Tags_file_Ultimate.json');

//var CS = require('./destination.csv')

const JSONToCSV = require("json2csv").parse;

//var csv = JSONToCSV(AR);

var fileData = JSON.parse(AR);

var tagData = {};
for (var i = 0; i < fileData.length; i++) {
    var project = fileData[i];
    var tags = project["tags"]
    var year = project.createdAt.substring(0,4);

    for (var j = 0; j < tags.length; j++) {
        var tag = tags[j];
        if ( !(tag in tagData) )  tagData[tag] = {}
        if ( !(year in tagData[tag] ) ) tagData[tag][year] = 0;
        tagData[tag][year]++;
    }
}

var csvData = "tag,year,count";

for (tag in tagData){
    for (year in tagData[tag]) {
        csvData += "\n"+tag+","+year+","+tagData[tag][year];
    }
}


//var csv = JSONToCSV(tagData);

//fs.writeFileSync("./tags.json", JSON.stringify(tagData, null, 4));

fs.writeFileSync("./tagsCSV.csv", csvData);
