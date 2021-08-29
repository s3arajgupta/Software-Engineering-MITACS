const addDays = require('./addDaysFunction.js');
var projectQuery = require('./projectQueryFunction.js');
var fs = require('fs');

var startDate = "2016-01-01"
var endDate = "2020-12-31"
var currentDate = startDate;

var tokens = [
    "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",
    "347209534ea3c5613e5edd9243d6606319775064",
    "b01ad824da7f15e715968aa3478eb04fd0111943",
    "0345c9d9665e7f77ba2534794156e36df6bf7c00",
    "272d41dab204ce9c27d901ed51d398055b039e98",
    "68549116dbf91b166cbf909247b8bd55fb33ea00",
    "c9c523aa5b8d139725e8a7b1ce257ad9da5eeadf",
    "b447ad975076e2960c2bc100aff39a137f292307",
    "4b6c816dd1719904d06a44bcf58311731ac194ba",
    "e8ae41e66cb3807b0396b1afd7324d822440bb58"
];
var tokenReset = [];
for (var tr = 0; tr < tokens.length; tr++) tokenReset.push("0");
var tokenRemaining = [];
for (var tr = 0; tr < tokens.length; tr++) tokenRemaining.push(-1);

const { graphql } = require("@octokit/graphql");
graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${tokens[0]}`
  }
});

issueNum = 0;
tokenNum = 0;
queryNum = 0;
console.log("Collecting")

executeQuery = async function (currentDate, _cursor) {
    try {
        while (tokenRemaining[tokenNum] != -1 && tokenRemaining[tokenNum] < 10) {
            // if (tokenReset[tokenNum] == "0") 
            //     break;

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

        console.log("=> "+ _cursor + "\t(" + tokenNum + "," + tokenRemaining[tokenNum] + ")");
        try {
            const { search, rateLimit } = await graphqlWithAuth(projectQuery(currentDate, _cursor));
            tokenReset[tokenNum] = rateLimit["resetAt"];
            tokenRemaining[tokenNum] = rateLimit["remaining"];

            if (search["repositoryCount"] > 0) console.log("Repos found:" + search["repositoryCount"]);

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

            fs.appendFile(output, json, 'utf8', function () { });

            if (pageInfo["hasNextPage"]) {
                cursor = pageInfo["endCursor"];
                console.log("Next Page of Date: "+ currentDate);
            }
            else {
                console.log("No more pages left!\n")
                return;
            }

            executeQuery(currentDate, cursor);
        }
        catch (e) {
            console.log(e)
            queryNum--;
            setTimeout(function () {
                executeQuery(currentDate, _cursor);
            }, 300000);

        }

    }
    catch (e) {
        console.log(e);
        //fs.unlinkSync(output);
    }
}

executeQuery(currentDate, "");
var output = 'augmented_reality20.json';