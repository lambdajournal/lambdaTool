module.exports = function (grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= props.license %> */\n',
    // Task configuration
    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
        boss: true
      },
      gruntfile: {
        src: 'gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    peg: {
      example: {
        src: "lambdaGrammar.pegjs",
        dest: "lambdaParser.js",
        options: {
          exportVar: "lambdaParser"
        }
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "src/",
          "src": ["**/*.js"],
          "dest": "build/",
          "ext": ".js"
        }]
      }
    }
  });

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-babel');

  // Default task
  grunt.registerTask('default', ['jshint', 'qunit']);
  //  grunt.registerTask('peg', ['jshint', 'qunit']);

};