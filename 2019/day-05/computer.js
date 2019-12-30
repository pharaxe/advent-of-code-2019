"use strict";

const fs = require('fs');
const filename = process.argv[2];
const readlineSync = require('readline-sync');

let memory;

const instructionSet = {
  99: { // terminate
    paramLength: 0,
    func: terminate
  },
  1: { // add
    paramLength: 3,
    func: add
  },
  2: { // mul
    paramLength: 3,
    func: multiply
  },
  3: { // input
    paramLength: 1,
    func: input
  },
  4: { // output
    paramLength: 1,
    func: output
  },
  5: { // jump-if-true
    paramLength: 2,
    func: jumpIfTrue
  },
  6: { // jump-if-false
    paramLength: 2,
    func: jumpIfFalse
  },
  7: { // less than
    paramLength: 3,
    func: lessThan
  },
  8: { // equals 
    paramLength: 3,
    func: equals
  }
};

fs.readFile(filename, 'utf8', (err, contents) => {
  memory = contents.split(',').map(Number);
  compute();
});

function compute() {
  let pc = 0, res;

  while (res = operate(memory, pc)) {
    if (res.terminate) {
      break;
    } 

    if (res.jump !== undefined) {
      pc = res.jump;
    } else {
      pc += res['paramLength'] + 1; // extra one for the opcode itself
    }
  }

}

/* @returns
 {
   terminate: true if computer program halted
   params: number of parameters so we know how far to jump the PC
 }
*/

function operate(mem, pc) {
  const {opcode, parameterModes} = parseOperation(mem, pc);
  const {func, paramLength} = instructionSet[opcode];

  let params = mem.slice(pc + 1, pc + 1 + paramLength);

  // before evaluating, transform any immediate mode params into position mode parameters.

  for (let n = 0; n < paramLength; n++) {
    if (parameterModes[n] === 1) { // immediate mode
      params[n] = pc + n + 1; // the position is the parameter number plus the starting program counter for this op plus one for the opcode space.
    }
  }

  // Eval!
  let res = func(mem, ...params);

  return {
    ...res, 
    paramLength
  }
}

/**
 * @returns {
 *   opcode: string
 *   parameterModes: string[]
 * }
 */
function parseOperation(mem, pc) {
  const operation = mem[pc];
  const opLength = operation.toString().length;

  let paramModes = operation.toString().substring(0, opLength - 2);
  const opCode = Number(operation.toString().substring(opLength- 2, opLength));

  // make into array and reverse paramModes because they are right-to-left in INT and that's confusing
  paramModes = paramModes.split('').reverse().map(Number);

  // omittted parameter modes are 0 (position mode)
  const missingParameterModes = instructionSet[opCode].paramLength - paramModes.length;

  paramModes = [...paramModes, ...new Array(missingParameterModes).fill(0)];

  return {
    opcode: opCode,
    parameterModes: paramModes
  };
}

function terminate() { 
  console.log('Program terminated');
  return { terminate: true };
}

function add(mem, summand1, summand2, sumPosition) {
  mem[sumPosition] = mem[summand1] + mem[summand2];
}

function multiply(mem, factor1, factor2, productPosition) {
  mem[productPosition] = mem[factor1] * mem[factor2];
}

function input(mem, position) {
  let answer = readlineSync.question('INT requires intput: ');

  mem[position] = Number(answer);
}

function output(mem, position) {
  console.log(mem[position]);
}

function jumpIfTrue(mem, condition, jmp) {
  if (mem[condition] !== 0) {
    return { jump: mem[jmp] };
  }
}

function jumpIfFalse(mem, condition, jmp) {
  if (mem[condition] === 0) {
    return { jump: mem[jmp] };
  }
}

function lessThan(mem, a, b, result) {
  if (mem[a] < mem[b]) {
    mem[result] = 1;
  } else {
    mem[result] = 0;
  }
}

function equals(mem, a, b, result) {
  if (mem[a] === mem[b]) {
    mem[result] = 1;
  } else {
    mem[result] = 0;
  }
}
