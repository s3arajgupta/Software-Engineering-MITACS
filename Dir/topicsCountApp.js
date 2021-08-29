var fs = require('fs');
var repos = require('./uniqueRepos.json');
var result = 'Dir/topicsCount.json';
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
//console.log(Topics);



let ijson = JSON.stringify(_topics, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });

// exports.array = Description;