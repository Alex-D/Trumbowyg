// jshint node:true
'use strict';

var gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    $ = require('gulp-load-plugins')();

var paths = {
    langs: ['src/langs/**.js', '!src/langs/en.js'],
    icons: ['src/ui/icons/**.svg', 'plugins/*/ui/icons/**.svg'],
    scripts: ['src/trumbowyg.js'],
    styles: ['src/ui/sass/trumbowyg.scss'],
    pluginsScripts: ['plugins/*/**.js'],
    pluginsStyles: ['plugins/*/ui/sass/**.scss']
};

var pkg = require('./package.json');
var banner = [
    '/**',
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
var bannerLight = [
    '/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' - <%= pkg.homepage.replace("http://", "") %>',
    ' - License <%= pkg.license %>',
    ' - Author : <%= pkg.author.name %>',
    ' / <%= pkg.author.url.replace("http://", "") %>',
    ' */',
    '\n'
].join('');


gulp.task('clean', function () {
    return gulp.src('dist/*')
        .pipe(vinylPaths(del));
});


gulp.task('test', ['test-scripts', 'test-plugins-scripts', 'test-langs']);
gulp.task('test-scripts', function () {
    return gulp.src(paths.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});
gulp.task('test-plugins-scripts', function () {
    return gulp.src(paths.pluginsScripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});
gulp.task('test-langs', function () {
    return gulp.src(paths.langs)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});


gulp.task('scripts', ['test-scripts'], function () {
    return gulp.src(paths.scripts)
        .pipe($.header(banner, {pkg: pkg, description: 'Trumbowyg core file'}))
        .pipe($.newer('dist/trumbowyg.js'))
        .pipe($.concat('trumbowyg.js', {newLine: '\r\n\r\n'}))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'trumbowyg.js'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe($.header(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'trumbowyg.min.js'}));
});

gulp.task('plugins-scripts', ['test-scripts'], function () {
    return gulp.src(paths.pluginsScripts)
        .pipe(gulp.dest('dist/plugins/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/plugins/'));
});


gulp.task('langs', ['test-langs'], function () {
    return gulp.src(paths.langs)
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({
            preserveComments: 'all'
        }))
        .pipe(gulp.dest('dist/langs/'));
});


gulp.task('icons', function () {
    return gulp.src(paths.icons)
        .pipe($.rename({prefix: 'trumbowyg-'}))
        .pipe($.svgmin())
        .pipe($.svgstore({inlineSvg: true}))
        .pipe(gulp.dest('dist/ui/'));
});


gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe($.sass())
        .pipe($.autoprefixer(['last 1 version', '> 1%', 'ff >= 20', 'ie >= 9', 'opera >= 12', 'Android >= 2.2'], {cascade: true}))
        .pipe($.header(banner, {pkg: pkg, description: 'Default stylesheet for Trumbowyg editor'}))
        .pipe(gulp.dest('dist/ui/'))
        .pipe($.size({title: 'trumbowyg.css'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe($.header(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/ui/'))
        .pipe($.size({title: 'trumbowyg.min.css'}));
});

gulp.task('plugins-styles', function () {
    return gulp.src(paths.pluginsStyles)
        .pipe($.sass())
        .pipe($.autoprefixer(['last 1 version', '> 1%', 'ff >= 20', 'ie >= 9', 'opera >= 12', 'Android >= 2.2'], {cascade: true}))
        .pipe($.rename(function (path) {
            path.dirname += "/..";
        }))
        .pipe(gulp.dest('dist/plugins/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe(gulp.dest('dist/plugins/'));
});


gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.pluginsScripts, ['plugins-scripts']);
    gulp.watch(paths.langs, ['langs']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.pluginsStyles, ['plugins-styles']);
    gulp.watch(paths.icons, ['icons']);

    gulp.watch(['dist/**', 'dist/*/**'], function (file) {
        $.livereload.changed(file);
    });

    $.livereload.listen();
});


gulp.task('build', ['scripts', 'plugins-scripts', 'langs', 'icons', 'styles', 'plugins-styles']);

gulp.task('default', ['build', 'watch']);
