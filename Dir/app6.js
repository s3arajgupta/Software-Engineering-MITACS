var fs = require('fs');
var Topics = require('./countT.json');
var Description = require('./countD.json');
var result = 'possible_Topics.json';
var possible = [];
var notpossible = [];
var n = Topics.length;
var m = Description.length;

for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++){
        if (Topics[i] == Description[j]){
            possible.push(Topics[i]);
        }
        else {
            notpossible.push(Topics[i]);
        }
    }
}

function intersection(o1, o2) {
    return Object.keys(o1).concat(Object.keys(o2)).sort().reduce(function (r, a, i, aa) {
        if (i && aa[i - 1] === a) {
            r.push(a);
        }
        return r;
    }, []);
}
possible = intersection(Topics, Description);
// console.log(n);

let ijson = JSON.stringify(possible, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });
// let jjson = JSON.stringify(notpossible, null, 4)
// fs.appendFile(result, ijson, 'utf8', function () { });
