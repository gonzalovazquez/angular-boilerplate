/****************************
*******Public Directory******
****************************/

exports.publicDir = 'public';

exports.publicScripts = 'public/javascript';

exports.publicStyles = 'public/css';

exports.publicImage = 'public/images';

/****************************
*******Source Directory******
****************************/
exports.main = [
	'src/scripts/app.js',
	'src/scripts/**/*.js'
];

exports.index = 'src/index.html';

exports.source = 'src';

exports.scripts = 'src/scripts/**/*.js';

exports.vendor = 'src/scripts/vendor/*js';

exports.libs = [
	'bower_components/**'
];

exports.sass = [
	'src/styles/*.sass'
];

exports.css = [
	'src/styles/*.css'
];

exports.images = [
	'src/images/*.png'
];

exports.views = [
	'src/views/*.html'
];

exports.templates = [
	'src/templates/*.html'
];

/****************************
*******Test Directory******
****************************/

exports.libTest = [
	'bower_components/angularjs/angular.js',
	'bower_components/jquery/dist/jquery.js',
	'bower_components/angular-mocks/angular-mocks.js'
];

var testfiles = [
	'test/unit/**/*.spec.js'
];

exports.test = exports.libTest.concat(exports.libTest, exports.main, testfiles);