// jshint node:true
'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

var paths = {
    mainStyle: 'ui/sass/trumbowyg.activecontrols.scss',
    styles: {
        sass: 'ui/sass',
        includePaths: ['ui/sass']
    }
};

var pkg = require('../../package.json');
var banner = ['/**',
    ' * <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' * <%= description %>',
    ' * ------------------------',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author.name %>',
    ' *         Twitter : @AlexandreDemode',
    ' *         Website : <%= pkg.author.url.replace("http://", "") %>',
    ' */',
    '\n'
].join('\n');
var bannerLight = ['/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' - <%= pkg.homepage.replace("http://", "") %>',
    ' - License <%= pkg.license %>',
    ' - Author : <%= pkg.author.name %>',
    ' / <%= pkg.author.url.replace("http://", "") %>',
    ' */',
    '\n'
].join('');

// jshint camelcase:true
gulp.task('styles', function () {
    return gulp.src(paths.mainStyle)
        .pipe($.sass({
            sass: paths.styles.sass,
            includePaths: paths.styles.includePaths
        }))
        .pipe($.header(banner, {
            pkg: pkg,
            description: 'Activecontrols plugin stylesheet for Trumbowyg editor'
        }))
        .pipe(gulp.dest('../../dist/plugins/activecontrols/ui/'))
        .pipe($.size({
            title: 'trumbowyg.activecontrols.css'
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.minifyCss())
        .pipe($.header(bannerLight, {
            pkg: pkg
        }))
        .pipe(gulp.dest('../../dist/plugins/activecontrols/ui/'))
        .pipe($.size({
            title: 'trumbowyg.activecontrols.min.css'
        }));
});


gulp.task('sass-dist', function () {
    return gulp.src('ui/sass/**/*.scss')
        .pipe($.header(banner, {
            pkg: pkg,
            description: 'Activecontrols plugin stylesheet for Trumbowyg editor'
        }))
        .pipe(gulp.dest('../../dist/plugins/activecontrols/ui/sass/'));
});


gulp.task('watch', function () {
    gulp.watch(paths.mainStyle, ['styles']);
});


gulp.task('build', ['styles', 'sass-dist']);

gulp.task('default', ['build', 'watch']);