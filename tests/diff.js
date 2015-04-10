var expect = require('chai').expect,
    diff = require('../diff.js'),
    fs = require('fs'),
    path = require('path');

describe('super-diff', function() {
    describe('scopes', function() {
        it('chars', function() {
            var res = diff.buildDiff('test', 'atst', {
                scope: 'chars'
            });

            expect(res.added()).to.eql([
                {
                    value: 'a',
                    added: true,
                    originalPos: -1,
                    newPos: 0
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'e',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 't',
                    similar: true,
                    originalPos: 0,
                    newPos: 1
                }, {
                    value: 's',
                    similar: true,
                    originalPos: 2,
                    newPos: 2
                }, {
                    value: 't',
                    similar: true,
                    originalPos: 3,
                    newPos: 3
                }
            ]);
        });

        it('words', function() {
            var orig = 'first second third';
            var mod = 'new second added third';

            var res = diff.buildDiff(orig, mod, {
                scope: 'words',
            });

            expect(res.added()).to.eql([
                {
                    value: 'new',
                    added: true,
                    originalPos: -1,
                    newPos: 0
                }, {
                    value: 'added',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'first',
                    removed: true,
                    originalPos: 0,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'second',
                    similar: true,
                    originalPos: 1,
                    newPos: 1
                }, {
                    value: 'third',
                    similar: true,
                    originalPos: 2,
                    newPos: 3
                }
            ]);
        });

        it('arrays', function() {
            var res = diff.buildDiff(
                ['first', 'second', 'third'],
                ['new word', 'third', 'second'],
                {
                    scope: 'lines',
                    isArray: true
                });

            expect(res.added()).to.eql([
                {
                    value: 'new word',
                    added: true,
                    originalPos: -1,
                    newPos: 0
                }, {
                    value: 'second',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'first',
                    removed: true,
                    originalPos: 0,
                    newPos: -1
                }, {
                    value: 'second',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'third',
                    similar: true,
                    originalPos: 2,
                    newPos: 1
                }
            ]);
        });
    });

    describe('whitespace', function() {
        it('trimWhitespace: true', function() {
            var orig = ['first', 'second', 'third'];
            var mod = ['  first', 'second   ', 'thid'];

            var res = diff.buildDiff(orig, mod, {
                isArray: true,
                trimWhitespace: true
            });

            expect(res.added()).to.eql([
                {
                    value: 'thid',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'third',
                    removed: true,
                    originalPos: 2,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'first',
                    similar: true,
                    originalPos: 0,
                    newPos: 0
                }, {
                    value: 'second',
                    similar: true,
                    originalPos: 1,
                    newPos: 1
                }
            ]);
        });

        it('trimWhitespace: false', function() {
            var orig = ['first', 'second', 'third'];
            var mod = ['  first', 'second   ', 'thid'];

            var res = diff.buildDiff(orig, mod, {
                isArray: true,
            });

            expect(res.added()).to.eql([
                {
                    value: '  first',
                    added: true,
                    originalPos: -1,
                    newPos: 0
                }, {
                    value: 'second   ',
                    added: true,
                    originalPos: -1,
                    newPos: 1
                }, {
                    value: 'thid',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'first',
                    removed: true,
                    originalPos: 0,
                    newPos: -1
                }, {
                    value: 'second',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }, {
                    value: 'third',
                    removed: true,
                    originalPos: 2,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([]);
        });

        it('ignoreLineEndings: true', function() {
            // Need to load files in order to get /^/m to match line breaks
            var orig = fs.readFileSync(path.join(__dirname, 'test-file1.txt'), 'UTF-8');
            var mod = fs.readFileSync(path.join(__dirname, 'test-file2.txt'), 'UTF-8');

            var res = diff.buildDiff(orig, mod, {
                ignoreLineEndings: true
            });

            expect(res.added()).to.eql([
                {
                    value: 'different line',
                    added: true,
                    originalPos: -1,
                    newPos: 1
                }, {
                    value: 'added line',
                    added: true,
                    originalPos: -1,
                    newPos: 3
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'second line',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'first line',
                    similar: true,
                    originalPos: 0,
                    newPos: 0
                }, {
                    value: 'third line',
                    similar: true,
                    originalPos: 2,
                    newPos: 2
                }
            ]);
        });

        it('ignoreLineEndings: false', function() {
            // Need to load files in order to get /^/m to match line breaks
            var orig = fs.readFileSync(path.join(__dirname, 'test-file1.txt'), 'UTF-8');
            var mod = fs.readFileSync(path.join(__dirname, 'test-file2.txt'), 'UTF-8');

            var res = diff.buildDiff(orig, mod);

            expect(res.added()).to.eql([
                {
                    value: 'different line\r\n',
                    added: true,
                    originalPos: -1,
                    newPos: 1
                }, {
                    value: 'third line\r\n',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }, {
                    value: 'added line',
                    added: true,
                    originalPos: -1,
                    newPos: 3
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'second line\r\n',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }, {
                    value: 'third line',
                    removed: true,
                    originalPos: 2,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'first line\r\n',
                    similar: true,
                    originalPos: 0,
                    newPos: 0
                }
            ]);
        });
    });

    describe('groups', function() {
        it('true', function() {
            var original = 'abcdg';
            var modified = 'abefg';

            var result = diff.buildDiff(original, modified, {
                scope: 'chars',
                groups: true
            });

            // Uses to check whether the added function is returning the correct thing
            expect(result.similar().length).to.equal(2);
            expect(result.diff[0]).to.eql([
                {
                    value: 'a',
                    similar: true,
                    originalPos: 0,
                    newPos: 0
                },  {
                    value: 'b',
                    similar: true,
                    originalPos: 1,
                    newPos: 1
                }
            ], [
                {
                    value: 'g',
                    removed: true,
                    originalPos: 4,
                    newPos: 4
                }
            ]);

            // Uses to check whether the removed function is returning the correct thing
            expect(result.removed().length).to.equal(1);
            expect(result.diff[1]).to.eql([
                {
                    value: 'c',
                    removed: true,
                    originalPos: 2,
                    newPos: -1
                }, {
                    value: 'd',
                    removed: true,
                    originalPos: 3,
                    newPos: -1
                }
            ]);

            // Uses to check whether the similar function is returning the correct thing
            expect(result.added().length).to.equal(1);
            expect(result.diff[2]).to.eql([
                {
                    value: 'e',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }, {
                    value: 'f',
                    added: true,
                    originalPos: -1,
                    newPos: 3
                }
            ]);
        });
    });

    describe('miscellaneous', function() {
        it('should compute removals before additions', function() {
            var original = ['first', 'second', 'third'];
            var modified = ['first', 'different', 'third'];

            var result = diff.buildDiff(original, modified, {
                isArray: true
            });

            expect(result.diff).to.eql([
                {
                    value: 'first',
                    similar: true,
                    originalPos: 0,
                    newPos: 0
                }, {
                    value: 'second',
                    removed: true,
                    originalPos: 1,
                    newPos: -1
                }, {
                    value: 'different',
                    added: true,
                    originalPos: -1,
                    newPos: 1
                }, {
                    value: 'third',
                    similar: true,
                    originalPos: 2,
                    newPos: 2
                }
            ]);
        });
    });
});