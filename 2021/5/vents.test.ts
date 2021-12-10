import { getNewFloor, turnLineIntoPoints, LineOfVents, parseLine } from "./vents";

const mockVentEntry1: LineOfVents = {
  x1: 1,
  x2: 1,
  y1: 1,
  y2: 3,
};

const mockVentEntry1AsString: string = "1,1 -> 1,3";
const mockVentEntry2AsString: string = "9,7 -> 7,7";

const mockVentEntry2: LineOfVents = {
  x1: 9,
  x2: 7,
  y1: 7,
  y2: 7,
};

describe("getNewFloor", () => {
  it("can create an empty floor", () => {
    const floor = getNewFloor(2);

    expect(floor).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });
});
describe("parseLine", () => {
  it("parse mock vent entry 1 works", () => {
    const line: LineOfVents = parseLine(mockVentEntry1AsString);
    expect(line).toEqual(mockVentEntry1);
  });
  it("parse mock vent entry 2 works", () => {
    const line: LineOfVents = parseLine(mockVentEntry2AsString);
    expect(line).toEqual(mockVentEntry2);
  });
});
describe("turnLineIntoPoints", () => {
  it("vertical works", () => {
    const points = turnLineIntoPoints(mockVentEntry1);
    expect(points).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ]);
  });
  it("horizontal and backwards works", () => {
    const points = turnLineIntoPoints(mockVentEntry2);
    expect(points).toEqual([
      { x: 9, y: 7 },
      { x: 8, y: 7 },
      { x: 7, y: 7 },
    ]);
  });
});
