import * as lineReader from "line-reader";
import { isEqual } from "lodash-es";

enum SeatType {
  EMPTY = "L",
  FLOOR = ".",
  OCCUPIED = "#",
  OUT_OF_BOUNDS = "!",
}

type Seat = {
  type: SeatType;
  x: number;
  y: number;
};

type WaitingRoom = Seat[][];

const main = (lines: string[]) => {
  let room: WaitingRoom = lines.reduce((accum, line) => {
    return [
      ...accum,
      line.split("").map((char) => ({
        type: char as SeatType,
      })),
    ];
  }, []);

  for (let y = 0; y < room.length; y++) {
    for (let x = 0; x < room[y].length; x++) {
      room[y][x].x = x;
      room[y][x].y = y;
    }
  }

  let previousRoom: WaitingRoom;

  while (!roomsComparator(room, previousRoom)) {
    previousRoom = room;
    room = stepForward(room);
  }

  console.log(
    `The total number of occupied seats is now ${totalOccupiedSeats(room)}`
  );
};

const totalOccupiedSeats = (room: WaitingRoom): number => {
  let occupied = 0;

  for (let y = 0; y < room.length; y++) {
    for (let x = 0; x < room[y].length; x++) {
      occupied += room[y][x].type === SeatType.OCCUPIED ? 1 : 0;
    }
  }

  return occupied;
};

const stepForward = (room: WaitingRoom): WaitingRoom => {
  return room.map((row, y) => row.map((seat, x) => getNextSeat(seat, room)));
};

const roomsComparator = (roomA: WaitingRoom, roomB: WaitingRoom): boolean => {
  //return isEqual(roomA, roomB);
  return (
    roomA &&
    roomB &&
    roomA.every((row) =>
      row.every(
        (seat) =>
          getSeat(seat.x, seat.y, roomA).type ===
          getSeat(seat.x, seat.y, roomB).type
      )
    )
  );
};

const getNextSeat = (seat: Seat, room: WaitingRoom): Seat => {
  switch (seat.type) {
    case SeatType.EMPTY:
      if (
        getAllAdjacentSeats(seat, room).every(
          (adj) => adj.type !== SeatType.OCCUPIED
        )
      ) {
        return {
          ...seat,
          type: SeatType.OCCUPIED,
        };
      }
      break;
    case SeatType.OCCUPIED:
      if (
        getAllAdjacentSeats(seat, room).filter(
          (adj) => adj.type === SeatType.OCCUPIED
        ).length >= 5
      ) {
        return {
          ...seat,
          type: SeatType.EMPTY,
        };
      }
      break;
  }

  return seat;
};

const getAllAdjacentSeats = (seat: Seat, room: WaitingRoom): Seat[] => {
  const adjacentDirections: [number, number][] = [
    // x, then y
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ];

  return adjacentDirections.map((dir) =>
    findNextSeatFrom(seat, dir[0], dir[1], room)
  );
};

const findNextSeatFrom = (
  seat: Seat,
  xDir: number,
  yDir: number,
  room: WaitingRoom
): Seat => {
  const mockSeat = {
    x: 0,
    y: 0,
    type: SeatType.FLOOR,
  };

  let nextSeat: Seat = mockSeat;
  let steps = 0;

  while (nextSeat?.type === SeatType.FLOOR) {
    steps++;
    nextSeat = getSeat(seat.x + xDir * steps, seat.y + yDir * steps, room);
  }

  if (nextSeat === undefined) {
    // we went off the map!
    nextSeat = mockSeat;
  }

  return nextSeat;
};

/**
 * Returns undefined if we go off the map
 */
const getSeat = (x: number, y: number, room: WaitingRoom): Seat | undefined => {
  const inBounds = x >= 0 && x < room[0].length && y >= 0 && y < room.length;

  return inBounds ? room[y][x] : undefined;
};

var filename = process.argv[2];
var lines = [];
lineReader.eachLine(filename, function (line, last) {
  lines.push(line);
  if (last) {
    main(lines);
  }
});
