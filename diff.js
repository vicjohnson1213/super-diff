'use strict';

var merge = require('merge');

function buildLCS(original, modified) {
    var LCSMatrix = [];

    for (var x = 0; x <= original.length; x++) {
        LCSMatrix[x] = [];
        for (var y = 0; y <= modified.length; y++) {
            LCSMatrix[x][y] = 0;
        }
    }

    for (var i = 1; i <= original.length; i++) {
        for (var j = 1; j <= modified.length; j++) {
            if (original[i - 1] === modified[j - 1]) {
                LCSMatrix[i][j] = LCSMatrix[i - 1][j - 1] + 1;
            } else {
                LCSMatrix[i][j] = Math.max(LCSMatrix[i - 1][j], LCSMatrix[i][j - 1]);
            }
        }
    }

    return LCSMatrix;
}

function buildDiff(LCSMatrix, original, modified) {
    var result = [],
        i = original.length,
        j = modified.length;


    while(true) {
        if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
            result.splice(0, 0, {
                value: original[i - 1],
                similar: true,
                originalPos: i - 1,
                newPos: i - 1
            });

            i--;
            j--;
        } else if (j > 0 && (i === 0 || LCSMatrix[i][j - 1] >= LCSMatrix[i - 1][j])) {
            result.splice(0, 0, {
                value: modified[j - 1],
                added: true,
                originalPos: -1,
                newPos: j - 1
            });

            j--;
        } else if (i > 0 && (j === 0 || LCSMatrix[i][j - 1] < LCSMatrix[i - 1][j])) {
            result.splice(0, 0, {
                value: original[i - 1],
                removed: true,
                originalPos: i - 1,
                newPos: -1
            });

            i--;
        } else {
            break;
        }
    }

    var diff = {
        diff: result,
        added: function() {
            return result.filter(function(el) {
                return el.added;
            });
        },
        removed: function() {
            return result.filter(function(el) {
                return el.removed;
            });
        },
        similar: function() {
            return result.filter(function(el) {
                return el.similar;
            });
        }
    };

    return diff;
}

function trimWhitespace(arr) {
    return arr.map(function(el) {
        return el.trim();
    });
}

module.exports = {
    buildDiff: function(orig, mod, opts) {
        var options = merge({
            scope: 'lines',
            isArray: false,
            trimWhitespace: false
        }, opts);

        var original = orig;
        var modified = mod;


        if (!options.isArray && options.scope === 'lines') {
            original = orig.split('\n');
            modified = mod.split('\n');
        } else if (!options.isArray && options.scope === 'words') {
            original = orig.split(/\s/);
            modified = mod.split(/\s/);
        } else if (options.isArray || options.scope === 'chars') {
            // chars/arrays can be accessed by string[idx]/arr[idx], so not much to do here for now.
        }

        if (options.trimWhitespace) {
            original = trimWhitespace(original);
            modified = trimWhitespace(modified);
        }

        return buildDiff(buildLCS(original, modified), original, modified);
    }
};