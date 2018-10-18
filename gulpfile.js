var del = require('del'),
  gulp = require('gulp'),
  chmod = require('gulp-chmod'),
  concat = require('gulp-concat'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  size = require('gulp-size'),
  trim = require('gulp-trimlines'),
  uglify = require('gulp-uglify'),
  wrapUmd = require('gulp-wrap'),
  pkg = require('./package.json'),
  standard = require('gulp-standard'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps')

var headerLong = ['/*!',
  '* <%= pkg.name %> - <%= pkg.description %>',
  '* @version <%= pkg.version %>',
  '* <%= pkg.homepage %>',
  '*',
  '* @copyright <%= pkg.author %>',
  '* @license <%= pkg.license %>',
  '*',
  '* BUILT: <%= pkg.buildDate %>',
  '*/;',
  ''].join('\n')

var headerShort = '/*! <%= pkg.name %> v<%= pkg.version %> <%= pkg.license %>*/;'

// all files in the right order (currently we don't use any dependency management system)
var parts = [
  'src/svg.js',
  'src/regex.js',
  'src/utilities.js',
  'src/default.js',
  'src/queue.js',
  'src/drawLoop.js',
  'src/color.js',
  'src/array.js',
  'src/pointarray.js',
  'src/patharray.js',
  'src/number.js',
  'src/event.js',
  'src/HtmlNode.js',
  'src/element.js',
  'src/matrix.js',
  'src/point.js',
  'src/attr.js',
  'src/transform.js',
  'src/css.js',
  'src/parent.js',
  'src/flatten.js',
  'src/container.js',
  'src/defs.js',
  'src/group.js',
  'src/arrange.js',
  'src/mask.js',
  'src/clip.js',
  'src/gradient.js',
  'src/pattern.js',
  'src/doc.js',
  'src/shape.js',
  'src/bare.js',
  'src/symbol.js',
  'src/use.js',
  'src/rect.js',
  'src/ellipse.js',
  'src/line.js',
  'src/poly.js',
  'src/pointed.js',
  'src/path.js',
  'src/image.js',
  'src/text.js',
  'src/textpath.js',
  'src/hyperlink.js',
  'src/marker.js',
  'src/sugar.js',
  'src/set.js',
  'src/data.js',
  'src/memory.js',
  'src/selector.js',
  'src/helpers.js',
  'src/polyfill.js',
  'src/boxes.js',
  'src/parser.js',
  'src/animator.js',
  'src/morph.js',
  'src/runner.js',
  'src/timeline.js',
  'src/controller.js'
]

gulp.task('clean', function () {
  return del([ 'dist/*' ])
})

gulp.task('lint', function () {
  return gulp.src(parts)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      showRuleNames: true,
      breakOnError: process.argv[2] !== "--dont-break",
      quiet: true,
    }))
})

/**
 * Compile everything in /src to one unified file in the order defined in the MODULES constant
 * wrap the whole thing in a UMD wrapper (@see https://github.com/umdjs/umd)
 * add the license information to the header plus the build time stamp‏
 */
gulp.task('unify', ['clean', 'lint'], function () {
  pkg.buildDate = Date()
  return gulp.src(parts)
    .pipe(sourcemaps.init())
    .pipe(concat('svg.js', { newLine: '\n' }))
    .pipe(babel({presets: ['@babel/env']}))
    // wrap the whole thing in an immediate function call
    .pipe(wrapUmd({src: 'src/umd.js'}))
    .pipe(header(headerLong, { pkg: pkg }))
    .pipe(trim({ leading: false }))
    .pipe(chmod(0o644))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(size({ showFiles: true, title: 'Full' }))
})

/**
 ‎* uglify the file and show the size of the result
 * add the license info
 * show the gzipped file size
 */
gulp.task('minify', ['unify'], function () {
  return gulp.src('dist/svg.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size({ showFiles: true, title: 'Minified' }))
    .pipe(header(headerShort, { pkg: pkg }))
    .pipe(chmod(0o644))
    .pipe(gulp.dest('dist'))
    .pipe(size({ showFiles: true, gzip: true, title: 'Gzipped' }))
})

gulp.task('default', ['clean', 'unify', 'minify'])
