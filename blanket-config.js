var path = require('path');
var srcDir = path.join(__dirname, 'diff.js');

require('blanket')({
  pattern: srcDir
});