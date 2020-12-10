import * as lineReader from "line-reader";

type XmasState = {
  queue: number[];
  validSums: Set<number>;
  preambleCount: number;
  hitInvalidNumber: boolean;
};

const main = (lines: string[]) => {
  const state: XmasState = {
    queue: [],
    validSums: new Set(),
    preambleCount: 25,
    hitInvalidNumber: false,
  };
  // read in the intial preamble.
  state.queue = lines.splice(0, 25).map((numString) => parseInt(numString));

  for (const line of lines) {
    calculateNewSums(state);
    const num: number = parseInt(line);

    if (state.validSums.has(num)) {
      state.queue.push(num);
      state.queue.shift();
    } else {
      console.log(`The first invalid number is ${num}.`)
      return;
    }
  }
};

const calculateNewSums = (state: XmasState) => {
  const combos = getCombinations(state.queue);
  state.validSums.clear();

  for (const combo of combos) {
    state.validSums.add(combo[0] + combo[1])
  }
};

const getCombinations = (
  list: number[],
  amount: number = 2
): [number, number][] => {
  const combos = [];

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      // check the numbers aren't the same?
      if (list[i] !== list[j]) {
        combos.push([list[i], list[j]]);
      }
    }
  }

  return combos;
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
