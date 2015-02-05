angular-boilerplate
===

An boilerplate for AngularJS projects.

## Install node

[Node](http://nodejs.org/)

## After installing node, install Gulp globally

	npm install gulp -g

## Install all the dependencies

	npm install

## Download the libraries needed.

	bower install

## `gulpfile.js`

This file is just a quick sample to give you a taste of what Nyan can do.

```javascript

// Concat & Minify JS
gulp.task('minify-js', function(){
	return gulp.src(paths.scripts.src)
		.pipe(concat('all-'+ pkg.version + '.min.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest));
});

// SASS to CSS
gulp.task('sass', function () {
	return gulp.src(paths.styles.src)
	.pipe(sass({
			onError: function (error) {
			gutil.log(gutil.colors.red(error));
			gutil.beep();
		},
		onSuccess: function () {
			gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
		}
	}))
	.pipe(concat('main-' + pkg.version + '.min.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest(paths.styles.dest))
});

// Minify Images
gulp.task('minify-img', function () {
	gulp.src(paths.images.src)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dest));
});

// Build HTML files
gulp.task('build-html', function() {
	gulp.src([paths.scripts.dest + '/*.js', paths.styles.dest + '/*.css'], {read: false})
		.pipe(inject(paths.public.index, {ignorePath: paths.public.dest}))
		.pipe(gulp.dest(paths.public.dest))
});

// Lint JS
gulp.task("lint", function() {
	gulp.src([paths.scripts.src, '!'+ paths.scripts.vendor])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

// Test
gulp.task('test-watch', function() {
	return gulp.src(paths.test.src)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}))
		.on('error', function(err) {
			throw err;
		});
});

// Watches changes
gulp.task('watch', function() {
	gulp.watch(files.source + '/**', ['lint']);
	gulp.watch([files.index], ['build-html']);
	gulp.watch([files.scripts], ['minify-js']);
	gulp.watch([files.sass], ['css']);
	gulp.watch([files.css], ['css']);
});

// Builds
gulp.task('build', function(callback) {
	sequence(
		'clean',
		['minify-js','sass'],
		'build-html',
		callback);
});

//Launch Server
gulp.task('webserver', ['build', 'watch'], function(next) {
	gulp.src('public')
	.pipe(webserver({
		livereload: true,
		directoryListing: false,
		open: true
	}));
});

// Clean build folder
gulp.task('clean', function () {
	return gulp.src(paths.public.dest, {read: false})
		.pipe(clean());
});

```

###Folder structure

```
src/
├── images/
│ 
├── scripts/
│   ├── app.js
│   └── vendor/
│       └─google-analytics.js
├── styles/
│   └── main.scss
│
├── index.html
│
└── test/
    └── unit/
        └── app.spec.js

```

After running ``` gulp build ``` public folder is created and Nyan injects
all the scripts and styles into the new index.html

```
public/
├── images/
│
├── bower_components/
│ 
├── views/
│ 
├── templates/
│ 
├── javascript/
│   └── all.[version-number].min.js
│ 
├── css/
│   └── main.[version-number].min.css
│
└── index.html
```