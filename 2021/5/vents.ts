import * as lineReader from "line-reader";

export const SIZE = 1000;

export type OceanFloor = number[][];

export type LineOfVents = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Vent = {
  x: number;
  y: number;
};

export const getNewFloor = (size: number): OceanFloor => {
  return Array(size)
    .fill(undefined)
    .map((val) => {
      return Array(size).fill(0);
    });
};

export const turnLineIntoPoints = (linOfVents: LineOfVents): Vent[] => {
  const { x1, x2, y1, y2 } = linOfVents;

  const isVertical = x1 === x2;
  const isHorizontal = y1 === y2;
  const vents: Vent[] = [];
  let direction: -1 | 1;
  debugger;

  const isFinished = (currentPosition, finalPosition, dir) => {
    if (dir === 1) {
      return currentPosition > finalPosition;
    } else {
      return currentPosition < finalPosition;
    }
  };

  if (isVertical) {
    direction = y2 > y1 ? 1 : -1;

    for (let y = y1; !isFinished(y, y2, direction); y += direction) {
      vents.push({ y, x: x1 });
    }
  } else if (isHorizontal) {
    direction = x2 > x1 ? 1 : -1;

    for (let x = x1; !isFinished(x, x2, direction); x += direction) {
      vents.push({ y: y1, x });
    }
  }

  return vents;
};

export const applyPointToFloor = (
  point: Vent,
  floor: OceanFloor
): OceanFloor => {
  floor[point.y][point.x]++;
  return floor;
};

export const drawLineOnFloor = (
  vents: LineOfVents,
  floor: OceanFloor
): OceanFloor => {
  const points = turnLineIntoPoints(vents);
  points.forEach((point) => {
    applyPointToFloor(point, floor);
  });

  return floor;
};

export const parseLine = (line: string): LineOfVents => {
  const [start, finish] = line.split(" -> ");

  const [x1, y1] = start.split(",").map((val) => parseInt(val));
  const [x2, y2] = finish.split(",").map((val) => parseInt(val));

  return {
    x1,
    x2,
    y2,
    y1,
  };
};

/**
 * return the number of spots on the map that have 2 or more vents.
 */
export const getDangerousSpots = (floor: OceanFloor): number => {
  let dangerousSpots: number = 0;

  floor.forEach(row => {
    row.forEach(value => {
      if (value >= 2) {
        dangerousSpots++;
      }
    });
  })

  return dangerousSpots;
};

const main = (input: string[]) => {
  const ventInfo: LineOfVents[] = input.map(parseLine);
  const floor: OceanFloor = getNewFloor(SIZE);
  ventInfo.forEach(vents => {
    drawLineOnFloor(vents, floor);
  });
  
  const solution = getDangerousSpots(floor);
  console.log(solution);
};

const filename = process.argv[2];
if (filename) {
  const lines = [];
  lineReader.eachLine(filename, (line, last) => {
    lines.push(line);
    if (last) {
      main(lines);
    }
  });
}
