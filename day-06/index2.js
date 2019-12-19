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
    orbitTable.set(b, { name: b, nodes: [] });
  } 

  if (!orbitTable.has(a)) {
    orbitTable.set(a, {  name: a, nodes: [] });
  }

  const orbiter = orbitTable.get(a);
  const orbitee = orbitTable.get(b);

  orbiter.nodes.push(orbitee);
  orbitee.nodes.push(orbiter);
}

function solve(orbitTable) {
  // just gonna do bfs;
  const you = orbitTable.get('YOU');
  const santa = orbitTable.get('SAN');
  let solved = false;
  let steps = 0;

  let newNodes = new Set([you]);
  let searchedNodes = new Set();
  
  while (!solved) {
    let availableNodes = Array.from(newNodes).flatMap(body => body.nodes);
    newNodes = new Set(availableNodes.filter(node => !searchedNodes.has(node)));

    searchedNodes = new Set([...searchedNodes, ...newNodes]);
    solved = searchedNodes.has(santa);

    steps++;
  }

  console.log('Orbital transfers', steps - 2);
}
