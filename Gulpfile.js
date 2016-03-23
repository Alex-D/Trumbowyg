'use strict';

var gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    $ = require('gulp-load-plugins')();

var mainStyle = 'scss/main.scss';




gulp.task('clean', function(){
    return gulp.src(['*.min.js'])
        .pipe(vinylPaths(del));
});

gulp.task('styles', function(){
  return gulp.src(mainStyle)
    .pipe($.sass({
      sass: 'sass',
      includePaths: ['sass']
    }))
    .pipe($.autoprefixer(['last 1 version', '> 1%', 'ff >= 20', 'ie >= 8', 'opera >= 12', 'Android >= 2.2'], { cascade: true }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('css/'))
});



gulp.task('watch', function(){
    gulp.watch(['scss/*.scss'], ['styles']);

    gulp.watch(['css/**', 'img/*', 'js/*'], function(file){
        $.livereload.changed(file);
    });

    $.livereload.listen();
});

gulp.task('build', ['styles']);

gulp.task('default', ['build', 'watch']);