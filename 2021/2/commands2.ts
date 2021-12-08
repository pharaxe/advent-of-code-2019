import * as lineReader from "line-reader";

type Direction = "forward" | "up" | "down";

type Command = {
  direction: Direction;
  amount: number;
};

type Position = {
  depth: number;
  horizontal: number;
  aim: number;
};

const lineToCommand = (line: string): Command => {
  const [direction, amount] = line.split(" ");

  return {
    direction: direction as Direction,
    amount: Number.parseInt(amount),
  };
};

const applyCommand = (pos: Position, command: Command): Position => {
  const newPosition = { ...pos };

  switch (command.direction) {
    case "forward":
      newPosition.horizontal += command.amount;
      newPosition.depth += newPosition.aim * command.amount;
      break;
    case "down":
      newPosition.aim += command.amount;
      break;
    case "up":
      newPosition.aim -= command.amount;
      break;
  }

  return newPosition;
};

const main = (lines: string[]): void => {
  const commands = lines.map(lineToCommand);
  const startPosition: Position = {
    depth: 0,
    horizontal: 0,
    aim: 0,
  };

  const finalPosition = commands.reduce(applyCommand, startPosition);

  console.log(finalPosition.depth * finalPosition.horizontal);
};

const filename = process.argv[2];
const lines = [];
lineReader.eachLine(filename, (line, last) => {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
