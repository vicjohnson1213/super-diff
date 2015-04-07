var expect = require('chai').expect,
    diff = require('../diff.js'),
    fs = require('fs'),
    path = require('path');

describe('text-diff', function() {
    it('should diff chars if given a string', function() {
        var res = diff.buildDiff('test', 'feast', {
            scope: 'chars'
        });

        expect(res.diff.length).to.equal(6);
        expect(res.added.length).to.equal(2);
        expect(res.removed.length).to.equal(1);
        expect(res.similar.length).to.equal(3);
    });

    it('should diff text in arrays', function() {
        var res = diff.buildDiff(
            ['this', 'is', 'an', 'array', 'of', 'stuff'],
            ['this', 'is', 'different', 'than', 'that', 'stuff'], {
                scope: 'lines',
                array: true
            });

        expect(res.diff.length).to.equal(9);
        expect(res.added.length).to.equal(3);
        expect(res.removed.length).to.equal(3);
        expect(res.similar.length).to.equal(3);
    });

    it('should work on loading files', function() {
        var orig = fs.readFileSync(path.join(__dirname, 'testfile.txt'), 'UTF-8');
        var mod = fs.readFileSync(path.join(__dirname, 'second.txt'), 'UTF-8');

        var res = diff.buildDiff(orig, mod, {
            array: false
        });

        expect(res.diff.length).to.equal(10);
        expect(res.added.length).to.equal(4);
        expect(res.removed.length).to.equal(5);
        expect(res.similar.length).to.equal(1);
    });

    it('should work on words', function() {
        var orig = fs.readFileSync(path.join(__dirname, 'testfile.txt'), 'UTF-8');
        var mod = fs.readFileSync(path.join(__dirname, 'second.txt'), 'UTF-8');

        var res = diff.buildDiff(orig, mod, {
            scope: 'words',
            array: false
        });

        expect(res.diff.length).to.equal(21);
        expect(res.added.length).to.equal(5);
        expect(res.removed.length).to.equal(8);
        expect(res.similar.length).to.equal(8);
    });
});