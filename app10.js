var fs = require('fs');
var AR = require('./Element.json');
var result = 'ElementALR.json';
var output = [];

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
    relatedTopics_list = "null";

    if (stargazerCount >= 3) {
        output.push({createdAt, nameWithOwner, stargazerCount, description, repositoryTopics_list, primaryLanguage, languages_list, diskUsage, relatedTopics_list });
    }
}

let ijson = JSON.stringify(output, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });