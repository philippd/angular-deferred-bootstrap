'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    language: grunt.option('lang') || 'en',

    meta: {
      banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
        ' * License: <%= pkg.license %>\n */\n'
    },

    build_dir: 'dist',

    files: {

      core: [
        'src/deferred-bootstrap.js'
      ],

      test: ['test/**/*.js']
    },

    watch: {

      scripts: {
        files: ['Gruntfile.js', '<%= files.core %>', '<%= files.test %>'],
        tasks: ['jshint:all', 'karma:unit']
      },

      livereload: {
        options: {
          livereload: true
        },
        files: ['src/**/*.js'],
        tasks: ['jshint', 'karma:unit', 'concat']
      }
    },

    jshint: {

      options: {
        jshintrc: true
      },

      all: ['Gruntfile.js', '<%= files.core %>', '<%= files.test %>'],

      core: {
        files: {
          src: ['<%= files.core %>']
        }
      },

      test: {
        files: {
          src: ['<%= files.test %>']
        }
      }
    },

    express: {
      server: {
        options: {
          port: 3005,
          bases: '.',
          server: __dirname + '/server.js'
        }
      }
    },

    concat: {

      banner: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.core.dest %>',
        dest: '<%= concat.core.dest %>'
      },

      core: {
        src: ['src/deferred-bootstrap.prefix', '<%= files.core %>', 'src/deferred-bootstrap.suffix'],
        dest: '<%= build_dir %>/angular-deferred-bootstrap.js'
      }

    },

    uglify: {
      core: {
        files: {
          '<%= build_dir %>/angular-deferred-bootstrap.min.js': '<%= concat.core.dest %>'
        }
      }
    },

    karma: {
      'unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },

      'chrome-unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome']
      },

      'firefox-unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Firefox']
      },

      'debug-unit': {
        configFile: 'karma.conf.js',
        singleRun: false
      }
    }
  });

  grunt.registerTask('default', ['jshint:all', 'karma:unit']);
  grunt.registerTask('test', ['karma:unit']);

  // Advanced test tasks
  grunt.registerTask('test-chrome', ['karma:chrome-unit']);
  grunt.registerTask('test-firefox', ['karma:firefox-unit']);
  grunt.registerTask('test-all', ['karma']);

  grunt.registerTask('build', [
    'jshint:all',
    'karma:unit',
    'concat:core',
    'concat:banner',
    'uglify:core'
  ]);

  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit',  'concat', 'watch:livereload']);
  grunt.registerTask('server', ['express', 'express-keepalive']);
};
