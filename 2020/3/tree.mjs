"use strict";

import * as lineReader from "line-reader";

const solve = () => {
  let treesHit = 0;
  let x = 0;
  let y = 0;
  const width = lines[0].length;

  while (y < lines.length - 1) {
    if (lines[y][x] === '#') {
      treesHit++;
    }
    x += 3;
    y += 1;
    if (x >= width) {
      x -= width; // loop around skifree style.
    }
  }

  console.log(treesHit);
};

const lines = [];
const filename = process.argv[2];
lineReader.eachLine(
  filename,
  (line) => {
    lines.push(line);
  },
  () => {
    solve();
  }
);
