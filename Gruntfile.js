module.exports = function(grunt) {

  grunt.initConfig({
    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [ {
          cwd: 'src/templates',
          src: ['**/*.jade', '!includes/*.jade'],
          dest: '.',
          expand: true,
          ext: '.html'
        } ]
      }
    },
    uglify: {
      dist: {
        options: {
          beautify: true
        },
        files: {
          'assets/js-min/game.js': [
            'src/scripts/*.js',
          ]
        }
      }
    },
    sass: {
      compile: {
        options: {
          style: 'compressed',
          loadPath: 'bower_components'
        },
        files: {
          'assets/css/global.css': [
            'src/sass/global.scss'
          ]
        }
      }
    },
    watch: {
      css: {
        files: 'src/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      scripts: {
        files: 'src/**/*.js',
        tasks: ['uglify'],
        options: {
          livereload: true,
        }
      },
      htmls: {
        files: 'src/**/*.jade',
        tasks: ['jade'],
        options: {
          livereload: true,
        }
      }
    }
  });

  //grunt.loadNpmTasks('plugin-name');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('compile', ['jade', 'uglify','sass']);
  grunt.registerTask('default', ['watch']);
};