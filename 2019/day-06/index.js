const fs = require('fs');
const readline = require('readline');

main();

function main() {
  readInput();
}

function readInput() {
  const filename = process.argv[2];
  const readStream = fs.createReadStream(filename);
  const readInterface = readline.createInterface({ input: readStream });
  const orbitTable = new Map();

  readInterface.on('line', (line) => {
    [orbitee,orbiter] = line.split(')');

    append(orbitTable, orbiter, orbitee);

  }).on('close', () => {
    solve(orbitTable);
  });
}

function append(orbitTable, a, b) {
  if (!orbitTable.has(b)) {
    orbitTable.set(b, { name: b, directOrbits: 0 });
  } 

  const orbitee = orbitTable.get(b);

  if (!orbitTable.has(a)) {
    orbitTable.set(a, {  
      name: a,
    });
  }

  const orbiter = orbitTable.get(a);

  orbiter.orbits = orbitee;
  orbiter.directOrbits = 1;
}

function getIndirectOrbits(body) {
  if (body.indirectOrbits === undefined) {
    if (body.orbits === undefined || body.orbits.directOrbits === 0) {
      body.indirectOrbits = 0;
    } else {
      body.indirectOrbits = 1 + getIndirectOrbits(body.orbits);
    }
  } 

  return body.indirectOrbits;
}

function getOrbits(body) {
  return body.directOrbits + getIndirectOrbits(body);
}

function solve(orbitTable) {
  const totalOrbits = Array.from(orbitTable.values()).reduce((sum, body) => sum + getOrbits(body), 0);

  console.log('Total orbits', totalOrbits);
}
