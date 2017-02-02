const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);
gulp.task('other', other);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,js,html}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}

const gutil = require('gulp-util');
const through = require('through2');

const regex = /\$ctrl.sim.(.*?)[" ]/g;

function extractVars(file) {
  gutil.log(gutil.colors.green(file.path));
  let m;
  const foundVars = [];
  while ((m = regex.exec(file.contents)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    foundVars.push(m[1]);
  }
  let previous = '';
  foundVars.sort().forEach(v => {
    if (v !== previous) {
      gutil.log(v);
      previous = v;
    }
  });
}

function simvars() {
  return gulp.src([path.join(conf.paths.src, '/**/*.html')])
    .pipe(through.obj((file, encoding, callback) => {
      callback(null, extractVars(file));
    }));
}

gulp.task('simvars', simvars);
