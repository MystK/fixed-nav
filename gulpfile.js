var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'vinyl-*', 'vinyl.*', 'react*', 'merge*', 'del'],
  replaceString: /^(gulp|vinyl)(-|\.)/
});
var path = {
//    rD: './dist/nginx/assets/www/react/scripts/',
    nD: 'dist/nginx',
    bD: 'dist/koa.js',
//    rA: './nginx/assets/www/react/scripts/',
    nA: 'nginx/**/*.*',
    bA: 'koa.js/**/*.*',
  }
var all = [path.bA, path.nA];
/*var browserify = require('browserify')
var watchify = require('watchify')
var b = browserify(watchify.args);
var w = watchify(browserify({
          cache: {},
          packageCache: {},
          entries: path.rA + 'app.jsx',
          debug: true,
          transform: [$.reactify]
        }),{
//          poll: true,
          delay: 0
        }); 
        
w.on('update', function() {
  gulp.start('react')
})*/
gulp.task('move', function () {
  var bA = gulp.src(path.bA)
    .pipe($.watch(path.bA))
    .pipe($.debug())
    .pipe(gulp.dest(path.bD))
    .pipe($.livereload())
    
  var nA = gulp.src(path.nA)
    .pipe($.watch(path.nA))
    .pipe($.debug())
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
    
  return $.mergeStream(bA, nA)
})

gulp.task('clean', function (cb) {
  $.del([
    path.bD+'/**/*',
    path.nD+'/**/*',
    '!'+path.nD+'/temp/**',
  ], cb)
})

//NEW HERE

gulp.task('koa.js', function () {
  $.supervisor('./dist/koa.js/server.js', {
    ext: ['js html'],
    watch: ['dist/koa.js'],
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('react', function() {
  return w.bundle()
  .on('error', function(err) {
    console.log(err)
    this.emit('end');  
  })
  .pipe($.sourceStream('app.js'))
  .pipe($.buffer())
  .pipe($.sourcemaps.init({loadMaps: true}))
//      .pipe($.uglify())
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(path.rD))
  .pipe($.livereload())
})

gulp.task('backend', function () {
  return gulp.src(path.bA + '*')
    .pipe($.changed(path.bD))
    .pipe(gulp.dest(path.bD))
    .pipe($.livereload())
})

gulp.task('styl', function () {
  return gulp.src(path.nA + '*.styl')
    .pipe($.changed(path.nD))
    .pipe($.stylus())
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('css', function () {
  return gulp.src(path.nA + '*.css')
    .pipe($.changed(path.nD))
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('conf', function () {
  return gulp.src(path.nA + 'conf/**/*')
    .pipe($.changed(path.nD))
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('html', function () {
  return gulp.src(path.nA + '*.html')
    .pipe($.changed(path.nD))
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('media', function () {
var pngquant = require('imagemin-pngquant');
  return gulp.src(path.nA + 'media/*')
    .pipe($.changed(path.nD))
    .pipe($.imagemin({
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('scripts', function () {
  return gulp.src([path.nA + '/*.js'])
    .pipe($.changed(path.nD))
    .pipe(gulp.dest(path.nD))
    .pipe($.ignore.exclude('**/*min.js'))
    .pipe($.sourcemaps.init())
      .pipe($.uglify())
        .on('error', console.log)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.nD))
    .pipe($.livereload())
})

gulp.task('Owatch', function () {
  gulp.watch(path.bA + '*', ['backend'])
  gulp.watch(path.nA + '*.styl', ['styl'])
  gulp.watch(path.nA + '*.css', ['css'])
  gulp.watch(path.nA + '*.html', ['html'])
  gulp.watch(path.nA + 'conf/**/*', ['conf'])
  gulp.watch(path.nA + 'media/*', ['media'])
  gulp.watch(path.nA + '/*.js', ['scripts'])
})

gulp.task('livereload', function () {
  $.livereload.listen()
})

//gulp.task('init', ['livereload', 'react', 'backend', 'css', 'styl', 'conf', 'html', 'media', 'scripts'])
//gulp.task('default', ['init', 'watch', 'koa.js'])
