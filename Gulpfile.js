var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    spritesmith = require('gulp.spritesmith'),
    mainBowerFiles = require('main-bower-files');

var paths = {
    scripts: ['src/trumbowyg.js'],
    sprites: {
        icons: 'src/design/images/icons/**',
        icons2x: 'src/design/images/icons-2x/**'
    },
    styles: {
        sass: 'src/design/sass',
        includePaths: ['src/design/sass']
    }
};




gulp.task('clean', function(){
    return gulp.src(['dist/*'])
        .pipe($.clean());
});

gulp.task('test', function(){
    return gulp.src(paths.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('script', ['test'], function(){

});