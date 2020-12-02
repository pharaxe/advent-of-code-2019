"use strict";

const findNumbers = (numbers) => { 
  numbers.sort();

  for (let i = 0; i < numbers.length; i++) {
    for (let j = numbers.length - 1; j > i; j--) {
        if(numbers[i] + numbers[j] === 2020) {
          return [numbers[i], numbers[j]];
        }
    }
  }

  return [-1, -1]; // error didn't find the number
}

const solve = () => {
  const [a, b] = findNumbers(numbers);
  console.log(`${a}, and ${b} and to 2020 and multiply to ${a * b}`);
};

const fs = require('fs');
const readline = require('readline');
const filename = process.argv[2];
const readStream = fs.createReadStream(filename);
const readInterface = readline.createInterface({ input: readStream });

const numbers = [];

readInterface.on('line', (line) => {
  const expense = Number(line);
  numbers.push(expense);
}).on('close', () => {
  solve(numbers);
});

