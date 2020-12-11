import * as lineReader from "line-reader";
import { cloneDeep } from "lodash-es";

const main = (lines: string[]) => {
  const jolts: number[] = [0, ...lines.map((num) => parseInt(num, 10))];
  jolts.sort((a, b) => a - b);

  const myDeviceJolts = jolts[jolts.length - 1] + 3;
  jolts.push(myDeviceJolts);

  const subSolutions: number[] = [];

  jolts.forEach((jolt) => {
    subSolutions[jolt] = solve(jolt, subSolutions);
  });

  console.log(subSolutions.pop());
};

const solve = (jolt: number, subSolutions: number[]): number => {
  if (jolt === 0) {
    return 1; // base case
  }

  return (
    getSubsolution(subSolutions, jolt - 1) +
    getSubsolution(subSolutions, jolt - 2) +
    getSubsolution(subSolutions, jolt - 3)
  );
};

const getSubsolution = (subSolutions: number[], i: number) => {
  if (i < 0 || subSolutions[i] === undefined) {
    return 0;
  } else {
    return subSolutions[i];
  }
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});

/*
(0) 1 (4)

---

(0) 1 2 (4)

---

(0) 1 2 3 (6)

(0) 1 3 (6)

---
(0) 1 4 (7)
(0) 1 2 4 (7)
(0) 1 2 3 4 (7)
(0) 1 3 4 (7)
---

(0) 1 2 5 (8)

---

(0) 1 2 3 5 (8)

(0) 1 3 5 (8)

---
(0) 1 4 5 (8)
(0) 1 2 4 5 (8)
(0) 1 2 3 4 5 (8)
(0) 1 3 4 5 (8)
*/
