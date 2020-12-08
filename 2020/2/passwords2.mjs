import * as lineReader from "line-reader";

const solve = (lines) => {
  let correctPasswords = 0;
  const regex = /(\d+)-(\d+) (.): (.+)/;

  lines.forEach((line) => {
    const [full, pos1, pos2, letter, password] = line.match(regex);

    let actualNumberOfLetters = 0;
    actualNumberOfLetters += password[pos1 - 1] === letter ? 1 : 0;
    actualNumberOfLetters += password[pos2 - 1] === letter ? 1 : 0;

    correctPasswords += actualNumberOfLetters === 1 ? 1 : 0;
  });

  console.log(correctPasswords);
};

const lines = [];
const filename = process.argv[2];
lineReader.eachLine(
  filename,
  (line) => {
    lines.push(line);
  },
  () => {
    solve(lines);
  }
);
