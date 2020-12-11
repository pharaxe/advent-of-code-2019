import * as lineReader from "line-reader";
import {cloneDeep} from "lodash-es";

type JoltageJumps = {
  ones: number;
  twos: number;
  threes: number;
}

const main = (lines: string[]) => {
  const jolts: number[] = [
    0,
    ...lines.map(num => parseInt(num, 10))
  ];
  jolts.sort((a, b) => a - b);

  const joltageForMyDevice: number = jolts[jolts.length - 1] + 3;
  jolts.push(joltageForMyDevice);

  const state: JoltageJumps = {
    ones: 0, twos: 0, threes: 0,
  };

  for (let i = 1; i < jolts.length; i++) {
    const difference = jolts[i] - jolts[i - 1];

    if (difference === 1) {
      state.ones++;
    } else if (difference === 2) {
      state.twos++;
    } else if (difference === 3) {
      state.threes++;
    }
  }

  const answer = state.ones * state.threes;
  console.log(answer);
}

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
