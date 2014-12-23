'use strict';

module.exports = function(grunt){
    grunt.initConfig({
        jasmine_node:{
            inherit: ['inherit.spec.js'],
            overload: ['spec/overload'],
            override: ['spec/override'],
            all: ['spec/']
        },
        watch:{

        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');
};