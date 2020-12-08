"use strict";
exports.__esModule = true;
var lineReader = require("line-reader");
var main = function (lines) {
    console.log("hello world");
};
var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
    lines.push(line);
    if (last) {
        main(lines);
    }
});
