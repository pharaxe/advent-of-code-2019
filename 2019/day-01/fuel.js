const fs = require('fs');
const readline = require('readline');

const filename = process.argv[2];
const readStream = fs.createReadStream(filename);
const readInterface = readline.createInterface({ input: readStream });

let totalFuel = 0;

const calcFuel = (mass) => {
  let massNumber = Number(mass);
  let fuelForMass = Math.floor(mass / 3) - 2;

  if (fuelForMass >= 0) {
    return fuelForMass + calcFuel(fuelForMass);
  } else {
    // wish hard
    return 0;
  }
};

readInterface.on('line', (line) => {
  const mass = Number(line);
  const fuelNeededForModule = calcFuel(mass);
  console.log('module with mass of', mass, 'requires', fuelNeededForModule);
  totalFuel += fuelNeededForModule;
}).on('close', () => {
  console.log('total fuel for all the modules:', totalFuel);
});

