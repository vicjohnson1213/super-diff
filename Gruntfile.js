'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: './blanket-config'
                },
                src: ['tests/**/*.js']
            },
            'html-cov': {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage/coverage.html'
                },
                src: ['tests/**/*.js']
            },
            'travis-cov': {
                options: {
                    reporter: 'travis-cov'
                },
                src: ['tests/**/*.js']
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'diff.js', 'tests/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            files: ['diff.js', 'tests//**/*.js'],
            tasks: ['test'],
            options: {
                debounceDelay: 1000
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['mochaTest', 'jshint']);
};