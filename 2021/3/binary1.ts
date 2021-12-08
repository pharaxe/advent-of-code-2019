import * as lineReader from "line-reader";

const binaryStringLength = 12;

type MostCommonBits = {
  numberOf0s: number;
  numberOf1s: number;
};

const decodeDiagnosticReportReading = (
  accumlative: MostCommonBits[],
  currentReport: string
) => {
  for (let ndx = 0; ndx < binaryStringLength; ndx++) {
    const value = currentReport.charAt(ndx);
    if (value === "0") {
      accumlative[ndx].numberOf0s += 1;
    } else if (value === "1") {
      accumlative[ndx].numberOf1s += 1;
    } else {
      console.error("unrecognizable input");
    }
  }

  return accumlative;
};

const main = (lines: string[]): void => {
  const init: MostCommonBits = { numberOf0s: 0, numberOf1s: 0 };
  const initial: MostCommonBits[] = Array(binaryStringLength)
    .fill(undefined)
    .map(() => ({ ...init }));

  const final: MostCommonBits[] = lines.reduce(
    decodeDiagnosticReportReading,
    initial
  );
  console.log(final);

  const gammaRate = final.reduce((accum: string, current: MostCommonBits) => {
    return accum + (current.numberOf0s > current.numberOf1s ? "0" : "1");
  }, "");

  console.log(gammaRate);
  const epsilonRate = bitwiseNot(gammaRate);
  console.log(epsilonRate);

  const gammaRateInDecimal = parseInt(gammaRate, 2);
  const epsilonRateInDecimal = parseInt(epsilonRate, 2);

  console.log(gammaRateInDecimal * epsilonRateInDecimal);
};

const bitwiseNot = (a: string): string => {
  let flipped = "";

  for (let ndx = 0; ndx < a.length; ndx++) {
    flipped += a.charAt(ndx) === "0" ? "1" : "0";
  }

  return flipped;
}

const filename = process.argv[2];
const lines = [];
lineReader.eachLine(filename, (line, last) => {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
