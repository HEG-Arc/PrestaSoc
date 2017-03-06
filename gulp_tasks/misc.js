const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const request = require('request-json');

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

const regex = /(?:\$ctrl\.)?(?:sim.(.*?)|(personne\..*?))[}") ]|var="(.*?)"/g;

function extractVars(file, vars, seen) {
  gutil.log(gutil.colors.cyan(file.path));
  let m;
  const foundVars = [];
  while ((m = regex.exec(file.contents)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    if (m[1]) {
      // transform personnes[*] to personne
      const p = m[1].replace(/s\[.*?\]\./, '.');
      foundVars.push(p);
    }
    if (m[2]) {
      foundVars.push(m[2]);
    }
    if (m[3]) {
      foundVars.push(m[3]);
    }
  }
  let previous = '';
  foundVars.sort().forEach(v => {
    if (v !== previous) {
      if (vars.hasOwnProperty(v)) {
        gutil.log(gutil.colors.green(v));
      } else {
        gutil.log(gutil.colors.red(v));
      }
      seen[v] = true;
      previous = v;
    }
  });
}

function simvars() {
  const seen = {};
  let vars;
  return gulp.src([path.join(conf.paths.src, '/**/*.html')])
    .pipe(through.obj((file, encoding, callback) => {
      if (vars) {
        callback(null, extractVars(file, vars, seen));
      } else {
        const client = request.createClient('https://script.google.com');
        return client.get('macros/s/AKfycbxxtYoEsXArEobqe3Egs5-kWHawM45IggQYLczhUbcELDYg7Ag/exec',
        (err, res, v) => {
          vars = v;
          callback(null, extractVars(file, vars, seen));
        });
      }
    })).on('end', () => {
      gutil.log(gutil.colors.cyan('Unused variables:'));
      for (const v in vars) {
        if (!seen.hasOwnProperty(v)) {
          gutil.log(gutil.colors.yellow(v));
        }
      }
    });
}

gulp.task('simvars', simvars);
