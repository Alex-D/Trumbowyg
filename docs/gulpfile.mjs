// jshint node:true
'use strict';

import gulp from 'gulp';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpLivereload from 'gulp-livereload';
import gulpCleanCss from 'gulp-clean-css';
import gulpSassPlugin from 'gulp-sass';
import sass from 'sass';
import vinylPaths from 'vinyl-paths';
import {deleteSync} from 'del';

const gulpSass = () => gulpSassPlugin(sass)();

const mainStyle = 'scss/main.scss';


const clean = function () {
    return gulp.src('dist/*')
        .pipe(vinylPaths(deleteSync));
};


const styles = function () {
    return gulp.src(mainStyle)
        .pipe(gulpSass({
            sass: 'sass',
            includePaths: ['sass']
        }))
        .pipe(gulpAutoprefixer(['last 1 version', '> 1%', 'ff >= 20', 'ie >= 8', 'opera >= 12', 'Android >= 2.2'], {cascade: true}))
        .pipe(gulpCleanCss())
        .pipe(gulp.dest('css/'));
};


const watch = function () {
    gulp.watch(['scss/*.scss'], styles);

    gulp.watch(['css/**', 'img/*', 'js/*'], function (file) {
        gulpLivereload.changed(file);
    });

    gulpLivereload.listen();
};

const build = gulp.series(styles);

const buildAndWatch = gulp.series(build, watch);

export default buildAndWatch;
export {
    clean,
    build,
};
