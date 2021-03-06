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
var protractor = require("gulp-protractor").protractor;
var gulp = require('gulp-help')(require('gulp'));
var stream;

// Concat & Minify JS
gulp.task('minify-js','Minifies all javascript', function(){
	return gulp.src([files.vendor, files.scripts])
		.pipe(concat('all-'+ pkg.version + '.min.js'))
		.pipe(gulp.dest(files.publicScripts))
		.pipe(gulpif(argv.production, uglify()))
		.pipe(gulp.dest(files.publicScripts))
		.pipe(size());
});

// SASS to CSS
gulp.task('css','Compliles sass to css', function () {
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
gulp.task('minify-img','Minifies images', function () {
	gulp.src(files.images)
		.pipe(imagemin())
		.pipe(gulp.dest(files.publicImage));
});

// Build HTML files
gulp.task('build-html', 'Dynamically injects javascript and css files', function() {
	gulp.src(files.index)
		.pipe(inject(gulp.src(['./public/javascript/*.js','./public/css/*.css'], { read: false }), { ignorePath: 'public/' }))
		.pipe(gulp.dest(files.publicDir))
		.pipe(size());
});

// Lint JS
gulp.task("lint", 'Lints javascript', function() {
	gulp.src([files.scripts, '!'+ files.vendor])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

//Test
gulp.task('test', 'Runs unit tests', function() {
	return gulp.src(files.test.concat(files.templates))
		.pipe(karma({
			configFile: 'config/karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});

//End to end tests
gulp.task('e2e','Runs end to end tests', ['build'], function(cb) {
	stream = gulp.src('public')
		.pipe(webserver({
			livereload: false,
			directoryListing: false,
			open: false
	}));
	gulp.src(['test/e2e/**.spec.js'])
		.pipe(protractor(
		{
			configFile: 'config/protractor.conf.js',
			args: ['--baseUrl', 'http://localhost:8000']
		}
	)).on('error', function(e) {
		console.log(e);
		stream.emit('kill');
		process.exit();
	})
	.once('end', function () {
		stream.emit('kill');
		process.exit();
	});      
});

gulp.task('test-watch','Unit tests with watch', function() {
	return gulp.src(files.test.concat(files.templates))
		.pipe(karma({
			configFile: 'config/karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('watch', 'Watches and builds for changes', ['build'], function() {
	gulp.watch(files.source + '/**', ['lint']);
	gulp.watch([files.index], ['build-html']);
	gulp.watch([files.scripts], ['minify-js']);
	gulp.watch([files.sass], ['css']);
	gulp.watch([files.css], ['css']);
});

//Launched web server and watches for changes
gulp.task('webserver', 'Launches web server',['watch'], function(next) {
	gulp.src('public')
	.pipe(webserver({
		livereload: false,
		directoryListing: false,
		open: true
	}));
});

//Move bower_components to public
gulp.task('bower_components', 'Copies bower_components to public', function(){
	gulp.src(files.libs, { base: './' })
		.pipe(gulp.dest(files.publicDir));
});

//Move views to public folder
gulp.task('views', 'Copies views to public', function(){
	return gulp.src(files.views)
		.pipe(gulp.dest('public/views'));
});

//Move templates to public folder
gulp.task('templates', 'Copies templates to public', function(){
	return gulp.src(files.templates)
		.pipe(gulp.dest('public/templates'));
});

//Build
gulp.task('build', 'Builds projects for distribution', function(callback) {
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
gulp.task('clean', 'Deletes existing public directory', function () {
	return gulp.src(files.publicDir, {read: false})
		.pipe(clean());
});

// Default
gulp.task('default', 'Builds project',['build']);
