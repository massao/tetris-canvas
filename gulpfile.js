var gulp = require('gulp');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');

var paths = {
	templates: ['src/templates/*.jade'],
	scripts: [
		'src/scripts/block.js',
		'src/scripts/piece.js',
		'src/scripts/game.js',
		'src/scripts/main.js'
	],
	css: ['src/stylus/*.styl']
};

var jadeTask = function() {
	gulp.src(paths.templates)
	.pipe(jade({
		pretty: true
	}))
	.pipe(gulp.dest('.'))
	prettyHtml = true;
};

var javascriptTask = function() {
	gulp.src(paths.scripts)
	.pipe(concat('game.js'))
	.pipe(uglify())
	.pipe(gulp.dest('assets/js'))
}

var cssTask = function() {
	gulp.src(paths.css)
	.pipe(stylus())
	.pipe(gulp.dest('assets/css'))
};

gulp.task('jade', jadeTask);
gulp.task('scripts', javascriptTask);
gulp.task('css', cssTask);

gulp.task('default', ['jade', 'scripts', 'css']);
gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.css, ['css']);
	gulp.watch(paths.templates, ['jade']);
});
