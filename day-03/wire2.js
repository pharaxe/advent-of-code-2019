const fs = require('fs');
const readline = require('readline');


const panel = [];
const wires = []; // only 2 wires
let bestSteps = Infinity;

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
  stepCounter = 0;
  steps.forEach(step => {
    currentPosition[0] += step[0];
    currentPosition[1] += step[1];
    stepCounter++;
    setPoint(ndx, currentPosition[0], currentPosition[1], stepCounter);
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

  prevSteps = panel[x][y].wires[wireNumber];
  if (!prevSteps) {
    prevSteps = Infinity;
  }

  panel[x][y].wires[wireNumber] = Math.min(stepCounter, prevSteps);

  if (panel[x][y].wires[0] > 0 && panel[x][y].wires[1] > 0) {
    let steps = panel[x][y].wires[0] + panel[x][y].wires[1];
    bestSteps = Math.min(bestSteps, steps);
  }
}

function calculateIntersections() {
  console.log('Closest intersection:', bestSteps, 'steps');
}

main();
