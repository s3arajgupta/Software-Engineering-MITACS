var fs = require('fs');
var repos = require('./uniqueRepos.json');
var output = 'Dir/allData/topicsCount.json';
var topics = [];

var n = repos.length;
for (var i = 0; i < n; i++) {
    if (repos[i].repositoryTopicsList == "null") continue;
    else {
        for (var j = 0; j < repos[i].repositoryTopicsList.length; j++)
            topics.push(repos[i].repositoryTopicsList[j]);
    }
}

topics.sort();
function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
_topics = uniq(topics);
// console.log(_topics);


//Finding frequency of all Topics!!
var result = [];
var list = [];
var m = topics.length;

for (var i = 0; i < m; i++) {

    if (!result[topics[i]])
        result[topics[i]] = 0;
    ++result[topics[i]];
}
// console.log(result);

for (var key in result) {
    if (result.hasOwnProperty(key)) {
        var obj = {}
        var Topics = key;
        var Freq = result[key]
        obj = { Topics, Freq }
        // console.log(obj);
        list.push(obj);
    }
}

let ijson = JSON.stringify(list, null, 4)
fs.writeFile(output, ijson, 'utf8', function () { });