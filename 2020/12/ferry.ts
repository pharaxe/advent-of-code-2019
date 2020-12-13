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

type DirectionAction = 
  | Action.NORTH 
  | Action.SOUTH 
  | Action.EAST  
  | Action.WEST;

type RotateAction =
  | Action.LEFT
  | Action.RIGHT;

type Instruction = {
  action: Action;
  value: number;
};

type Ferry = {
  direction: DirectionAction;
  x: number;
  y: number;
}

const DirectionMapping: Record<DirectionAction, [number, number]> = {
  [Action.NORTH]: [0, 1],
  [Action.SOUTH]: [0, -1],
  [Action.EAST]: [-1, 0],
  [Action.WEST]: [1, 0],
}

/**
 * mapping for turning 90 degrees s at a time.
 */
const RotationalMapping: Record<DirectionAction, Record<RotateAction, DirectionAction>> = {
  [Action.NORTH]: { [Action.LEFT]: Action.WEST, [Action.RIGHT]: Action.EAST },
  [Action.SOUTH]: { [Action.LEFT]: Action.EAST, [Action.RIGHT]: Action.WEST },
  [Action.EAST]: { [Action.LEFT]: Action.SOUTH, [Action.RIGHT]: Action.NORTH },
  [Action.WEST]: { [Action.LEFT]: Action.NORTH, [Action.RIGHT]: Action.SOUTH },
}

const initialFerry: Ferry = {
  direction: Action.EAST,
  x: 0,
  y: 0,
}

const move = (ferry: Ferry, instr: Instruction): Ferry => {
  const { action, value } = instr;
  const updatedFerry = {...ferry};

  switch (action) {
    case Action.EAST:
    case Action.WEST:
    case Action.NORTH:
    case Action.SOUTH:
      updatedFerry.x += DirectionMapping[action][0] * value;
      updatedFerry.y += DirectionMapping[action][1] * value;
      break;
    case Action.FORWARD:
      updatedFerry.x += DirectionMapping[ferry.direction][0] * value;
      updatedFerry.y += DirectionMapping[ferry.direction][1] * value;
      break;
    case Action.LEFT:
    case Action.RIGHT:
      updatedFerry.direction = rotate(ferry.direction, action, value);
  }

  return updatedFerry;
}

// amount can be 90, 180, or 270
const rotate = (facing: DirectionAction, rotate: RotateAction, amount: number): DirectionAction => {
  while (amount) {
    facing = rotate90Degrees(facing, rotate);
    amount -= 90;
  }

  return facing;
}

const rotate90Degrees = (facing: DirectionAction, rotate: RotateAction): DirectionAction => {
  return RotationalMapping[facing][rotate];
}

const stringToInstruction = (line: string): Instruction => {
  const reg: RegExp = /(.)(\d+)/;
  const [match, letter, value] = line.match(reg);

  return {
    action: letterToAction(letter),
    value: parseInt(value),
  }
};

const letterToAction = (letter: string): Action => {
  return letter as Action;
};

const main = (lines: string[]) => {
  const instructions: Instruction[] = lines.map(stringToInstruction);
  let ferry: Ferry = initialFerry;

  instructions.forEach(instr => {
    ferry = move(ferry, instr);
  })

  const distanceTraveled = Math.abs(ferry.x) + Math.abs(ferry.y);
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
