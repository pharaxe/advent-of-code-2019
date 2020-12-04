"use strict";

import * as lineReader from "line-reader";

const calculateTreesHit = (slope, hill) => {
  let x = 0;
  let y = 0;
  const width = hill[0].length;
  let treesHit = 0;
  while (y <= hill.length - 1) {
    if (hill[y][x] === '#') {
      treesHit++;
    }
    x += slope[0];
    y += slope[1];
    if (x >= width) {
      x -= width; // loop around skifree style.
    }
  }
  return treesHit;
};

const solve = () => {
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  const treesHit = slopes.map(slope => calculateTreesHit(slope, lines));
  const answer = treesHit.reduce((accum, cur) => accum * cur, 1);
  console.log(`${treesHit} multiplied together is ${answer}`);
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
