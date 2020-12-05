"use strict";

import * as lineReader from "line-reader";

const main = (lines) => {
  const passportStrings = lines.reduce((accum, cur) => {
    // top is the current passport we are parsing.
    const top = accum.length - 1;

    if (cur.trim() === "") {
      // done parsing the top passport,
      // put an empty passport string on the stack.
      return [...accum, ""];
    }
    {
      // we found a line of passport fields
      // to add to the top passport string.
      accum[top] += cur + " ";
      return accum;
    }
  }, [""]);

  const passports = passportStrings.map((passportString) =>
    passportString.trim().split(" ")
  );

  const passportsWithoutCid = passports.map((passport) =>
    passport.filter((passportField) => !passportField.startsWith("cid"))
  );

  let validPassports  = 0;
  passportsWithoutCid.forEach(passport => {
    if (passport.length === 7) {
      validPassports++;
    }
  });
  console.log(validPassports);
};

const filename = process.argv[2];
const lines = [];
lineReader.eachLine(
  filename,
  (line) => {
    lines.push(line);
  },
  () => {
    main(lines);
  }
);
