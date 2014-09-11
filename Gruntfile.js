'use strict';

module.exports = function(grunt) {
  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    yo : {
      src : 'src',
      dist : 'dist'
    },
    clean : {
      dist : {
        files : [ {
          dot : true,
          src : [ '.tmp', '<%= yo.dist %>/*', '!<%= yo.dist %>/.git*' ]
        } ]
      },
      server : '.tmp'
    },
    jshint : {
      gruntfile : {
        options : {
          jshintrc : '.jshintrc'
        },
        src : 'Gruntfile.js'
      },
      src : {
        options : {
          jshintrc : '.jshintrc'
        },
      src : [ '<%= yo.src %>/{,*/}*.js' ]
    },
    test : {
      options : {
        jshintrc : 'test/.jshintrc'
      },
      src : [ 'test/**/*.js' ]
    }
    },
    karma : {
      options : {
        configFile : 'karma.conf.js',
        browsers : [ 'PhantomJS' ]
      },
      unit : {
        singleRun : true
      },
      server : {
        autoWatch : true
      }
    },
    ngmin : {
      dist : {
        src : [ '<%= yo.src %>/<%= pkg.name %>.js' ],
        dest : '<%= yo.dist %>/<%= pkg.name %>.js'
      }
    },
    concat : {
      options : {
        stripBanners : true
      },
      dist : {
        src : [ '<%= yo.src %>/<%= pkg.name %>.js' ],
        dest : '<%= yo.dist %>/<%= pkg.name %>.js'
      }
    },
    uglify : {
      dist : {
        src : '<%= concat.dist.dest %>',
        dest : '<%= yo.dist %>/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.registerTask('test', [ 'jshint', 'karma:unit' ]);
  grunt.registerTask('build', [ 'clean:dist', 'concat:dist', 'ngmin:dist', 'uglify:dist' ]);
  grunt.registerTask('release', [ 'test', 'bump-only', 'build', 'bump-commit' ]);
  grunt.registerTask('default', [ 'build' ]);
};
