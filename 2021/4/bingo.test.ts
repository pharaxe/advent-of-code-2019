import {
  sumOfAllUnmarkedNumbers,
  BingoBoard,
  getColumn,
  checkForWin,
  parseBoard,
} from "./bingo";

const mockBoard: BingoBoard = [
  [1, 2, 3, 4, 5],
  [11, 21, 31, 41, 51],
  [12, 22, 32, 42, 52],
  [13, 23, 33, 43, 53],
  [14, 24, 34, 44, 54],
];

const mockBoardLines: string[] = [
  " 1  2  3  4  5",
  "11 21 31 41 51",
  "12 22 32 42 52",
  "13 23 33 43 53",
  "14 24 34 44 54",
];

describe("getColumn", () => {
  it("can get leftmost column", () => {
    const leftMostColumn = getColumn(mockBoard, 0);
    expect(leftMostColumn).toEqual([1, 11, 12, 13, 14]);
  });
});

describe("checkForWin", () => {
  it("top row can win", () => {
    const isWinningBoard = checkForWin(mockBoard, [1, 2, 3, 4, 5]);
    expect(isWinningBoard).toBe(true);
  });
  it("bottom row can win", () => {
    const isWinningBoard = checkForWin(mockBoard, [14, 24, 34, 44, 54]);
    expect(isWinningBoard).toBe(true);
  });
  it("left column can win", () => {
    const isWinningBoard = checkForWin(mockBoard, [1, 11, 12, 13, 14]);
    expect(isWinningBoard).toBe(true);
  });
  it("right column can win", () => {
    const isWinningBoard = checkForWin(mockBoard, [5, 51, 52, 53, 54]);
    expect(isWinningBoard).toBe(true);
  });
  it("board doesn't always win", () => {
    const isWinningBoard = checkForWin(mockBoard, [-1, 51, 52, 53, 54]);
    expect(isWinningBoard).toBe(false);
  });

  describe("parseBoard", () => {
    it("can parse a board", () => {
      const parsedBoard = parseBoard(mockBoardLines);
      expect(parsedBoard).toEqual(mockBoard);
    });
  });

  describe("sumOfAllUnmarkedNumbers", () => {
    it("can return a sum", () => {
      const sum = sumOfAllUnmarkedNumbers(
        mockBoard,
        [
          11, 21, 31, 41, 51, 12, 22, 32, 42, 52, 13, 23, 33, 43, 53, 14, 24,
          34, 44, 54,
        ]
      );

      expect(sum).toEqual(1 + 2 + 3 + 4 + 5);
    });
  });
});
