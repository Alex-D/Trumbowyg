var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    spritesmith = require('gulp.spritesmith'),
    mainBowerFiles = require('main-bower-files');

var paths = {
    scripts: ['src/trumbowyg.js'],
    plugins: ['plugins/**.js'],
    sprites: {
        icons: 'src/design/images/icons/**',
        icons2x: 'src/design/images/icons-2x/**'
    },
    styles: {
        sass: 'src/design/sass',
        includePaths: ['src/design/sass']
    }
};

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.title %> v<%= pkg.version %>',
  ' * <%= pkg.description %>',
  ' * <%= pkg.homepage %>',
  ' * ------------------------',
  ' * @license <%= pkg.license %>',
  ' * @author <%= pkg.author.name %>',
  ' *         Twitter : @AlexandreDemode',
  ' *         Website : <%= pkg.author.url.replace("http://", "") %>',
  ' */',
  '\n'].join('\n');
var bannerLight = ['/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
  ' - <%= pkg.homepage %>',
  ' - License <%= pkg.license %>',
  ' - Author : <%= pkg.author.name %>',
  ' / @AlexandreDemode',
  ' / <%= pkg.author.url.replace("http://", "") %>',
  ' */',
  '\n'].join('');




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
    return gulp.src(paths.scripts)
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.newer('dist/trumbowyg.js'))
        .pipe($.concat('trumbowyg.js', { newLine: '\r\n\r\n' }))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({ title: "trumbowyg.js" }))
        .pipe($.rename({ suffix: ".min" }))
        .pipe($.uglify())
        .pipe($.header(bannerLight, { pkg: pkg }))
        .pipe(gulp.dest('dist/'))
        .pipe($.size({ title: "trumbowyg.min.js" }))
});

gulp.task('default', ['clean', 'script']);