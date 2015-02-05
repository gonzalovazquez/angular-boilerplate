var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('gulp-karma');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var files = require('./config/files');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var colors = require('colors');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var inject = require("gulp-inject");
var clean = require('gulp-clean');
var sequence = require('run-sequence');
var stylish = require('jshint-stylish');
var pkg = require('./package.json');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var es = require('event-stream');
var webserver = require('gulp-webserver');
var size = require('gulp-filesize');

// Concat & Minify JS
gulp.task('minify-js', function(){
	return gulp.src([files.vendor, files.scripts])
		.pipe(concat('all-'+ pkg.version + '.min.js'))
		.pipe(gulp.dest(files.publicScripts))
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest(files.publicScripts))
		.pipe(size());
});

// SASS to CSS
gulp.task('css', function () {
	var sassFiles = gulp.src(files.sass)
	.pipe(sass({
			onError: function (error) {
			gutil.log(gutil.colors.red(error));
			gutil.beep();
		},
		onSuccess: function () {
			gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
		}
	}));

	return es.concat(gulp.src(files.css), sassFiles)
			.pipe(concat('main-' + pkg.version + '.min.css'))
			.pipe(gulpif(argv.production, minifyCSS()))
			.pipe(gulp.dest(files.publicStyles))
			.pipe(size());
});

//Minify Images
gulp.task('minify-img', function () {
	gulp.src(files.images)
		.pipe(imagemin())
		.pipe(gulp.dest(files.publicImage));
});

// Build HTML files
gulp.task('build-html', function() {
	gulp.src(files.index)
		.pipe(inject(gulp.src(['./public/javascript/*.js','./public/css/*.css'], { read: false }), { ignorePath: 'public/' }))
		.pipe(gulp.dest(files.publicDir))
		.pipe(size());
});

// Lint JS
gulp.task("lint", function() {
	gulp.src([files.scripts, '!'+ files.vendor])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

//Test
gulp.task('test', function() {
	return gulp.src(files.test.concat(files.templates))
		.pipe(karma({
			configFile: 'config/karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('test-watch', function() {
	return gulp.src(files.test.concat(files.templates))
		.pipe(karma({
			configFile: 'config/karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('watch', ['build'], function() {
	gulp.watch(files.source + '/**', ['lint']);
	gulp.watch([files.index], ['build-html']);
	gulp.watch([files.scripts], ['minify-js']);
	gulp.watch([files.sass], ['css']);
	gulp.watch([files.css], ['css']);
});

//Launched web server and watches for changes
gulp.task('webserver', ['watch'], function(next) {
	gulp.src('public')
	.pipe(webserver({
		livereload: false,
		directoryListing: false,
		open: true
	}));
});

//Move bower_components to public
gulp.task('bower_components', function(){
	gulp.src(files.libs, { base: './' })
		.pipe(gulp.dest(files.publicDir));
});

//Move views to public folder
gulp.task('views', function(){
	return gulp.src(files.views)
		.pipe(gulp.dest('public/views'));
});

//Move templates to public folder
gulp.task('templates', function(){
	return gulp.src(files.templates)
		.pipe(gulp.dest('public/templates'));
});

//Build
gulp.task('build', function(callback) {
	sequence(
		'clean',
		['minify-js','css'],
		'build-html',
		'bower_components',
		'views',
		'templates',
		callback);
});

// Clean build folder
gulp.task('clean', function () {
	return gulp.src(files.publicDir, {read: false})
		.pipe(clean());
});

// Default
gulp.task('default', ['build']);