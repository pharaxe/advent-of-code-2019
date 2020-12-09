import * as lineReader from "line-reader";

type GameConsole = {
  acc: number;
  pc: number;
  memory: Instruction[];
  foundInfiniteLoop: boolean;
  terminatedCorrectly: boolean;
};

type Instruction = {
  opcode: string;
  value: number;
  visited: boolean;
};

const main = (lines: string[]) => {
  const instructions = lines.map(convertLineToInstruction);
  const games = instructions.map((val, i) => {
    const game = initializeGame(instructions);
    flipOneInstruction(game, i);
    return game;
  });

  for (const game of games) {
    while (!game.foundInfiniteLoop || game.terminatedCorrectly) {
      execute(game);
    }
    if (game.terminatedCorrectly) {
      console.log(`The final value of acc was ${game.acc}`);
      return; // we are done!
    }
  }

  console.log("Shouldn't get here! Oh no")
};

const initializeGame = (instructions: Instruction[]): GameConsole => {
  return {
    acc: 0,
    pc: 0,
    memory: [...instructions],
    foundInfiniteLoop: false,
    terminatedCorrectly: false,
  };
};

const flipOneInstruction = (game: GameConsole, i: number) => {
  const { opcode } = game.memory[i];

  let newOp = "acc";
  if (opcode === "nop") {
    newOp = "jmp";
  } else if (opcode === "jmp") {
    newOp = "nop";
  }
  game.memory[i].opcode = newOp;
};

const execute = (game: GameConsole): void => {
  const { pc, memory } = game;

  const { opcode, value } = memory[pc];

  if (memory[pc].visited) {
    game.foundInfiniteLoop = true;
    return; // bail bail bail!
  }
  memory[pc].visited = true;

  switch (opcode) {
    case "acc":
      game.acc += value;
      game.pc++;
      break;
    case "jmp":
      game.pc += value;
      break;

    case "nop":
      game.pc++;
      break;
  }

  if (game.pc === memory.length) {
    game.terminatedCorrectly = true;
  }
};

const convertLineToInstruction = (line: string): Instruction => {
  const regex: RegExp = /(\S+) (\S+)/;
  let [full, opcode, value] = line.match(regex);
  if (value.startsWith("+")) {
    value.slice(0, 1);
  }
  const instr: Instruction = {
    opcode,
    value: parseInt(value),
    visited: false,
  };
  return instr;
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
