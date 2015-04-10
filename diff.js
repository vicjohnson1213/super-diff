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

function buildDiff(original, modified, groups) {
    var result = [],
        i = original.length,
        j = modified.length,
        LCSMatrix = buildLCS(original, modified);

    while(true) {
        var chunk;

        if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
            chunk = {
                value: original[i - 1],
                similar: true,
                originalPos: i - 1,
                newPos: j - 1
            };

            i--;
            j--;
        } else if (j > 0 && (i === 0 || LCSMatrix[i][j - 1] >= LCSMatrix[i - 1][j])) {
            chunk = {
                value: modified[j - 1],
                added: true,
                originalPos: -1,
                newPos: j - 1
            };

            j--;
        } else if (i > 0 && (j === 0 || LCSMatrix[i][j - 1] < LCSMatrix[i - 1][j])) {
            chunk = {
                value: original[i - 1],
                removed: true,
                originalPos: i - 1,
                newPos: -1
            };

            i--;
        } else {
            break;
        }

        // Since we are adding the new chunks to the front, result[0][0]
        // is the latest addition.
        if (groups) {
            if (groups && result[0] && result[0][0] &&
                ((result[0][0].added && chunk.added) ||
                (result[0][0].removed && chunk.removed) ||
                (result[0][0].similar && chunk.similar))) {

                result[0].splice(0, 0, chunk);
            continue;
            }
         
            chunk = [chunk];
        }

        result.splice(0, 0, chunk);

    }

    var diff = {
        diff: result,
        added: function() {
            return result.filter(function(el) {
                return groups ? el[0].added : el.added;
            });
        },
        removed: function() {
            return result.filter(function(el) {
                return groups ? el[0].removed : el.removed;
            });
        },
        similar: function() {
            return result.filter(function(el) {
                return groups ? el[0].similar : el.similar;
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

function removeWhiteSpace(arr) {
    return arr.map(function(el) {
        return el.replace(/(\n|\r\n|\r)$/, '');
    });
}

module.exports = {
    buildDiff: function(orig, mod, opts) {
        // Overwrite the default options with any specified in opts
        var options = merge({
            scope: 'lines',
            isArray: false,
            trimWhitespace: false,
            ignoreLineEndings: false,
            groups: false
        }, opts);

        var original = orig;
        var modified = mod;

        if (!options.isArray) {

            switch (options.scope) {
                case 'words':
                    original = orig.split(/\s/);
                    modified = mod.split(/\s/);
                    break;
                case 'chars':
                    // chars can be accessed by string[idx], so not much to do here for now,
                    // but there may be something to do in the future.
                    break;
                default:
                    // Default the scope of the diff to 'lines'
                    original = orig.split(/^/m).map(function(el, idx, arr) {
                        return (el[el.length - 1] === '\r' && arr[idx + 1] === '\n') ? el + '\n' : el;
                    }).filter(function(el, idx, arr) {
                        return !(arr[idx - 1] && arr[idx - 1].match(/\r\n$/) && el === '\n');
                    });

                    modified = mod.split(/^/m).map(function(el, idx, arr) {
                        return (el[el.length - 1] === '\r' && arr[idx + 1] === '\n') ? el + '\n' : el;
                    }).filter(function(el, idx, arr) {
                        return !(arr[idx - 1] && arr[idx - 1].match(/\r\n$/) && el === '\n');
                    });
                    break;
            }
        }

        if (options.trimWhitespace) {
            original = trimWhitespace(original);
            modified = trimWhitespace(modified);
        }

        if (options.ignoreLineEndings) {
            original = removeWhiteSpace(original);
            modified = removeWhiteSpace(modified);
        }

        return buildDiff(original, modified, options.groups);
    }
};