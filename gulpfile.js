var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');//require('gulp-concat-sourcemap'); doesnt work
var ngAnnotate = require('gulp-ng-annotate');
var rimraf = require('rimraf');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var argv = require('yargs').argv;

gulp.task('default', ['connect', 'watch'], function() {
	// place code for your default task here
});


gulp.task('clean', function (cb) {
    return rimraf('./build', cb);
});

gulp.task('connect', function() {
    connect.server({
        root: __dirname+'/build/',
        livereload: true,
        https: true
    });
});

gulp.task('scripts', function() {
	return gulp.src(['app/js/*.js', './app/js/**/*.js'])
		.pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        //.pipe(uglify({mangle:false}))
        .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});

gulp.task('styles', function() {
	return gulp.src(['app/less/*.less', 'app/less/**/*.less'])
		.pipe(less())
		.pipe(gulp.dest('./build/css/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/css/'))
        .pipe(connect.reload());
});


gulp.task('partials', function() {
	return gulp.src(['app/partials/*'])
        .pipe(templateCache("templates.js", { module: "myApp"}))
        .pipe(gulp.dest('./build/js'))
        .pipe(connect.reload());
});

gulp.task('images', function() {
    return gulp.src(['app/img/*'])
        .pipe(gulp.dest('./build/img'))
        .pipe(connect.reload());
});

gulp.task('index', function() {
    gulp.src('./app/index.html')
        .pipe(htmlreplace(argv.env == 'prod' || true ? {
            'css': 'css/app.min.css',
            'js': 'js/app.min.js'
        } : {
            'css': 'css/app.css',
            'js': 'js/app.js'
        }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('build', function() {

	runSequence(['clean'], 'scripts', 'styles', 'partials', 'images', 'index', function() {


	});
});


gulp.task('watch', ['build'], function() {
	gulp.watch('app/index.html', ['index']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch('app/less/**/*.less', ['styles']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch('app/js/**/*.js', ['scripts']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch('app/partials/*', ['partials']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch('app/img/*', ['images']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});
