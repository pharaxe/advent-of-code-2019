"use strict";
const fs = require('fs');
const IntCode = require('./computer.js');
const filename = process.argv[2];
var Combinatorics = require('js-combinatorics');

let program = [];

fs.readFile(filename, 'utf8', (err, contents) => {
  program = contents.split(',').map(Number);
  run();
});

function run() {
  const phaseSignals = [1, 2, 3, 4, 0];

  const possiblePhaseSignals = Combinatorics.permutation(phaseSignals).toArray();

  const maxThrust = possiblePhaseSignals.reduce((thrust, signals) => {
    let newThrusterSignal = signals.reduce((thrust, phase) => {
      let newThrust = compute(program, phase, thrust); // run all 5 programs with each phase signal in sequence.

      return newThrust;
    }, 0);

    return Math.max(thrust, newThrusterSignal);
  }, 0)

  console.log(maxThrust);
}

function compute(program, phaseSetting, inputSignal) {
  let intcode = new IntCode(program);
  intcode.io.write(phaseSetting);
  intcode.io.write(inputSignal); 
  intcode.compute();
  let value = intcode.io.read(1);

  return value;
}
