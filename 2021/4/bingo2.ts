import * as lineReader from "line-reader";
export type BingoBoard = number[][];


export const getColumn = (board: BingoBoard, x: number): number[] => {
  return [
    board[0][x],
    board[1][x],
    board[2][x],
    board[3][x],
    board[4][x],
  ];
};

export const checkForWin = (
  board: BingoBoard,
  drawnNumbers: number[]
): boolean => {
  for (let y = 0; y < board.length; y++) {
    // check the row
    const row = board[y];
    const isRowWin = row.every(val => drawnNumbers.includes(val));
    if (isRowWin) {
      return true;
    }
  }

  for (let x = 0; x < board[0].length; x++) {
    // check the column
    const column = getColumn(board, x);
    const isColumnWin = column.every(val => drawnNumbers.includes(val));
    if (isColumnWin) {
      return true;
    }
  }

  return false;
};

const main = (lines: string[]) => {
  const allNumbers: number[] = lines.shift().split(",").map(val => parseInt(val));
  const allBoards: BingoBoard[] = [];

  while (lines.length > 0) {
    lines.shift(); // take out the empty line.
    const board: string[] = lines.splice(0, 5);
    allBoards.push(parseBoard(board));
  }

  const boardsThatHaveWon: number[] = [];

  for (let numNdx = 4; numNdx < allNumbers.length; numNdx++) {
    const drawnNumbers = allNumbers.slice(0, numNdx);

    for (let boardNdx = 0; boardNdx < allBoards.length; boardNdx++) {
      if (!boardsThatHaveWon.includes(boardNdx)) {
        const isWinningBoard = checkForWin(allBoards[boardNdx], drawnNumbers);
        if (isWinningBoard) {
          if (boardsThatHaveWon.length === allBoards.length - 1) {
            const sum = sumOfAllUnmarkedNumbers(allBoards[boardNdx], drawnNumbers);
            const winningNumber: number = drawnNumbers[drawnNumbers.length - 1];

            console.log(allBoards[boardNdx]);
            console.log(sum, winningNumber);
            console.log(sum * winningNumber);
            return;
          } else {
            boardsThatHaveWon.push(boardNdx);
          }
        }
      }
    }
  }
}

export const sumOfAllUnmarkedNumbers = (board: BingoBoard, drawnNumbers: number[]): number => {
  let sum = 0;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const value = board[y][x];
      if (!drawnNumbers.includes(value)) {
        sum += value;
      }
    }
  }

  return sum;
}

export const parseBoard = (lines: string[]): BingoBoard => {
  const newBoard: BingoBoard = lines.map(lines => lines.trim().split(/\s+/).map(val => parseInt(val)));

  return newBoard;
};

const filename = process.argv[2];
const lines = [];
if (filename) {
  lineReader.eachLine(filename, (line, last) => {
    lines.push(line);
    if (last) {
      main(lines);
    }
  });
}
