import * as lineReader from "line-reader";

const hasDuplicates = (array) => {
  return new Set(array).size !== array.length;
};

const findNumbers = (numbers) => {
  numbers.sort();

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      for (let k = 0; k < numbers.length; k++) {
        if (hasDuplicates([i, j, k])) {
          continue;
        }
        if (numbers[i] + numbers[j] + numbers[k] === 2020) {
          return [numbers[i], numbers[j], numbers[k]];
        }
      }
    }
  }

  return [-1, -1]; // error didn't find the number
};

const solve = () => {
  const [a, b, c] = findNumbers(numbers);
  console.log(`${a}, ${b}, and ${c} add to 2020 and multiply to ${a * b * c}`);
};

const numbers = [];
const filename = process.argv[2];
lineReader.eachLine(filename, (line) => { 
    const expense = Number(line);
    numbers.push(expense);
}, () => {
  solve(numbers);
});

