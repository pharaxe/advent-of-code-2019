"use strict";

import * as lineReader from "line-reader";

const main = (lines) => {
  const passportStrings = lines.reduce(
    (accum, cur) => {
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
    },
    [""]
  );

  const passports = passportStrings.map((passportString) =>
    passportString.trim().split(" ")
  );

  const passportsWithoutCid = passports.map((passport) =>
    passport.filter((passportField) => !passportField.startsWith("cid"))
  );

  const passportObjects = passportsWithoutCid.map((passport) => {
    const keyValueArrays = passport.map((fieldString) => {
      return fieldString.split(":");
    });
    const chonkyPassportObject = {};
    keyValueArrays.forEach((pair) => {
      const [key, value] = pair;
      chonkyPassportObject[key] = value;
    });
    return chonkyPassportObject;
  });

  const passportsWithRequiredFields = passportObjects.filter((passport) => {
    return Object.keys(passport).length === 7;
  });

  const passportFieldValidty = passportsWithRequiredFields.map((passport) => {
    return Object.keys(passport).map((field) => {
      return validationSchema[field](passport[field]); // magic happens here
    });
  });

  const passportTotalValidty = passportFieldValidty.map((validityArray) => {
    return validityArray.every(Boolean);
  });

  const onlyValidPassports = passportTotalValidty.filter(Boolean);

  console.log(`The number of valid passports is ${onlyValidPassports.length}`);
};

const validationSchema = {
  byr: (value) =>
    value.length === 4 && Number(value) >= 1920 && Number(value) <= 2002,
  iyr: (value) =>
    value.length === 4 && Number(value) >= 2010 && Number(value) <= 2020,
  eyr: (value) =>
    value.length === 4 && Number(value) >= 2020 && Number(value) <= 2030,
  hgt: (value) =>
    (value.endsWith("in") && parseInt(value) >= 59 && parseInt(value) <= 76) ||
    (value.endsWith("cm") && parseInt(value) >= 150 && parseInt(value) <= 193),
  hcl: (value) => /#[0-9a-f]{6}/.test(value),
  ecl: (value) =>
    ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value),
  pid: (value) => value.length === 9 && !isNaN(parseInt(value)),
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
