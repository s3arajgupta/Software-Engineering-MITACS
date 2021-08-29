var fs = require('fs');
var AR = require('./AR.json');
var result = 'Result.json';
var output = [];

for (var i = 0; i < AR.length; i++) {
    //  for (var j = 0; j < AR[i].search.edges.length; j++) {
    //  console.log(json[i].search.edges[j].node.id)
    let node = AR[i].search.edges[0].node;
    if (node == undefined) continue;
    
    //let databaseId = node.databaseId;
    let createdAt = node.createdAt;
    let nameWithOwner = node.nameWithOwner;
    let stargazerCount = node.stargazerCount;
    let description = node.description;
    if (description == null) description = "null";
    let diskUsage = node.diskUsage;

    let languages = node.languages;
    let languages_list = [];
    if (languages.edges[0] == undefined){
        languages_list = "null";
        //console.log(i + '\t' + languages_list);
    }
    else{
        //console.log(i + "\t" + languages.edges.length);
        for (let j = 0; j < languages.edges.length; j++){
            languages_list.push(languages.edges[j].node.name);
        }
        // console.log(i + '\t' + languages_list);
    }

    let repositoryTopics = node.repositoryTopics;
    let repositoryTopics_list = [];
    let relatedTopics_list = [];
    if (repositoryTopics.edges[0] == undefined) repositoryTopics_list = "null";
    else{
        //console.log(i + "\t" + repositoryTopics.edges.length);
        for (let k = 0; k < repositoryTopics.edges.length; k++){
            repositoryTopics_list.push(repositoryTopics.edges[k].node.topic.name);
            //console.log(i + "\t" + repositoryTopics.edges.length);
            let relatedTopics = repositoryTopics.edges[k].node.topic.relatedTopics;
            if (relatedTopics == undefined) continue;
            else{
                for(let x = 0; x < relatedTopics.length; x++){
                    //console.log(i + "\t" + x + "\t" +  relatedTopics[x].name);
                    relatedTopics_list.push(relatedTopics[x].name);
                }
            }
        }
        //console.log(repositoryTopics_list);
        //console.log(i + "\t" + relatedTopics_list);
    }
    if (relatedTopics_list.length == 0) {
        relatedTopics_list = "null";
        //console.log(i + '\t' + relatedTopics_list);
    }

    let primaryLanguage = node.primaryLanguage;
    if (primaryLanguage ==  null) primaryLanguage = "null";
    else
        primaryLanguage = primaryLanguage.name;
        //console.log(i + '\t' + primaryLanguage);

    output.push({createdAt, nameWithOwner, stargazerCount, description, repositoryTopics_list, primaryLanguage, languages_list, diskUsage, relatedTopics_list});
    

}

let ijson = JSON.stringify(output, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });