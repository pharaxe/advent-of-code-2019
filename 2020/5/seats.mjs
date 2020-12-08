"use strict";

import * as lineReader from "line-reader";

const main = (lines) => {
  const seats = lines
    .map((line) => seatStringToBinary(line))
    .map((instructions) => parseInt(instructions, 2))
    .map(Number);

  const mySeat = findMySeat(seats);

  console.log(`My seat is number ${mySeat}`);
};

const findMySeat = (seats) => {
  seats.sort((a,b) => a -b); // sort as numbers.
  const firstSeat = seats[0];

  for (let i = 0; i < seats.length; i++) {
    let seat = seats[i];
    if (seat !== firstSeat + i) {
      return seat - 1;
    }
  }
};

/**
 *
 * @param takes in string of 'FBFBBFFRLR'
 * @return something like 0101100101
 */
const seatStringToBinary = (seat) => {
  const directions = seat.split("").map((letter) => {
    switch (letter) {
      case "F":
      case "L":
        return 0;
      case "B":
      case "R":
        return 1;
    }
  });

  return directions.join("");
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
