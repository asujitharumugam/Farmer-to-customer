const { run } = require('node:test');
const path = require('path');
const glob = require('fs');

const testFiles = [
  path.join(__dirname, 'unit', 'orderCalculations.test.js'),
  path.join(__dirname, 'unit', 'orderStateMachine.test.js')
];

run({ files: testFiles })
  .on('test:fail', (data) => {
    console.error(`❌ Test Failed: ${data.name}`);
    process.exitCode = 1;
  })
  .on('test:pass', (data) => {
    console.log(`✔ Test Passed: ${data.name}`);
  });
