
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const pug = require('gulp-pug');

const sass = require('gulp-sass');

const spritesmith = require('gulp.spritesmith');    // возможно здесь gulp.spritesmith

const rimraf = require('rimraf');

const rename = require('gulp-rename');

// Server

// описываем задачу для сервера
gulp.task('server' , function (params) {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: 'build',
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);  // при изменении в папке build файлов, 
    //сервер будет перезагружаться

});

// pug compile
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
    .pipe(pug({
        pretty: true,
    }))
    
    .pipe(gulp.dest('build'))
});

// sass compiler

gulp.task('style:compile', function () {
    return gulp.src('source/style/main.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));   
  });   // уже в файле build/index.html - сами выставляем link_css


  gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('source/images/icons/*png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('/build/images'));
    spriteData.css.pipe(gulp.dest('source/style/global'));

    cb();
  });

  gulp.task('clean', function del(cb) {
      return rimraf('build', cb);
  })

  // Copy images

  gulp.task('copy:images', function () {
      return gulp.src('./source/images/**/*.*')
      .pipe(gulp.dest('/build/images'));
  })

  // copy font
  gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('/build/fonts'));
})

// copy
gulp.task('copy', gulp.parallel('copy:fonts' , 'copy:images'));

// whatchers

gulp.task('watch', function () {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/style/**/*.scss', gulp.series('style:compile'));
})

// default run

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'style:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));