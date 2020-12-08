import * as lineReader from "line-reader";

const main = (lines: string[]) => {
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
