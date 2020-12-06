"use strict";

import * as lineReader from "line-reader";

const main = (lines) => {
  const numberOfYes = lines
    .reduce(groupLines, [""])
    .map((groupedLine) => groupedLine.split(""))
    .map((answersArray) => new Set(answersArray))
    .map((answerSets) => answerSets.size)
    .reduce((sum,cur) => sum + cur, 0);

  console.log(`Total number of group yeses is ${numberOfYes}`);
};

const groupLines = (accum, cur) => {
  if (cur.trim() === "") {
    accum.push("");
  } else {
    accum[accum.length - 1] += cur;
  }

  return accum;
};

const filename = process.argv[2];
const lines = [];
lineReader.eachLine(
  filename,
  (line) => {
    lines.push(line);
  },
  () => {
    main(lines);
  }
);
