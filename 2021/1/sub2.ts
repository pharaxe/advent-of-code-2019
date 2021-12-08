import * as lineReader from "line-reader";

const main = (lines: string[]): void => {

  const depths: number[] = lines.map(Number);
  console.log(countIncreasingDepths(depths));
}

const countIncreasingDepths = (depths: number[]): number => {
  let numberOfIncreasing = 0;

  for (let x = 0; x < depths.length; x++) {
    const mySum = calculateSummedDepth(x, depths);
    const prevSum = calculateSummedDepth(x - 1, depths);

    if (mySum !== null && prevSum !== null && mySum > prevSum) {
      numberOfIncreasing++;
    }
  }

  return numberOfIncreasing;
};

/**
 * 
 * @returns null when not a valid window
 */
const calculateSummedDepth = (ndx: number, depths: number[]): number | null => {
  if (ndx < 2) {
    return null;
  }

  return depths[ndx] + depths[ndx - 1] + depths[ndx - 2];
}

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
