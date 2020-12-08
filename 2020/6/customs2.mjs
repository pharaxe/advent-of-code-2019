"use strict";

import * as lineReader from "line-reader";

const main = (lines) => {
  const numberOfYes = lines
    .reduce(linesToGroups, [[]])
    .map(findIntersectionOfGroups)
    .map((set) => set.size)
    .reduce((sum, cur) => sum + cur, 0);

  console.log(`Total number of group yeses is ${numberOfYes}`);
};

// A group is an array of sets of characters.
/**
 *  ex: group  = [
 *   {'a', 'b', c'},
 *   {'a', 'b'},
 *   {'b'}
 * ];
 *
 * would return 1 for 1 common answer
 */
const findIntersectionOfGroups = (group) => {
  return group.reduce((accum, cur, i) => {
    return intersection(accum, cur);
  }, group[0]);
};

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

const linesToGroups = (accum, cur) => {
  if (cur.trim() === "") {
    accum.push([]);
  } else {
    const topOfGroups = accum.length - 1;
    accum[topOfGroups].push(new Set());
    const topPerson = accum[topOfGroups].length - 1;
    cur.split("").forEach((character) => {
      accum[topOfGroups][topPerson].add(character);
    });
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
