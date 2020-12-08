import * as lineReader from "line-reader";

type Bag = {
  name: string;
  bagsInside: InnerBagInfo[];
  canContainMyBag: boolean | undefined;
  totalBagsInside: number | undefined;
};

type InnerBagInfo = {
  amount: number;
  bag: Bag;
};

const main = (lines: string[]) => {
  const bags = createBags(lines);

  augmentBagDescription(lines, bags);

  const answer: number = calculateAmountOfBags(bags.get("shiny gold"));

  console.log(`The total amount of bags I'm brining is ${answer}`);
};

const calculateAmountOfBags = (bag: Bag): number => {
  if (bag.totalBagsInside === undefined) {
    bag.totalBagsInside = bag.bagsInside
      .map((innerBagInfo: InnerBagInfo) => {
        return (
          (1 + calculateAmountOfBags(innerBagInfo.bag)) * innerBagInfo.amount
        );
      })
      .reduce((accum, cur) => accum + cur, 0);
  }
  return bag.totalBagsInside;
};

const augmentBagDescription = (
  lines: string[],
  bags: Map<string, Bag>
): void => {
  lines.forEach((line) => {
    const [topBagName, restOfBags] = line.split(" bags contain ");
    if (restOfBags.trim() === "no other bags.") {
      return; // bail.
    }
    const innerBagStrings: string[] = restOfBags.split(", ");
    const innerBagInfo: InnerBagInfo[] = innerBagStrings.map((fullString) => {
      const regex: RegExp = /(\d+) (\S+ \S+) bags?/;
      const matches = fullString.match(regex);
      const amount = parseInt(matches[1]);
      const name = matches[2];
      return { amount, bag: bags.get(name) };
    });

    const topBag: Bag = bags.get(topBagName);
    topBag.bagsInside = innerBagInfo;
  });
};

const createBags = (lines: string[]): Map<string, Bag> => {
  const allBags = new Map<string, Bag>();

  const bagNames = lines.map((line) => line.split(" ").splice(0, 2).join(" "));
  bagNames.forEach((bagName: string) => {
    allBags.set(bagName, {
      name: bagName,
      bagsInside: [],
      canContainMyBag: undefined,
      totalBagsInside: undefined,
    });
  });

  return allBags;
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
