var gulp = require('gulp');
var babel = require('gulp-babel');
var babelPath = 'app/src/**/*.js';
 
gulp.task('default', function () {
    return gulp.src(babelPath)
        .pipe(babel())
        .pipe(gulp.dest('app/dist'));
});

gulp.task('watch', function () {
	gulp.watch(babelPath, ['default']);
});
