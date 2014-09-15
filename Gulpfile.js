var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path');

var mainStyle = 'sass/main.scss';




gulp.task('clean', function(){
    return gulp.src('dist/*')
        .pipe($.clean());
});

gulp.task("styles", function(){
  return gulp.src(mainStyle)
    .pipe($.sass({
      sass: 'sass',
      includePaths: ['sass']
    }))
    .pipe($.autoprefixer(["last 1 version", "> 1%", "ff >= 20", "ie >= 8", "opera >= 12", "Android >= 2.2"], { cascade: true }))
    .pipe($.minifyCss())
    .pipe(gulp.dest("css/"))
});



gulp.task('watch', function(){
    gulp.watch(mainStyle, ['styles']);

    gulp.watch(['dist/**', 'dist/*/**'], function(file){
        $.livereload.changed(file);
    });

    $.livereload.listen();
});

gulp.task('build', ['styles']);

gulp.task('default', ['build', 'watch']);