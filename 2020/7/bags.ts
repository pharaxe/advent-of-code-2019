import * as lineReader from "line-reader";

type Bag = {
  name: string;
  bagsInside: Bag[];
  canContainMyBag: boolean | undefined;
};

const main = (lines: string[]) => {
  const bags = createBags(lines);

  augmentBagDescription(lines, bags);

  // console.log(bags.get("plaid lime").bagsInside);
  const answer: number = Array.from(bags)
    .map(([name, bag]) => canContainGoldenBag(bag))
    .filter(Boolean).length;

  console.log(`The amount of bags that could contain my bag is ${answer}`);
};

const canContainGoldenBag = (cur: Bag): boolean => {
  // console.log(cur, cur.bagsInside);
  if (cur.bagsInside.some((bag) => bag.name === "shiny golden")) {
    cur.canContainMyBag = true;
    return true;
  }

  cur.bagsInside.forEach((innerBag) => {
    if (innerBag.canContainMyBag === undefined) {
      canContainGoldenBag(innerBag);
    }
  });

  if (cur.bagsInside.every((bag) => bag.canContainMyBag === false)) {
    cur.canContainMyBag = false;
  }

  if (cur.bagsInside.some((bag) => bag.canContainMyBag === true)) {
    cur.canContainMyBag = true;
  }

  return cur.canContainMyBag;
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
    const innerBagNames: string[] = innerBagStrings.map((fullString) => {
      const regex: RegExp = /\d+ (\S+ \S+) bags?/;
      const matches = fullString.match(regex);
      const name = matches[1];
      if (topBagName == "posh blue") {
        console.log(fullString, name);
      }
      return name;
    });


    const topBag: Bag = bags.get(topBagName);
    const insideBags: Bag[] = innerBagNames.map((name) => bags.get(name));
    topBag.bagsInside = insideBags;
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
