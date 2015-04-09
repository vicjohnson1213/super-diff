# Super-Diff [![Build Status](https://travis-ci.org/vicjohnson1213/super-diff.svg)](https://travis-ci.org/vicjohnson1213/super-diff)

>Super-Diff is a node.js library to compute the difference between two text blocks, offering flexibility and many configuration options.

## Getting Started

You can install the module using the following command:

```bash
npm install super-diff --save
```

## Usage

```javascript
var diff = require('super-diff');

var originalText = 'some of your original text';
var modifiedText = 'some of your modified text';

var result = diff.buildDiff(originalText, modifiedText);

result.diff.forEach(function(chunk) {

  // Prints a basic line diff between originalText and modifiedText
  if (chunk.added) {
    console.log('+ ' + chunk.value);
  } else if (chunk.removed) {
    console.log('- ' + chunk.value);
  } else {
    console.log('  ' + chunk.value);
  }
});
```

#### The diff.buildDiff Function

The `buildDiff` function of super-diff will compute the differences between two text blocks and return an object describing the results of the operation.

*Return value:*

```javascript
{
  diff: [] // See "The Diff Array of Each Chunk" section.
  added: function() // Returns an array of all chunks that were added.
  removed: function() // Returns an array of all chunks that were removed.
  similar: function() // Returns an array of all chunks that remained the same.
}
```

#### The Diff Array of Each Chunk

In the return value of the `buildDiff` function, there is a `diff` array that contains objects describing each chunk of data (char, word, line, or array element) and information about its difference between the two text blocks.

*Diff object structure:*

```javascript
{
  value: string // The actual text from this chunk of data.
  added: boolean // True if this chunk was added, undefined otherwise.
  removed: boolean // True if this chunk was remove, undefined otherwise.
  similar: boolean // True if this chunk stayed the same, undefined otherwise.
  originalPos: int // Position of this chunk in the original text, -1 if it didn't exist.
  newPos: int // Position of this chunk in the modified text, -1 if it doesn't exist.
}
```

**Note:** the `groups` option will change the structure of this object if it is set to true.  See the `groups` option section for details.

## BuildDiff Options

The `buildDiff` function takes an options object to control the behavior of the diff computation.

*Options syntax (with defaults shown):*

```javascript
var result = diff.buildDiff(originalText, modifiedText, {
  scope: 'lines',
  isArray: false,
  groups: false,
  trimWhitespace: false
});
```

#### scope: String (default: `'lines'`)

Specifies which parts of the text block to compare.

*Valid scopes:*

* `'lines'`: Check for differences in the lines of the text. (separates by `/\n|\r\n|\r/`)
* `'words'`: Check for differences in the words of the text. (separates by `/\s/`)
* `'chars'`: Check for differences in the characters of the text. (separates by `''`)

#### isArray: Boolean (default: false)

Specifies whether the text is already split into arrays.  If the contents of each text block are already split into arrays, the scope of the diff will default to the elements of the array, ignoring the `scope` option.

*Example:*

```javascript
var original = ['this', 'is', 'some', 'text'];
var modified = ['this', 'is', 'different', 'text', 'than', 'before'];

var result = diff.buildDiff(original, modified, {
  isArray: true
});
```

#### trimWhitespace: Boolean (default: false)

Specifies whether or not to include leading/trailing whitespace in the comparison of each chunk of data.

*Example:*

```javascript
var noWhitespace = 'some text here';
var whitespace = '  some text here       ';

var result = diff.buildDiff(noWhitespace, whitespace, {
  trimWhitespace: true
});

// result will show no difference between these two text blocks.
```

#### groups: boolean (default: true)

Specifies whether or not the results of the diff will be returned in groups of consecutive similar results.

*Example:*

```javascript
var original = 'abcdg';
var modified = 'abefg';

var result = diff.buildDiff(original, modified, {
  scope: 'chars',
  groups: true
});

// The resulting diff object (stored in result.diff): 
[ 
  [ 
    { value: 'a', similar: true, originalPos: 0, newPos: 0 },
    { value: 'b', similar: true, originalPos: 1, newPos: 1 }
  ], [
    { value: 'c', removed: true, originalPos: 2, newPos: -1 },
    { value: 'd', removed: true, originalPos: 3, newPos: -1 }
  ], [
    { value: 'e', added: true, originalPos: -1, newPos: 2 },
    { value: 'f', added: true, originalPos: -1, newPos: 3 }
  ], [
    { value: 'g', similar: true, originalPos: 4, newPos: 4 }
  ]
]
```
## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

#### Running unit tests:

running `grunt test` will run all of the unit tests inside the `tests/` directory. For convenience, I have added a `grunt watch` task that will run all unit tests each time a test or source file is changed.

I am striving to keep code coverage at 100% and linting errors to 0. For that reason, the unit tests are configured to fail on any coverage lower than 95% or on any linting errors.

## License

#### MIT

Copyright © 2015 Julien Bouquillon, revolunet <julien@revolunet.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.