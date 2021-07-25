var fs = require('fs');
var AR = require('./Element.json');
var result = 'RepoTopics.json';
var output = [];

var possible = require('./possible_Topics.json');

for (var i = 0; i < AR.length; i++) {

    let createdAt = AR[i].createdAt;
    let nameWithOwner = AR[i].nameWithOwner;
    let stargazerCount = AR[i].stargazerCount;
    let description = AR[i].description;
    let repositoryTopics_list = AR[i].repositoryTopics_list
    let primaryLanguage = AR[i].primaryLanguage;
    let languages_list = AR[i].languages_list;
    let diskUsage = AR[i].diskUsage;
    let relatedTopics_list = AR[i].relatedTopics_list;
    let tags = []

    let Words = [];
    Words = AR[i].description.split(' ');
    let Words_lenght = Words.length;
    for (var j = 0; j < Words_lenght; j++) {
        for (var k = 0; k < possible.length; k++) {
            if (possible[k] == Words[j])
                tags.push(Words[j]);
        }
    }

    let rep_lenght = repositoryTopics_list.length;
    if (repositoryTopics_list == undefined || repositoryTopics_list == "null") {
        continue;
    }
    else {
        if (stargazerCount >= 3) {
            for (var c = 0; c < rep_lenght; c++) {
                output.push(repositoryTopics_list[c]);
            }
        }
    }

    // if (stargazerCount >= 3) {
        // output.push(tags);
        // , createdAt, nameWithOwner, stargazerCount, description, repositoryTopics_list, primaryLanguage, languages_list, diskUsage, relatedTopics_list 
    
    // }
}

function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}

 topics = uniq(output);

let ijson = JSON.stringify(topics, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });