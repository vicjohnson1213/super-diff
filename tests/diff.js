var expect = require('chai').expect,
    diff = require('../diff.js'),
    fs = require('fs'),
    path = require('path');

describe('super-diff', function() {
    it('should work on loading files', function() {
        var orig = fs.readFileSync(path.join(__dirname, 'testfile.txt'), 'UTF-8');
        var mod = fs.readFileSync(path.join(__dirname, 'second.txt'), 'UTF-8');

        var res = diff.buildDiff(orig, mod);

        expect(res.diff.length).to.equal(10);
        expect(res.added().length).to.equal(4);
        expect(res.removed().length).to.equal(5);
        expect(res.similar().length).to.equal(1);
    });

    describe('scopes', function() {
        it('chars', function() {
            var res = diff.buildDiff('test', 'feast', {
                scope: 'chars'
            });

            expect(res.diff.length).to.equal(6);
            expect(res.added().length).to.equal(2);
            expect(res.removed().length).to.equal(1);
            expect(res.similar().length).to.equal(3);
        });

        it('words', function() {
            var orig = 'words to diff';
            var mod = 'word to not diff';

            var res = diff.buildDiff(orig, mod, {
                scope: 'words',
            });

            expect(res.diff.length).to.equal(5);
            expect(res.added().length).to.equal(2);
            expect(res.removed().length).to.equal(1);
            expect(res.similar().length).to.equal(2);
        });

        it('lines', function() {
            var orig = 'words to diff\nanother line to diff';
            var mod = 'word to not diff\nanother line to diff\na third line';

            var res = diff.buildDiff(orig, mod);

            expect(res.diff.length).to.equal(4);
            expect(res.added().length).to.equal(2);
            expect(res.removed().length).to.equal(1);
            expect(res.similar().length).to.equal(1);
        });

        it('arrays', function() {
            var res = diff.buildDiff(
                ['this', 'is', 'an', 'array', 'of', 'stuff'],
                ['this', 'is', 'different', 'than', 'that', 'stuff'], {
                    scope: 'lines',
                    isArray: true
                });

            expect(res.diff.length).to.equal(9);
            expect(res.added().length).to.equal(3);
            expect(res.removed().length).to.equal(3);
            expect(res.similar().length).to.equal(3);
        });
    });

    describe('trimWhitespace', function() {
        it('should ignore whitespace if flag is set', function() {
            var orig = ['first', 'second', 'third'];
            var mod = ['  first', 'second   ', 'thid'];

            var res = diff.buildDiff(orig, mod, {
                isArray: true,
                trimWhitespace: true
            });

            expect(res.diff.length).to.equal(4);
            expect(res.added().length).to.equal(1);
            expect(res.removed().length).to.equal(1);
            expect(res.similar().length).to.equal(2);
        });

        it('should not ignore whitespace if flag is not set', function() {
            var orig = ['first', 'second', 'third'];
            var mod = ['  first', 'second   ', 'thid'];

            var res = diff.buildDiff(orig, mod, {
                isArray: true,
            });

            expect(res.diff.length).to.equal(6);
            expect(res.added().length).to.equal(3);
            expect(res.removed().length).to.equal(3);
            expect(res.similar().length).to.equal(0);
        });
    });
});