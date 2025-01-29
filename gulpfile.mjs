// jshint node:true
'use strict';

import fs from 'fs';

import gulp from 'gulp';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpConcat from 'gulp-concat';
import gulpHeader from 'gulp-header';
import gulpJsHint from 'gulp-jshint';
import gulpLivereload from 'gulp-livereload';
import gulpCleanCss from 'gulp-clean-css';
import gulpNewer from 'gulp-newer';
import gulpRename from 'gulp-rename';
import gulpSassPlugin from 'gulp-sass';
import gulpSize from 'gulp-size';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpSvgMin from 'gulp-svgmin';
import gulpSvgStore from 'gulp-svgstore';
import gulpTerser from 'gulp-terser';
import {deleteAsync} from 'del';
import * as sass from 'sass';

const gulpSass = () => gulpSassPlugin(sass)();

const paths = {
    langs: ['src/langs/**.js', '!src/langs/en.js'],
    icons: ['src/ui/icons/**.svg', 'plugins/*/ui/icons/**.svg'],
    scripts: ['src/trumbowyg.js'],
    styles: ['src/ui/sass/trumbowyg.scss'],
    pluginsScripts: ['plugins/*/**.js'],
    pluginsStyles: ['plugins/*/ui/sass/**.scss']
};

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const banner = [
    '/**',
    ' * <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' * <%= description %>',
    ' * ------------------------',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author.name %>',
    ' *         Twitter : @AlexandreDemode',
    ' *         Website : <%= pkg.author.url.replace("https://", "") %>',
    ' */',
    '\n'
].join('\n');
const bannerLight = [
    '/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' - <%= pkg.homepage.replace("https://", "") %>',
    ' - License <%= pkg.license %>',
    ' - Author : <%= pkg.author.name %>',
    ' / <%= pkg.author.url.replace("https://", "") %>',
    ' */',
    '\n'
].join('');


const clean = function () {
    return deleteAsync(['dist/*']);
};

const lint = function () {
    return gulp.src([
        ...paths.scripts,
        ...paths.pluginsScripts,
        ...paths.langs,
    ])
        .pipe(gulpJsHint())
        .pipe(gulpJsHint.reporter('jshint-stylish', {}))
        .pipe(gulpJsHint.reporter('fail', {}));
};

const scripts = function scripts() {
    return gulp.src(paths.scripts)
        .pipe(gulpHeader(banner, {pkg: pkg, description: 'Trumbowyg core file'}))
        .pipe(gulpNewer('dist/trumbowyg.js'))
        .pipe(gulpConcat('trumbowyg.js', {newLine: '\r\n\r\n'}))
        .pipe(gulp.dest('dist/'))
        .pipe(gulpSize({title: 'trumbowyg.js'}))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpTerser({
            format: {
                comments: false
            }
        }))
        .pipe(gulpHeader(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/'))
        .pipe(gulpSize({title: 'trumbowyg.min.js'}));
};

const pluginsScripts = function pluginsScripts() {
    return gulp.src(paths.pluginsScripts)
        .pipe(gulp.dest('dist/plugins/'))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpTerser({
            format: {
                comments: /trumbowyg\./
            }
        }))
        .pipe(gulp.dest('dist/plugins/'));
};

const langs = function langs() {
    return gulp.src(paths.langs)
        .pipe(gulp.dest('dist/langs/'))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpTerser({
            format: {
                comments: 'all'
            }
        }))
        .pipe(gulp.dest('dist/langs/'));
};


const icons = function () {
    return gulp.src(paths.icons)
        .pipe(gulpRename({prefix: 'trumbowyg-'}))
        .pipe(gulpSvgMin())
        .pipe(gulpSvgStore({inlineSvg: true}))
        .pipe(gulp.dest('dist/ui/'));
};


const styles = function () {
    let stylesPipe = gulp.src(paths.styles)
        .pipe(gulpSass());

    if (process.env.ENV !== 'production') {
        stylesPipe = stylesPipe.pipe(gulpSourcemaps.init());
    }

    stylesPipe = stylesPipe
        .pipe(gulpAutoprefixer(['last 2 version', '> 1%'], {cascade: true}))
        .pipe(gulpHeader(banner, {pkg: pkg, description: 'Default stylesheet for Trumbowyg editor'}))
        .pipe(gulp.dest('dist/ui/'))
        .pipe(gulpSize({title: 'trumbowyg.css'}))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpCleanCss())
        .pipe(gulpHeader(bannerLight, {pkg: pkg}));

    if (process.env.ENV !== 'production') {
        stylesPipe = stylesPipe.pipe(gulpSourcemaps.write('.'));
    }

    stylesPipe = stylesPipe
        .pipe(gulp.dest('dist/ui/'))
        .pipe(gulpSize({title: 'trumbowyg.min.css'}));

    return stylesPipe;
};

const sassDist = gulp.series(styles, function sassDist() {
    return gulp.src(paths.styles)
        .pipe(gulpHeader(banner, {pkg: pkg, description: 'Default stylesheet for Trumbowyg editor'}))
        .pipe(gulp.dest('dist/ui/sass'));
});

const pluginsStyles = function () {
    return gulp.src(paths.pluginsStyles)
        .pipe(gulpSass())
        .pipe(gulpAutoprefixer(['last 2 version', '> 1%'], {cascade: true}))
        .pipe(gulpHeader(banner, {pkg: pkg, description: 'Trumbowyg plugin stylesheet'}))
        .pipe(gulpRename(function (path) {
            path.dirname += '/..';
        }))
        .pipe(gulp.dest('dist/plugins/'))
        .pipe(gulpRename({suffix: '.min'}))
        .pipe(gulpCleanCss())
        .pipe(gulpHeader(bannerLight, {pkg: pkg}))
        .pipe(gulp.dest('dist/plugins/'))
        .pipe(gulpSize({title: 'Plugins styles'}));
};

const pluginsSassDist = gulp.series(pluginsStyles, function pluginsSassDist() {
    return gulp.src(paths.pluginsStyles)
        .pipe(gulpHeader(banner, {pkg: pkg, description: 'Trumbowyg plugin stylesheet'}))
        .pipe(gulp.dest('dist/plugins'));
});


const watch = function () {
    gulp.watch([
        ...paths.scripts,
        ...paths.pluginsScripts,
        ...paths.langs,
    ], lint);
    gulp.watch(paths.icons, icons);
    gulp.watch(paths.scripts, scripts);
    gulp.watch(paths.langs, langs);
    gulp.watch(paths.pluginsScripts, pluginsScripts);
    gulp.watch(paths.pluginsStyles, pluginsStyles);
    gulp.watch(paths.styles, styles);

    gulp.watch(['dist/**', 'dist/*/**'], function (file) {
        gulpLivereload.changed(file);
    });

    gulpLivereload.listen();
};

const build = gulp.series(clean, gulp.parallel(
    scripts,
    pluginsScripts,
    langs,
    icons,
    sassDist,
    pluginsSassDist
));

const buildAndWatch = gulp.series(build, watch);

export default buildAndWatch;
export {
    clean,
    build,
    lint,
    watch
};
