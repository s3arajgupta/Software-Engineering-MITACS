var fs = require('fs');
var AR = require('./Dir/Topics.json');
var result = [];

var n = a.length;
for (var i = 0; i < n; i++) {

    if (!result[a[i]])
        result[a[i]] = 0;
    ++result[a[i]];
}
// console.log(result);

var list = []
for (var key in result){
    if (result.hasOwnProperty(key)) {
        var obj = {}
        var Topics = key;
        var Freq = result[key]
        obj = {Topics, Freq}
        // console.log(b);
        list.push(obj);
    }
}


let ijson = JSON.stringify(list, null, 4)
fs.writeFile(output, ijson, 'utf8', function () { });