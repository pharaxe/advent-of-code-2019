import * as lineReader from "line-reader";

enum Action {
  NORTH = "N",
  SOUTH = "S",
  EAST = "E",
  WEST = "W",
  LEFT = "L",
  RIGHT = "R",
  FORWARD = "F",
}

type DirectionAction = Action.NORTH | Action.SOUTH | Action.EAST | Action.WEST;

type RotateAction = Action.LEFT | Action.RIGHT;

type Instruction = {
  action: Action;
  value: number;
};

type Vector = {
  x: number;
  y: number;
};

type Ferry = {
  waypoint: Vector;
  pos: Vector;
};

const DirectionMapping: Record<DirectionAction, Vector> = {
  [Action.NORTH]: { x: 0, y: 1 },
  [Action.SOUTH]: { x: 0, y: -1 },
  [Action.EAST]: { x: 1, y: 0 },
  [Action.WEST]: { x: -1, y: 0 },
};

const addVectors = (a: Vector, b: Vector): Vector => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

const scaleVector = (vec: Vector, scale: number): Vector => {
  return {
    x: vec.x * scale,
    y: vec.y * scale,
  };
};

/**
 * mapping for turning 90 degrees s at a time.
 */
const RotationalMapping: Record<
  DirectionAction,
  Record<RotateAction, DirectionAction>
> = {
  [Action.NORTH]: { [Action.LEFT]: Action.WEST, [Action.RIGHT]: Action.EAST },
  [Action.SOUTH]: { [Action.LEFT]: Action.EAST, [Action.RIGHT]: Action.WEST },
  [Action.EAST]: { [Action.LEFT]: Action.NORTH, [Action.RIGHT]: Action.SOUTH },
  [Action.WEST]: { [Action.LEFT]: Action.SOUTH, [Action.RIGHT]: Action.NORTH },
};

const initialFerry: Ferry = {
  pos: { x: 0, y: 0 },
  waypoint: { x: 10, y: 1 },
};

const move = (ferry: Ferry, instr: Instruction): Ferry => {
  const { action, value } = instr;
  const updatedFerry = { ...ferry };

  switch (action) {
    case Action.EAST:
    case Action.WEST:
    case Action.NORTH:
    case Action.SOUTH:
      updatedFerry.waypoint = addVectors(
        ferry.waypoint,
        scaleVector(DirectionMapping[action], value),
      );
      break;
    case Action.FORWARD:
      updatedFerry.pos = addVectors(
        ferry.pos,
        scaleVector(ferry.waypoint, value)
      )
      break;
    case Action.LEFT:
    case Action.RIGHT:
      updatedFerry.waypoint = rotate(updatedFerry.waypoint, action, value);
  }

  return updatedFerry;
};

// amount can be 90, 180, or 270
const rotate = (
  waypoint: Vector,
  rotate: RotateAction,
  amount: number
): Vector => {
  while (amount !== 0) {
    waypoint = rotate90Degrees(waypoint, rotate);
    amount -= 90;
  }

  return waypoint;
};

const rotate90Degrees = (
  vector: Vector,
  rotate: RotateAction
): Vector => {
  return {
    x: vector.y * (rotate === Action.LEFT ? -1 : 1),
    y: vector.x * (rotate === Action.RIGHT ? -1 : 1),
  }
};

const stringToInstruction = (line: string): Instruction => {
  const reg: RegExp = /(.)(\d+)/;
  const [match, letter, value] = line.match(reg);

  return {
    action: letterToAction(letter),
    value: parseInt(value),
  };
};

const letterToAction = (letter: string): Action => {
  return letter as Action;
};

const main = (lines: string[]) => {
  const instructions: Instruction[] = lines.map(stringToInstruction);
  let ferry: Ferry = initialFerry;

  instructions.forEach((instr) => {
    ferry = move(ferry, instr);
  });

  const distanceTraveled = Math.abs(ferry.pos.x) + Math.abs(ferry.pos.y);
  console.log(distanceTraveled);
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
