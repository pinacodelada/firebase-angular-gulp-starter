var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var ngmin = require('gulp-ngmin');
var rimraf = require('rimraf');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var argv = require('yargs').argv;

gulp.task('default', ['watch'], function() {
	// place code for your default task here
});


gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});


gulp.task('scripts', function() {
	return gulp.src(['app/js/*.js', './app/js/**/*.js'])
		.pipe(jshint.reporter('default'))
		.pipe(concat('app.js'))
		.pipe(ngmin())
		.pipe(gulp.dest('build/js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(gulp.dest('build/js'))
		.pipe(livereload());
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
		.pipe(livereload());
});


gulp.task('partials', function() {
	return gulp.src(['app/partials/*'])
		.pipe(gulp.dest('./build/partials'))
		.pipe(livereload());
});

gulp.task('images', function() {
	return gulp.src(['app/img/*'])
		.pipe(gulp.dest('./build/img'))
		.pipe(livereload());
});



gulp.task('build', function() {

	runSequence(['clean'], 'scripts', 'styles', 'partials', 'images', function() {

		gulp.src('./app/index.html')
			.pipe(htmlreplace(argv.env == 'prod' || true ? {
				'css': 'css/app.min.css',
				'js': 'js/app.min.js'
			} : {
				'css': 'css/app.css',
				'js': 'js/app.js'
			}))
			.pipe(gulp.dest('build/'));
	});
});


gulp.task('watch', ['build'], function() {
	gulp.watch('app/index.html', ['build']).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch('app/less/**/*.less', ['styles']).on('change', function(event) {
		//livereload.changed(event.path);
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
