//Removed 8 abnormal repos from ./allData/reposFromQuerry
//Can be added at discretion from ./allData/reposFromQuerry

var fs = require('fs');
var repos = require('./allData/cumilativeRepos.json');
var result = 'Dir/uniqueRepos.json';
var output = [];

for (var i = 0; i < repos.length; i++) {

    let node = repos[i].search.edges[0].node;
    if (node == undefined) continue;
    //let databaseId = node.databaseId;
    let createdAt = node.createdAt;
    let nameWithOwner = node.nameWithOwner;
    let stargazerCount = node.stargazerCount;
    let description = node.description;
    if (description == null) description = "null";
    let diskUsage = node.diskUsage;
    let languages = node.languages;
    let languagesList = [];
    if (languages.edges[0] == undefined){
        languagesList = "null";
        //console.log(i + '\t' + languages_list);
    }
    else{
        //console.log(i + "\t" + languages.edges.length);
        for (let j = 0; j < languages.edges.length; j++){
            languagesList.push(languages.edges[j].node.name);
        }
        // console.log(i + '\t' + languages_list);
    }

    let repositoryTopics = node.repositoryTopics;
    let repositoryTopicsList = [];
    let relatedTopicsList = [];
    if (repositoryTopics.edges[0] == undefined) repositoryTopicsList = "null";
    else{
        //console.log(i + "\t" + repositoryTopics.edges.length);
        for (let k = 0; k < repositoryTopics.edges.length; k++){
            repositoryTopicsList.push(repositoryTopics.edges[k].node.topic.name);
            //console.log(i + "\t" + repositoryTopics.edges.length);
            let relatedTopics = repositoryTopics.edges[k].node.topic.relatedTopics;
            if (relatedTopics == undefined) continue;
            else{
                for(let x = 0; x < relatedTopics.length; x++){
                    //console.log(i + "\t" + x + "\t" +  relatedTopics[x].name);
                    relatedTopicsList.push(relatedTopics[x].name);
                }
            }
        }

        /*
        For Simplicity assigning relatedTopics to "null"
        */
        // relatedTopicsList = "null";
        
    }
    if (relatedTopicsList.length == 0) {
        relatedTopicsList = "null";
        //console.log(i + '\t' + relatedTopics_list);
    }

    let primaryLanguage = node.primaryLanguage;
    if (primaryLanguage ==  null) primaryLanguage = "null";
    else
        primaryLanguage = primaryLanguage.name;
        //console.log(i + '\t' + primaryLanguage);

    if (stargazerCount >= 3) {
        output.push({ createdAt, nameWithOwner, stargazerCount, description, repositoryTopicsList, primaryLanguage, languagesList, diskUsage, relatedTopicsList});
    }

}

//Removing Duplicates

var n = output.length;

function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
output.sort(GetSortOrder("nameWithOwner"));

function removeDuplicates(arr, n) {
    
    let newArray = [];
    let uniqueObject = {};

    for (let i in arr) {
        title = arr[i]['nameWithOwner'];

        // Use the title as the index
        uniqueObject[title] = arr[i];
    }

    // Loop to push unique object into array
    for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }

    return newArray;
}
uniqueRepos = removeDuplicates(output, n);
// console.log(output);

let ijson = JSON.stringify(uniqueRepos, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });