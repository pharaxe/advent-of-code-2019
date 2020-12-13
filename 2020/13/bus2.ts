import { schedulingPolicy } from "cluster";
import * as lineReader from "line-reader";

type Bus = {
  id: number;
  offset: number;
};

const main = (lines: string[]): void => {
  const sched: string[] = lines[1].split(",");

  let allBuses: Bus[] = [];
  let offset = 0;
  for (const val of sched) {
    if (val !== "x") {
      allBuses.push({
        id: parseInt(val),
        offset,
      });
    }
    offset++;
  }

  let incrementAmount = allBuses[0].id;
  let busWeAreSolvingIndex = 1;
  let numberToCheck = incrementAmount;
  const solvedBuses = [allBuses[0]];

  while (solvedBuses.length < allBuses.length) {
    const nextBus = allBuses[busWeAreSolvingIndex];
    while (
      !isAnswer(numberToCheck, [...solvedBuses, nextBus])
    ) {
      numberToCheck += incrementAmount;
    }

    incrementAmount *= nextBus.id;
    solvedBuses.push(nextBus);
    busWeAreSolvingIndex++;
  }

  console.log(numberToCheck);
};

const isAnswer = (val: number, buses: Bus[]): boolean => {
  return buses.every((bus) => {
    const fits = (val + bus.offset) % bus.id === 0;
    return fits;
  });
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
