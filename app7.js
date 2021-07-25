var fs = require('fs');
var AR = require('./Element.json');
var result = 'Tags_file_25.json';
var output = [];

var possible = require('./RepoTopics.json');

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
    for (var j = 0; j < Words_lenght; j++){
        for (var k = 0; k < possible.length; k++){
            if (possible[k].toLowerCase() == Words[j].toLowerCase())
                tags.push(Words[j].toLowerCase());
        }
    }

    for (var c = 0; c < repositoryTopics_list.length; c++) {
        if (repositoryTopics_list != "null")
            for (var h = 0; h < possible.length; h++)
                if ( repositoryTopics_list[c] == possible[h] )
                    tags.push(repositoryTopics_list[c].toLowerCase());
    }

    tags.sort();
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
    Tags = uniq(tags);
    
    if(stargazerCount>=3){
        //output.push({ Tags, createdAt, nameWithOwner, description});
        output.push({ Tags, createdAt, nameWithOwner, stargazerCount, description, repositoryTopics_list, primaryLanguage, languages_list, diskUsage, relatedTopics_list });
    }

}

let ijson = JSON.stringify(output, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });