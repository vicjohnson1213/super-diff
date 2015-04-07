'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['tests/**/*.js']
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'diff.js', 'tests/**/*.js'],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['mochaTest', 'jshint']);
    grunt.registerTask('test-only', ['mochaTest']);
};