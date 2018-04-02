let interpreter = require('bason')
let parser = require('../src/parser.js')
let fs = require('fs');

fs.readFile( __dirname + '/program.txt', function (err, data) {
  if (err) {
    throw err;
  }
  interpreter.RUN(parser.parse(data.toString()));
});
