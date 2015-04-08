# Super-Diff [![Build Status](https://travis-ci.org/vicjohnson1213/super-diff.svg)](https://travis-ci.org/vicjohnson1213/super-diff)

>Super-Diff is a node.js library to calculate the difference between two text blocks.

## Getting Started

You can install the module using the following command:

```bash
npm install super-diff --save
```

## Usage

```javascript
var diff = require('super-diff');

var result = diff.buildDiff(originalText, modifiedText);

result.diff.forEach(function(line) {
    if (line.added) {
        console.log('+ ' + line.value);
    } else if (line.removed) {
        console.log('- ' + line.value);
    } else {
        console.log('  ' + line.value);
    }
});
```

## Options

Options should be passes to Super-Diff like this:

```javascript
var result = diff.buildDiff(originalText, modifiedText, {
    scope: 'lines',
    array: false
});
```
#### scope: String (default: `'lines'`)

Specifies the what parts of the document to compare.  

*Valid scopes:*
* `'lines'`: Check for differences in the lines of the text.
* `'words'`: Check for differences in the words of the text, **whitespace is significant.**
* `'chars'`: Check for differences in the characters of the text.


#### array: Boolean (default: false)

Specifies whether the text will be sent in arrays.  If the contents of each text block are arrays, the scope of the diff will be the elements of the array, not `'lines'`, `'words'`, or `'chars'`.

*Example usage:*
```javascript
var original = ['this', 'is', 'some', 'text'];
var modified = ['this', 'is', 'different', 'text', 'than', 'before'];
var res = diff.buildDiff(original, modified, {
    array: true
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## License

#### MIT

Copyright © 2015 Julien Bouquillon, revolunet <julien@revolunet.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.