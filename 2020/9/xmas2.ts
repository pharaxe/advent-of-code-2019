import * as lineReader from "line-reader";

const magicNumber = 22477624;

type XmasState = {
  list: number[];
  currentSum: number;
  startIndex: number;
  endIndex: number;
  foundAnswer: boolean;
};

const main = (lines: string[]) => {
  const state: XmasState = {
    list: [],
    foundAnswer: false,
    startIndex: 0,
    endIndex: 0,
    currentSum: 0,
  };
  // read in the intial preamble.
  state.list = lines.map((numString) => parseInt(numString));

  while (!state.foundAnswer) {
    calculateNewSum(state);
  }

  const magicSubList = state.list.splice(
    state.startIndex,
    state.endIndex - state.startIndex
  );
  magicSubList.sort((a,b) => a - b);
  const smallest = magicSubList.shift();
  const largest = magicSubList.pop();
  const finalAnswer = smallest + largest;
  console.log(`The magic answer is ${finalAnswer}`);
};

const calculateNewSum = (state: XmasState) => {
  state.endIndex++;
  state.currentSum += state.list[state.endIndex];

  if (state.currentSum === magicNumber) {
    state.foundAnswer = true;
  } else if (state.currentSum > magicNumber) {
    state.startIndex++;
    state.endIndex = state.startIndex;
    state.currentSum = state.list[state.startIndex];
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
