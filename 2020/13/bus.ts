import * as lineReader from "line-reader";

type Bus = {
  id: number;
  timeWaiting: number;
};

const main = (lines: string[]): void => {
  const earliest: number = parseInt(lines[0]);
  const buses: Bus[] = lines[1]
    .split(",")
    .filter((busId) => busId !== "x")
    .map((busId) => parseInt(busId))
    .map((id) => ({
      id,
      timeWaiting: id - (earliest % id),
    }));

  const leastWaiting: Bus = buses.reduce((least, cur) => {
    return cur.timeWaiting < least.timeWaiting ? cur : least;
  }, buses[0]);

  console.log(leastWaiting.timeWaiting * leastWaiting.id);
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
