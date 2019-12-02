"use strict";

const fs = require('fs');
const filename = process.argv[2];

let memory;
let originalMemory;

fs.readFile(filename, 'utf8', (err, contents) => {
  originalMemory  = contents.split(',').map(Number);

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      restore(noun, verb);
      const output = compute(verb);

      if (output === 19690720) {
        console.log('correct noun and verb found:', noun, verb);
        console.log('final answer is', 100 * noun + verb);
        return;
      }
    }
  }
});

function compute() {
  let position = 0;

  while (operate(memory, position)) {
    position += 4;
  }

  console.log('final output', memory[0]);
  return memory[0];
}

// return false if computer program halted, true otherwise
function operate(mem, pos) {
  const opcode = mem[pos];

  switch (opcode) {
    case 99:
      return false;
    case 1:
      add(mem, pos);
      return true;
    case 2:
      multiply(mem, pos);
      return true;
  }
}

// returns all necessary info for doing a calc
function readValues(mem, pos) {
  const value1Position = mem[pos + 1];
  const value2Position = mem[pos + 2];
  const outputPosition = mem[pos + 3];
  const value1 = mem[value1Position];
  const value2 = mem[value2Position];

  return [value1, value2, outputPosition];
}

function add(mem, pos) {
  const [summand1, summand2, sumPosition] = readValues(mem, pos);

  mem[sumPosition] = summand1 + summand2;
}

function multiply(mem, pos) {
  const [factor1, factor2, productPosition] = readValues(mem, pos);

  mem[productPosition] = factor1 * factor2;
}

function restore(noun, verb) {
  memory = [...originalMemory];
  memory[1] = noun;
  memory[2] = verb;
}
