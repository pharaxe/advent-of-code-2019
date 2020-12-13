import * as lineReader from "line-reader";

const main = (lines: string[]): void => {
  console.log(lines);
}

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
