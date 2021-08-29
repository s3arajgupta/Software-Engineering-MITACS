var fs = require('fs');
var AR = require('./Element.json');
var result = 'countD.json';
var Topics = [];
var Description = [];
var n = AR.length;

for (var i = 0; i < n; i++) {
    //console.log(i + "\t");
    if (AR[i].repositoryTopics_list == "null") continue;
    else{
        for(var j = 0; j < AR[i].repositoryTopics_list.length; j++)
            Topics.push(AR[i].repositoryTopics_list[j]); 
    }
}
Topics.sort();
//console.log(Topics);

for (var i = 0; i < n; i++) {
    // console.log(i + "\t");
    if (AR[i].description == "null") continue;
    else {
        //Description.push(AR[i].description);
        let Words = [];
        Words = AR[i].description.split(' ');
        let Words_lenght = Words.length;
        for (var j = 0; j < Words_lenght; j++)
            Description.push(Words[j]);
        //console.log(Words[j]);
    }
}
Description.sort();
//console.log(Description);

var countT = {};
Topics.forEach(function (i) { countT[i] = (countT[i] || 0) + 1; });
//console.log(countT);
var countD = {};
Description.forEach(function (i) { countD[i] = (countD[i] || 0) + 1; });
// console.log(countD);

let ijson = JSON.stringify(countD, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });

// exports.array = Description;