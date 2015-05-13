var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'vinyl-*', 'vinyl.*', 'react*', 'merge*', 'del'],
  replaceString: /^(gulp|vinyl)(-|\.)/
});
var path = {
    nD: 'dist/nginx',
    nA: 'nginx/**/*.*',
  }
gulp.task('move', function () {
  return gulp.src(path.nA)
    .pipe($.watch(path.nA))
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('clean', function (cb) {
  $.del([
    path.bD+'/**/*',
    path.nD+'/**/*',
    '!'+path.nD+'/temp/**',
  ], cb)
})

gulp.task('livereload', function () {
  $.livereload.listen()
})

//gulp.task('init', ['livereload', 'react', 'backend', 'css', 'styl', 'conf', 'html', 'media', 'scripts'])
//gulp.task('default', ['init', 'watch', 'koa.js'])
