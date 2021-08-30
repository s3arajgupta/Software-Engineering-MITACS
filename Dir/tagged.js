var fs = require('fs');
var output = [];
var result = './Dir/tagged.json';

var repos = require('./uniqueRepos.json');
var allTopics = require('./allData/allTopics.json');
var key = require('./allData/topicsFreqKey.json');

var getTagsInDescription = function (dict, description) {
    let res = [];
    for (var j = 0; j < dict.length; j++) {
        var _topic = dict[j].toLowerCase();
        var variant1 = _topic;
        var splittedTag = _topic.split("-"); //.join(" ");
        //console.log(variant2)
        //if (description.indexOf(variant1)!=-1) 
        //    res.push(_topic);
        var splittedDescription = description.split(" ");
        if (keyWordPresent(splittedTag, splittedDescription, _topic))
            res.push(_topic)
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

function uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}

{//Test
// testDict = ["3d", "3d-graphics", "unity", "unity3d"];
// testDescription = "this is a 3d graphics project made with unity";
// 3d-graphics, look  for 3d-graphics or work with ["3d", "graphics"] try to find it in ["this", "is", 
// testTags = getTagsInDescription(testDict, testDescription);
// console.log(JSON.stringify(testTags));
}

for (var i = 0; i < repos.length; i++) {

    let createdAt = repos[i].createdAt;
    let nameWithOwner = repos[i].nameWithOwner;
    let stargazerCount = repos[i].stargazerCount;
    let description = repos[i].description.toLowerCase();
    description = description.replace(/[^a-zA-Z ]/g, "");
    let repositoryTopicsList = repos[i].repositoryTopicsList
    stringfyRepositoryTopicsList = JSON.stringify(repositoryTopicsList);
    _stringfyRepositoryTopicsList = stringfyRepositoryTopicsList.replace(/[^a-zA-Z ]/g, " ");
    let primaryLanguage = repos[i].primaryLanguage;
    let languagesList = repos[i].languagesList;
    let diskUsage = repos[i].diskUsage;
    let relatedTopicsList = repos[i].relatedTopicsList;

    let tagsInDescription = [];
    tagsInDescription = getTagsInDescription(allTopics, description)
    tagsInDescription.sort();
    _tagsInDescription = uniq(tagsInDescription);
    let tagsFromDescription = [];

    //key Evaluate
    for (var k = 0; k < key.length ; k++){
        for (var j = 0; j < _tagsInDescription.length; j++) {
            temp = key[k].Key;
            // console.log(temp);
            if (temp == _tagsInDescription[j]){
                tagsFromDescription.push(key[k].Key);
            }
        }
    }

    let tagsInRepositoryTopicsList = [];
    tagsInRepositoryTopicsList = getTagsInDescription(allTopics, _stringfyRepositoryTopicsList);
    tagsInRepositoryTopicsList.sort();
    _tagsInRepositoryTopicsList = uniq(tagsInRepositoryTopicsList);
    let tagsFromRepositoryTopicsList = [];

    //key Evaluate
    for (var k = 0; k < key.length; k++) {
        for (var j = 0; j < _tagsInRepositoryTopicsList.length; j++) {
            temp = key[k].Key;
            // console.log(temp);
            if (temp == _tagsInRepositoryTopicsList[j]) {
                tagsFromRepositoryTopicsList.push(key[k].Key);
            }
        }
    }


    let tags = tagsFromDescription.concat(tagsFromRepositoryTopicsList);
    tags.sort();
    _tags = uniq(tags);
    // console.log(tags);
    
    // output.push({ _tags, createdAt, nameWithOwner, description});
    output.push({ _tags, createdAt, nameWithOwner, stargazerCount, description, repositoryTopicsList, primaryLanguage, languagesList, diskUsage, relatedTopicsList });
}

let ijson = JSON.stringify(output, null, 4);
fs.writeFile(result, ijson, 'utf8', function () { });