import * as lineReader from "line-reader";

const solve = (lines) => {
  let correctPasswords = 0;
  const regex = /(\d+)-(\d+) (.): (.+)/;

  lines.forEach((line) => {
    const [full, min, max, letter, password] = line.match(regex);

    let actualNumberOfLetters = 0;
    for (let i = 0; i < password.length; i++) {
      if (password[i] === letter) {
        actualNumberOfLetters++;
      }
    }
    if (actualNumberOfLetters >= min && actualNumberOfLetters <= max) {
      correctPasswords++;
    }
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
