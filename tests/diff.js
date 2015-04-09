var expect = require('chai').expect,
    diff = require('../diff.js'),
    fs = require('fs'),
    path = require('path');

describe('super-diff', function() {
    it('should work on loading files', function() {
        var orig = fs.readFileSync(path.join(__dirname, 'test-file1.txt'), 'UTF-8');
        var mod = fs.readFileSync(path.join(__dirname, 'test-file2.txt'), 'UTF-8');

        var res = diff.buildDiff(orig, mod);


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

        it('lines', function() {
            var orig = 'words to diff\r\nanother line to diff';
            var mod = 'word to not diff\nanother line to diff\ra third line';

            var res = diff.buildDiff(orig, mod);

            expect(res.added()).to.eql([
                {
                    value: 'word to not diff',
                    added: true,
                    originalPos: -1,
                    newPos: 0
                }, {
                    value: 'a third line',
                    added: true,
                    originalPos: -1,
                    newPos: 2
                }
            ]);

            expect(res.removed()).to.eql([
                {
                    value: 'words to diff',
                    removed: true,
                    originalPos: 0,
                    newPos: -1
                }
            ]);

            expect(res.similar()).to.eql([
                {
                    value: 'another line to diff',
                    similar: true,
                    originalPos: 1,
                    newPos: 1
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

    describe('trimWhitespace', function() {
        it('true', function() {
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

        it('false', function() {
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
    });
});