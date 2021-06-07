// jshint node:true
'use strict';

const gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    $ = require('gulp-load-plugins')();

const paths = {
    langs: ['src/langs/**.js', '!src/langs/en.js'],
    icons: ['src/ui/icons/**.svg', 'plugins/*/ui/icons/**.svg'],
    scripts: ['src/trumbowyg.js'],
    styles: ['src/ui/sass/trumbowyg.scss'],
    pluginsScripts: ['plugins/*/**.js'],
    pluginsStyles: ['plugins/*/ui/sass/**.scss']
};

const pkg = require('./package.json');
const banner = [
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
const bannerLight = [
    '/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' - <%= pkg.homepage.replace("http://", "") %>',
    ' - License <%= pkg.license %>',
    ' - Author : <%= pkg.author.name %>',
    ' / <%= pkg.author.url.replace("http://", "") %>',
    ' */',
    '\n'
].join('');


const clean = function () {
    return gulp.src('dist/*')
        .pipe(vinylPaths(del));
};

const testScripts = function () {
    return gulp.src(paths.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
};
const testPluginsScripts = function () {
    return gulp.src(paths.pluginsScripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
};
const testLangs = function () {
    return gulp.src(paths.langs)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
};
const test = gulp.parallel(testScripts, testPluginsScripts, testLangs);

const scripts = gulp.series(testScripts, function scripts() {
    return gulp.src(paths.scripts)
        .pipe($.header(banner, {pkg: pkg, description: 'Trumbowyg core file'}))
        .pipe($.newer('dist/trumbowyg.js'))
        .pipe($.concat('trumbowyg.js', {newLine: '\r\n\r\n'}))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'trumbowyg.js'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.terser())
        .pipe($.header(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'trumbowyg.min.js'}));
});

const pluginsScripts = gulp.series(testPluginsScripts, function pluginsScripts() {
    return gulp.src(paths.pluginsScripts)
        .pipe(gulp.dest('dist/plugins/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.terser())
        .pipe(gulp.dest('dist/plugins/'));
});

const langs = gulp.series(testLangs, function langs() {
    return gulp.src(paths.langs)
        .pipe(gulp.dest('dist/langs/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.terser({
            format: {
                comments: 'all'
            }
        }))
        .pipe(gulp.dest('dist/langs/'));
});


const icons = function () {
    return gulp.src(paths.icons)
        .pipe($.rename({prefix: 'trumbowyg-'}))
        .pipe($.svgmin())
        .pipe($.svgstore({inlineSvg: true}))
        .pipe(gulp.dest('dist/ui/'));
};


const styles = function () {
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
};

const sassDist = gulp.series(styles, function sassDist() {
    return gulp.src(paths.styles)
        .pipe($.header(banner, {pkg: pkg, description: 'Default stylesheet for Trumbowyg editor'}))
        .pipe(gulp.dest('dist/ui/sass'));
});

const pluginsStyles = function () {
    return gulp.src(paths.pluginsStyles)
        .pipe($.sass())
        .pipe($.autoprefixer(['last 1 version', '> 1%', 'ff >= 20', 'ie >= 9', 'opera >= 12', 'Android >= 2.2'], {cascade: true}))
        .pipe($.header(banner, {pkg: pkg, description: 'Trumbowyg plugin stylesheet'}))
        .pipe($.rename(function (path) {
            path.dirname += '/..';
        }))
        .pipe(gulp.dest('dist/plugins/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe($.header(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/plugins/'))
        .pipe($.size({title: 'Plugins styles'}));
};

const pluginsSassDist = gulp.series(pluginsStyles, function pluginsSassDist() {
    return gulp.src(paths.pluginsStyles)
        .pipe($.header(banner, {pkg: pkg, description: 'Default stylesheet for Trumbowyg editor plugin'}))
        .pipe(gulp.dest('dist/plugins'));
});


const watch = function () {
    gulp.watch(paths.icons, icons);
    gulp.watch(paths.scripts, scripts);
    gulp.watch(paths.langs, langs);
    gulp.watch(paths.pluginsScripts, pluginsScripts);
    gulp.watch(paths.pluginsStyles, pluginsStyles);
    gulp.watch(paths.styles, styles);

    gulp.watch(['dist/**', 'dist/*/**'], function (file) {
        $.livereload.changed(file);
    });

    $.livereload.listen();
};

const build = gulp.series(clean, gulp.parallel(scripts, pluginsScripts, langs, icons, sassDist, pluginsSassDist));

module.exports = {
    default: gulp.series(build, watch),
    clean,
    build,
    test,
    watch,
};
