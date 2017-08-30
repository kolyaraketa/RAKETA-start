var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		rename         = require('gulp-rename'),
		runSequence    = require('run-sequence'),
		del            = require('del'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		fileinclude    = require('gulp-file-include'),
		gulpRemoveHtml = require('gulp-remove-html'),
		svgSprite      = require('gulp-svg-sprite'),
		inject         = require('gulp-inject'),
		path           = require('path'),
		replace        = require('gulp-replace-task'),
		fs             = require('fs'),
		svgmin         = require('gulp-svgmin'),
		csso           = require('gulp-csso'),
		notify         = require("gulp-notify");


// Скрипты проекта
gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/vanilla-text-mask/dist/vanillaTextMask.js',
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass().on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('headersass', function() {
	return gulp.src('app/header.sass')
		.pipe(sass().on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass-build', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass().on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(csso())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('headersass-build', function() {
	return gulp.src('app/header.sass')
		.pipe(sass().on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(csso())
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'headersass', 'js', 'browser-sync'], function() {
	gulp.watch('app/header.sass', ['headersass']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*/*.html', browserSync.reload);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('buildhtml', ['headersass-build'], function() {
	gulp.src(['app/*.html', 'app/*/*.html'])
		.pipe(gulpRemoveHtml({keyword: 'svgprite'}))
		.pipe(replace({
			patterns: [{
					match: 'sprite',
					replacement: fs.readFileSync('app/img/sprite/symbol/svg/sprite.symbol.svg', 'utf8')
				}]
			}))
    .pipe(fileinclude({
      prefix: '@@@'
    }))
    .pipe(gulpRemoveHtml())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['removedist', 'buildhtml', 'sass-build', 'js'], function() {

	var buildFiles = gulp.src([
		'app/.htaccess',
		'app/*.php'
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/*.css',
		'app/css/*/*.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

	var buildImg = gulp.src([
		'app/img/**/*',
		]).pipe(gulp.dest('dist/img'));

});
gulp.task('svg-build-sprite', function() {
	gulp.src('app/img/for-sprite/*.svg')
	.pipe(svgmin())
	.pipe(gulp.dest('app/img/for-sprite'));
	gulp.src('app/img/for-sprite/*.svg')
	.pipe(svgSprite({
		mode : {
			inline : true,
			symbol : true
		}
	}))
	.pipe(gulp.dest('app/img/sprite'));
});

gulp.task('svg-include-sprite', function() {
	gulp.src(['app/*.html', 'app/*/*.html'])
	.pipe(gulpRemoveHtml({keyword: 'svgprite'}))
	.pipe(replace({
		patterns: [
			{
				match: 'sprite',
				replacement: function(){
					var sprite = fs.readFileSync('app/img/sprite/symbol/svg/sprite.symbol.svg', 'utf8');
					return '@@sprite<!--<svgprite>-->' + sprite + '<!--</svgprite>-->';
				}
			}
		]
	}))
	.pipe(gulp.dest('app'));
});

gulp.task('svg-sprite', ['svg-build-sprite', 'svg-include-sprite']);

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
