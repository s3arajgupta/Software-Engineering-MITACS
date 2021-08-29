var fs = require('fs');
var AR = require('./Tags_file_Ultimate.json');
var result = 'Tags_file_Final_2nd.json';
var output = [];

var possible = require('./RepoTopics_copy.json');

var getTagsInDescription = function (dict, description) {
    let res = [];
    for (var j = 0; j < dict.length; j++) {
        var _topic = dict[j].toLowerCase();
        var variant1 = _topic;
        var splittedTag = _topic.split("-"); //.join(" ");
        //console.log(variant2)
        //if (description.indexOf(variant1)!=-1) 
        //    res.push(_topic);
        //else {
        var splittedDescription = description.split(" ");
        if (keyWordPresent(splittedTag, splittedDescription, _topic))
            res.push(_topic)
        //}
    }
    return res;
}


var keyWordPresent = function (arr1, arr2, keyword) {
    var res = false;
    if (arr1.length == 0) return false;
    for (var j = 0; j < arr2.length; j++) {
        if (arr2[j] == keyword) return true;
        if (arr2[j] == arr1[0]) {
            var matched = 1;
            for (var i = 1; i < arr1.length && (j + i) < arr2.length; i++)
                if (arr1[i] == arr2[j + i]) matched++;
            if (matched == arr1.length) return true;
        }
    }
    return false;
}

//Test
testDict = ["3d", "3d-graphics", "unity", "unity3d"];
testDescription = "this is a 3d graphics project made with unity";

//3d-graphics, look  for 3d-graphics or work with ["3d", "graphics"] try to find it in ["this", "is", 

testTags = getTagsInDescription(testDict, testDescription);
console.log(JSON.stringify(testTags));

for (var i = 0; i < AR.length; i++) {

    let createdAt = AR[i].createdAt;
    let nameWithOwner = AR[i].nameWithOwner;
    let stargazerCount = AR[i].stargazerCount;
    let description = AR[i].description.toLowerCase();
    let repositoryTopics_list = AR[i].repositoryTopics_list
    let primaryLanguage = AR[i].primaryLanguage;
    let languages_list = AR[i].languages_list;
    let diskUsage = AR[i].diskUsage;
    let relatedTopics_list = AR[i].relatedTopics_list;
    let tags = [];

    /*
        let Words = [];
        Words = AR[i].description.split(' ');
        let Words_lenght = Words.length;
        for (var j = 0; j < Words_lenght; j++) {
            for (var k = 0; k < possible.length; k++) {
                if (possible[k].toLowerCase() == Words[j].toLowerCase())
                    tags.push(Words[j].toLowerCase());
            }
        }
    */
    tags = getTagsInDescription(possible, description)

    /*
        for (var c = 0; c < repositoryTopics_list.length; c++) {
            if (repositoryTopics_list != "null")
                for (var h = 0; h < possible.length; h++)
                    if (repositoryTopics_list[c] == possible[h])
                        tags.push(repositoryTopics_list[c].toLowerCase());
        }
        */

    tags.sort();
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
    Tags = uniq(tags);
    relatedTopics_list = "null";
    repositoryTopics_list = "null";
    languages_list = "null";
    if (stargazerCount >= 3) {
        //output.push({ Tags, createdAt, nameWithOwner, description});
        output.push({ Tags, createdAt, nameWithOwner, stargazerCount, description, repositoryTopics_list, primaryLanguage, languages_list, diskUsage, relatedTopics_list });
    }

}

let ijson = JSON.stringify(output, null, 4);

////console.log(ijson)

fs.writeFile(result, ijson, 'utf8', function () { });