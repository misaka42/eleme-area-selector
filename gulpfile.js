var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require('gulp-rename');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('js', function (cb) {
  pump([
        gulp.src('src/index.js'),
        uglify(),
        rename('index.min.js'),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('style', function (cb) {
  pump([
        gulp.src('src/style.less'),
        less(),
        autoprefixer({
          browsers: ['last 3 versions']
        }),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('build', ['js', 'style']);

gulp.task('watch', function() {
  gulp.watch('src/style.less', ['style']);
})
