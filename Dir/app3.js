var output = [];
var n = AR.length;

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
AR.sort(GetSortOrder("nameWithOwner"));

function removeDuplicates(arr, n) {

    if (n == 0 || n == 1)
        return n;

    var temp = new Array(n);

    var j = 0;
    for (var i = 0; i < n - 1; i++)

        if (arr[i].nameWithOwner != arr[i + 1].nameWithOwner)
            temp[j++] = arr[i];

    temp[j++] = arr[n - 1];

    // Modify original array
    for (var i = 0; i < j; i++)
        arr[i] = temp[i];

    return j;
}
n = removeDuplicates(AR, n);

for (var i = 0; i < n; i++){
    //console.log(i + "\t" + AR[i].nameWithOwner);
    output.push(AR[i]);
}

let ijson = JSON.stringify(output, null, 4)
fs.writeFile(result, ijson, 'utf8', function () { });