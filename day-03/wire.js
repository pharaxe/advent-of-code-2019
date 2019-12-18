const fs = require('fs');
const readline = require('readline');


const panel = [];
const wires = []; // only 2 wires
let bestDistance = Infinity;

function main() {
  readInput();
}

function readInput() {
  const filename = process.argv[2];
  const readStream = fs.createReadStream(filename);
  const readInterface = readline.createInterface({ input: readStream });

  readInterface.on('line', (line) => {
    wires.push(line.split(','));
  }).on('close', () => {
    wires.forEach((wire, ndx) => plotPath(wire, ndx));
    calculateIntersections();
  });
}

// @param wire number
function plotPath(wire, ndx) {
  currentPosition = [0, 0];

  steps = wire.flatMap(movementString => getSteps(movementString));
  steps.forEach(step => {
    currentPosition[0] += step[0];
    currentPosition[1] += step[1];
    setPoint(ndx, currentPosition[0], currentPosition[1]);
  });
}

// @return [ [xDelta, yDelta] ]
function getSteps(stringInput) {
  const [matches, direction, magnitude] = stringInput.match(/(.)(\d+)/);
  const delta = getDelta(direction);;

  return Array(Number(magnitude)).fill(delta);
}

function getDelta(direction) {
  switch (direction) {
    case 'R':
      return [1, 0];
    case 'D':
      return [0, 1];
    case 'L':
      return [-1, 0];
    case 'U':
      return [0, -1];
  }
}

function setPoint(wireNumber, numX, numY) {
  // using strings so we can index with negative numbers.
  const x = String(numX);
  const y = String(numY);

  // initialize the panel object as we go
  if (!panel[x]) {
    panel[x] = [ ];
  }

  if (!panel[x][y]) {
    panel[x][y] = {
      wires: [ ],
    }
  }

  panel[x][y].wires[wireNumber] = true;
  if (panel[x][y].wires[0] && panel[x][y].wires[1]) {
    let distance = Math.abs(x) + Math.abs(y);
    bestDistance = Math.min(bestDistance, distance);
  }
}

function calculateIntersections() {
  /*
  panel.forEach((rows, x) => {
    rows.forEach((panelValue, y) => {
      if (panelValue.wires[0] && panelValue.wires[1]) {
        let distance = Math.abs(x) + Math.abs(y);
        bestDistance = Math.min(bestDistance, distance);
      }
    });
  });

  */
  console.log('Closest intersection:', bestDistance);
}

main();
