"use strict";

const {Duplex} = require('stream');

// INTCODE computer
module.exports = function IntCode(program) {
  this.memory = [...program];
  // console.log('IntCode booted with memory');
  this.ioBlocked = false; // most of the intcode is synchronous  so this flag tells it to wait .
  
  /*
   * io for programings outside the intcode interacting with it.
   * Outside programs write to this stream to give it input, and read from it to receive the output.
   **/
  this.inputQueue = [];
  this.io = new Duplex({ 
    objectMode: true,
    write: (chunk, _, done) => {
      this.inputQueue.push(chunk); // queue up the inputs for a input opcode.
      done();
    },
    read() { }
  });

  // Runs the program!
  this.compute = function() {
    let pc = 0, res;

    while (res = this.operate(this.memory, pc)) {
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
  this.operate = function(mem, pc) {
    const {opcode, parameterModes} = this.parseOperation(mem, pc);
    const {func, paramLength} = this.instructionSet[opcode];

    let params = mem.slice(pc + 1, pc + 1 + paramLength);

    // before evaluating, transform any immediate mode params into position mode parameters.

    for (let n = 0; n < paramLength; n++) {
      if (parameterModes[n] === 1) { // immediate mode
        params[n] = pc + n + 1; // the position is the parameter number plus the starting program counter for this op plus one for the opcode space.
      }
    }

    // Eval!
    let res = func.bind(this)(mem, ...params);

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
  this.parseOperation = function(mem, pc) {
    const operation = mem[pc];
    const opLength = operation.toString().length;

    let paramModes = operation.toString().substring(0, opLength - 2);
    const opCode = Number(operation.toString().substring(opLength- 2, opLength));

    // make into array and reverse paramModes because they are right-to-left in INT and that's confusing
    paramModes = paramModes.split('').reverse().map(Number);

    // omittted parameter modes are 0 (position mode)
    const missingParameterModes = this.instructionSet[opCode].paramLength - paramModes.length;

    paramModes = [...paramModes, ...new Array(missingParameterModes).fill(0)];

    return {
      opcode: opCode,
      parameterModes: paramModes
    };
  }

  this.terminate = function() { 
    // console.log('Program terminated');
    this.io.end();
    return { terminate: true };
  }

  this.add = function(mem, summand1, summand2, sumPosition) {
    mem[sumPosition] = mem[summand1] + mem[summand2];
  }

  this.multiply = function(mem, factor1, factor2, productPosition) {
    mem[productPosition] = mem[factor1] * mem[factor2];
  }

  this.input = function(mem, position) {
    while(this.inputQueue.length === 0) { } // wait for input

    const data = this.inputQueue.shift();
    // console.log('intcode has received data', data);
    mem[position] = Number(data);
  }

  this.output = function(mem, position) {
    const output = mem[position];
    // console.log('intcode is sending data', output);
    this.io.push(output);
  }

  this.jumpIfTrue = function(mem, condition, jmp) {
    if (mem[condition] !== 0) {
      return { jump: mem[jmp] };
    }
  }

  this.jumpIfFalse = function(mem, condition, jmp) {
    if (mem[condition] === 0) {
      return { jump: mem[jmp] };
    }
  }

  this.lessThan = function(mem, a, b, result) {
    if (mem[a] < mem[b]) {
      mem[result] = 1;
    } else {
      mem[result] = 0;
    }
  }

  this.equals = function(mem, a, b, result) {
    if (mem[a] === mem[b]) {
      mem[result] = 1;
    } else {
      mem[result] = 0;
    }
  }

  this.instructionSet = {
    99: { // terminate
      paramLength: 0,
      func: this.terminate
    },
    1: { // add
      paramLength: 3,
      func: this.add
    },
    2: { // mul
      paramLength: 3,
      func: this.multiply
    },
    3: { // input
      paramLength: 1,
      func: this.input
    },
    4: { // output
      paramLength: 1,
      func: this.output
    },
    5: { // jump-if-true
      paramLength: 2,
      func: this.jumpIfTrue
    },
    6: { // jump-if-false
      paramLength: 2,
      func: this.jumpIfFalse
    },
    7: { // less than
      paramLength: 3,
      func: this.lessThan
    },
    8: { // equals 
      paramLength: 3,
      func: this.equals
    }
  };
}
