import * as lineReader from "line-reader";

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
  console.log(`${a}, and ${b} add to 2020 and multiply to ${a * b}`);
};

const numbers = [];
const filename = process.argv[2];
lineReader.eachLine(filename, (line) => { 
    const expense = Number(line);
    numbers.push(expense);
}, () => {
  solve(numbers);
});
