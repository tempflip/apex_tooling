var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	ts = require('gulp-typescript');

gulp.task('start', function () {
	nodemon({
		script: './app.js'
	});
});

gulp.task('ts', function () {
	return gulp.src('src/*.ts')
		.pipe(ts({
			//out: 'output.js'
		}))
		.pipe(gulp.dest('./classes/'));
});

gulp.task('dev', function() {
	gulp.run('ts');
	gulp.run('start');

	gulp.watch('src/*.ts', function (event) {
		gulp.run('ts');
	});
});