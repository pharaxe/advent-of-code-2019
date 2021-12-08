import * as lineReader from "line-reader";

const main = (lines: string[]): void => {

  const depths: number[] = lines.map(Number);
  console.log(countIncreasingDepths(depths));
}

const countIncreasingDepths = (depths: number[]): number => {
  let numberOfIncreasing = 0;

  for (let x = 0; x < depths.length; x++) {
    if (x > 0 && depths[x] > depths[x-1]) {
      numberOfIncreasing++;
    }
  }

  return numberOfIncreasing;
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
