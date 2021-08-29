//import { require } from './node_modules/requirejs'; 
//var requirejs = require('requirejs');
//issues(first: 1, after:"Y3Vyc29yOnYyOpHOBEudOA==") 

var startDate = "2008-01-12"
var endDate = "2019-12-02"

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().substring(0, 10);
}

var currentDate = startDate;
/*
while (currentDate<=endDate){
  currentDate = addDays(currentDate,1);
  console.log(currentDate);
}
*/


var projectQuery = function (creationDate, _cursor) {
  if (_cursor != "") cursor = `, after:"${_cursor}"`;
  else cursor = "";
  creationQuery = `created:${creationDate}..${creationDate}`
  //repository(owner: "${_owner}", name: "${_name}") {
  //created:2008-01-01..2008-01-01 
  return `
  {
  search(first: 20${cursor}, query: "${creationQuery} stars:>=10 forks:>=10 pushed:>=2019-01-01 followers:>=10", type: REPOSITORY) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ... on Repository {
            nameWithOwner
            name
            owner {
              login
            }
            nameWithOwner
            createdAt
            description
            forkCount
            hasWikiEnabled
            hasIssuesEnabled
            hasProjectsEnabled
            homepageUrl
            isArchived
            isFork
            isLocked
            isMirror
            isPrivate
            isTemplate
            lockReason
            pushedAt
            updatedAt
            url
            watchers {
              totalCount
            }
            assignableUsers {
              totalCount
            }
            _releases: refs(refPrefix: "refs/tags/") {
              totalCount
            }
            _branches: refs(refPrefix: "refs/heads/") {
              totalCount
            }
            commitComments {
              totalCount
            }
            releases {
              totalCount
            }
            stargazers {
              totalCount
            }
            pullRequests {
              totalCount
            }
            issues {
              totalCount
            }
            commits: object(expression: "master") {
              ... on Commit {
                history(first: 0) {
                  totalCount
                }
              }
            }
            languages(first: 10) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`
}

var tokens = [
  "9f33d948e98e9f9f734fb4b1cb796cb6b6594bac",
  "a148df0d38e2569e6f1ba68fdf730194d82ca1cb",
  "6ef4838782a3afce38a101ccd72f1a4dcf5fa23e",
  "ec6d237098dacfa9b250baa99e9aef72aa92134a",
  "4d7e1458ef6f7051ad36c04ade5ec87fedb823cc",
  "bfc594224b6abf00b1bb13fade483556041de981",
  "05e9e89959605dccc5866068748669fb1a14e86d",
  "2d6520f1cc67645adc605542a6addf9a6c7b8c80",
  "85fda49df286c26305a7a1d41a40bbad2b72a814",
  "c4d2c0e45c4ed879e4f2a039e4aa97f4e811e946"
];

var tokenReset = [];
for (var tr = 0; tr < tokens.length; tr++) tokenReset.push("0");

var tokenRemaining = [];
for (var tr = 0; tr < tokens.length; tr++) tokenRemaining.push(-1);

console.log("start")
const { graphql } = require("@octokit/graphql");
graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${tokens[0]}`
  }
});
var fs = require('fs');

issueNum = 0;
tokenNum = 0;

queryNum = 0;

executeQuery0 = async function (currentDate, _cursor) {
  try {
    /*
    var parts = _projects[_i].replace("\r", "").split("/");
    var projectOwner = parts[0];
    var projectName = parts[1];
    */

    while (tokenRemaining[tokenNum] != -1 && tokenRemaining[tokenNum] < 10) {
      if (tokenReset[tokenNum] == "0") break;

      var currentTime = Date.now();
      var resetDate = new Date(tokenReset[tokenNum]);
      var resetTime = resetDate.getTime();
      if (currentTime > resetTime) break;
      tokenNum++;
      if (tokenNum >= tokens.length) tokenNum = 0;
      console.log(tokenNum);
      graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${tokens[tokenNum]}`
        }
      });
    }

    console.log(_cursor + "\t" + "|" + currentDate + "|" + "\t(" + tokenNum + "," + tokenRemaining[tokenNum] + ")");
    try {
      const { search, rateLimit } = await graphqlWithAuth(projectQuery(currentDate, _cursor));
      tokenReset[tokenNum] = rateLimit["resetAt"];
      tokenRemaining[tokenNum] = rateLimit["remaining"];

      if (search["repositoryCount"] > 0) console.log("Repos found:" + search["repositoryCount"]);
      //var json2 = JSON.stringify(rateLimit, null, 4);
      //console.log(json2);

      var json = "";
      var edges = search["edges"];
      var pageInfo = search["pageInfo"];
      for (var i = 0; i < edges.length; i++) {
        var idata = {
          "search": {
            "repositoryCount": search["repositoryCount"],
            "pageInfo": pageInfo,
            "edges": [edges[i]],
          }
        };
        var ijson = JSON.stringify(idata, null, 4);
        if (currentDate == startDate && _cursor == "" && i == 0)
          json = "[\n" + ijson;
        else json += ",\n" + ijson;
      }
      //if (edges.length==0) {
      //    json = ",\n" + JSON.stringify(search, null, 4);
      //}

      fs.appendFile(output, json, 'utf8', function () { });

      if (pageInfo["hasNextPage"]) {
        cursor = pageInfo["endCursor"];
        console.log("nextPage");
      }
      else if (currentDate < endDate) { //(new Date(currentDate).getTime()<new Date(endDate).getTime()){
        cursor = "";
        var oldDate = currentDate;
        currentDate = addDays(currentDate, 1);
        if (oldDate == currentDate) currentDate = addDays(currentDate, 2);
        //console.log("newDate:"+currentDate);         
      }
      else {
        //console.log("No more pages!\n" + json);
        return;
      }

      executeQuery0(currentDate, cursor);
    }
    catch (e) {
      console.log(e)
      queryNum--;
      setTimeout(function () {
        executeQuery0(currentDate, _cursor);
      }, 300000);

    }

  }
  catch (e) {
    console.log(e);
    //fs.unlinkSync(output);
  }
}

generateStatsLine = function (repo) {

}

var output = 'repositories0.json';
//var input = 'reposRN.txt';

executeQueries = async function (srcFile) {
  fs.readFile(srcFile, 'utf8', function read(err, data) {
    if (err) {
      console.log("Error:" + err);
    }
    else {
      //console.log(data);
      var projects = data.split("\n");
      //projects = ["facebook/react-native", "airbnb/lottie-react-native"]
      executeQuery0(projects, 0, "");
      /*
      //console.log(projects.length + ":\n" + projects[0]);
      for (var i = 0; i < projects.length; i++) {
        var parts = projects[i].replace("\r", "").split("/");
        var projectOwner = parts[0];
        var projectName = parts[1];
        console.log("*" + projectOwner + "|" + projectName + "*");
      }
      */
    }
  });
}

//executeQueries(input);

executeQuery0("2017-11-28", "Y3Vyc29yOjQ5");