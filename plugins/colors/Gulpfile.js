var gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    $ = require('gulp-load-plugins')(),
    spritesmith = require('gulp.spritesmith');

var paths = {
    sprites: {
        'icons-white': 'ui/images/icons-white/**.png',
        'icons-white-2x': 'ui/images/icons-white-2x/**.png',
        'icons-black': 'ui/images/icons-black/**.png',
        'icons-black-2x': 'ui/images/icons-black-2x/**.png'
    },
    mainStyle: 'ui/sass/trumbowyg.colors.scss',
    styles: {
        sass: 'ui/sass',
        includePaths: ['ui/sass', '../../src/ui/sass/mixins']
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
    '\n'].join('\n');
var bannerLight = ['/** <%= pkg.title %> v<%= pkg.version %> - <%= pkg.description %>',
    ' - <%= pkg.homepage.replace("http://", "") %>',
    ' - License <%= pkg.license %>',
    ' - Author : <%= pkg.author.name %>',
    ' / <%= pkg.author.url.replace("http://", "") %>',
    ' */',
    '\n'].join('');


gulp.task('clean', function(){
    return gulp.src(['ui/sass/_sprite*.scss'])
        .pipe(vinylPaths(del));
});


gulp.task('sprites', function(){
    return makeSprite('white') && makeSprite('white', '-2x') && makeSprite('black') && makeSprite('black', '-2x');
});
function makeSprite(color, resolution){
    var suffix =  '-' + color + ((resolution) ? resolution : '');
    var sprite = gulp.src(paths.sprites['icons' + suffix])
        .pipe(spritesmith({
            imgName: 'icons' + suffix + '.png',
            cssName: '_sprite' + suffix + '.scss',
            cssTemplate: function(params){
                var output = '', e;
                for(var i in params.items){
                    e = params.items[i];
                    output += '$' + e.name + suffix + ': ' + e.px.offset_x + ' ' + e.px.offset_y + ';\n';
                }
                if(params.items.length > 0){
                    output += '\n\n';
                    output += '$sprite-height' + suffix + ': ' + params.items[0].px.total_height + ';\n';
                    output += '$sprite-width' + suffix + ': ' + params.items[0].px.total_width + ';\n';
                    output += '$icons' + suffix + ': "./images/icons' + suffix + '.png";';
                }

                return output;
            }
        }));
    sprite.img.pipe(gulp.dest('../../dist/plugins/colors/ui/images/'));
    sprite.css.pipe(gulp.dest(paths.styles.sass));
    return sprite.css;
}



gulp.task("styles", function(){
  return gulp.src(paths.mainStyle)
    .pipe($.sass({
      sass: paths.styles.sass,
      includePaths: paths.styles.includePaths
    }))
    .pipe($.autoprefixer(["last 1 version", "> 1%", "ff >= 20", "ie >= 8", "opera >= 12", "Android >= 2.2"], { cascade: true }))
    .pipe($.header(banner, { pkg: pkg, description: "Colors plugin stylesheet for Trumbowyg editor" }))
    .pipe(gulp.dest("../../dist/plugins/colors/ui/"))
    .pipe($.size({ title: "trumbowyg.colors.css" }))
    .pipe($.rename({ suffix: ".min" })) // génère une version minimifié
    .pipe($.minifyCss())
    .pipe($.header(bannerLight, { pkg: pkg }))
    .pipe(gulp.dest("../../dist/plugins/colors/ui/"))
    .pipe($.size({ title: "trumbowyg.colors.min.css" }));
});



gulp.task('sass-dist', function(){
    return gulp.src('ui/sass/**/*.scss')
        .pipe($.header(banner, { pkg: pkg, description: 'Colors plugin stylesheet for Trumbowyg editor' }))
        .pipe(gulp.dest('../../dist/plugins/colors/ui/sass/'))
});



gulp.task('watch', function(){
    gulp.watch(paths.mainStyle, ['sprites', 'styles']);
});



gulp.task('build', ['sprites', 'styles', 'sass-dist']);

gulp.task('default', ['build', 'watch']);