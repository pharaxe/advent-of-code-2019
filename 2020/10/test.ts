import * as lineReader from "line-reader";
import {cloneDeep} from "lodash-es";

const main = (lines: string[]) => {
}

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
