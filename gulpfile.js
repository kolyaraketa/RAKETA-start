const gulp = require('gulp');
const babel = require('gulp-babel');
const _ = require('lodash');
const browserSync = require('browser-sync');
const nunjucks = require('gulp-nunjucks');
const runSequence = require('gulp-run-sequence');
const cache = require('gulp-cache');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const chokidar = require('chokidar');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const tinypng = require('gulp-tinypng-unlimited');
const uglify = require('gulp-uglify');
const cachebust = require('gulp-cache-bust');
const watch = require('gulp-watch');
const path = require('path');
const sass = require('gulp-sass');
const run = require('gulp-run-command');

gulp.task('html', function () {
	return gulp.src(['./src/[^_]*.html', './src/*/[^_]*.html'])
		.pipe(nunjucks.compile({
			build: 'dev'
		}))
		.pipe(gulp.dest('./src/temp'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('htmlProd', function () {
	return gulp.src(['./src/[^_]*.html', './src/*/[^_]*.html', '!./src/temp/**'])
		.pipe(nunjucks.compile({
			build: 'prod'
		}))
		.pipe(cachebust({
			type: 'timestamp'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/temp/css'))
		// .pipe(gulp.dest('./src/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('sassStream', function () {
	return gulp.src('./src/sass/**/*.sass')
		.pipe(watch('./src/sass/**/*.sass'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/temp/css'))
		// .pipe(gulp.dest('./src/css'))
		.pipe(browserSync.stream());
});

gulp.task('sassProd', function () {
	gulp.src('./src/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 15 versions']
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/css'))
	// .pipe(gulp.dest('./src/css'));
});

gulp.task('js', function () {
	gulp.src('./src/libs/**/*.js')
		.pipe(concat('./libs.js'))
		.pipe(gulp.dest('./src/temp/js'));
	return gulp.src(['./src/js/config-dev.js', './src/js/scripts.js'])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('./src/temp/js'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('jsLibs', function () {
	return gulp.src(['./src/libs/**/*.js'])
		.pipe(uglify())
		.pipe(concat('libs.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('jsBabel', function () {
	return gulp.src(['./src/js/config-prod.js', './src/js/scripts.js'])
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('buildJs', function () {
	return gulp.src(['./dist/js/libs.js', './dist/js/script.js'])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('./dist/js'))
})

gulp.task('cleanJs', function () {
	return del(['./dist/js/**/*.js', '!./dist/js/scripts.js']);
})

gulp.task('fonts', function () {
	return gulp.src('./src/fonts/**')
		.pipe(gulp.dest('./src/temp/fonts'));
});

gulp.task('fontsProd', function () {
	return gulp.src('./src/fonts/**')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('img', function () {
	gulp.src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/*.svg'])
		.pipe(gulp.dest('./src/temp/img'));
	chokidar.watch('./src/img/', {
		ignored: /(^|[\/\\])\../
	}).on('all', (event, path) => {
		if (event === 'add') {
			var newPath = './src/temp' + path.substring(3);
			newPath = ('./src/temp' + path.substring(3)).substring(0, newPath.lastIndexOf('/'));
			return gulp.src(path).pipe(gulp.dest(newPath));
		} else if (event === 'unlink') {
			del('./src/temp' + path.substring(3));
		} else if (event === 'change') {
			del('./src/temp' + path.substring(3));
			var newPath = './src/temp' + path.substring(3);
			newPath = newPath.substring(0, newPath.lastIndexOf('/'));
			return gulp.src(path).pipe(gulp.dest(newPath));
		}
	});
});

gulp.task('imgProd', function () {
	gulp.src('./src/img/**/*.@(png|jpg|jpeg)')
		.pipe(tinypng())
		.pipe(gulp.dest('./dist/img'));
	gulp.src('./src/img/favicon/favicon.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('./dist/img/favicon'));
	return gulp.src('./src/img/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('svg-sprite', function () {
	return gulp.src('./src/img/svg-sprite/*.svg')
		.pipe(svgmin())
		.pipe(svgSprite({
			mode: {
				inline: true,
				symbol: true
			}
		}))
		.pipe(gulp.dest('./src/img/svg-sprite/sprite'));
});

gulp.task('svg-auto-sprite', ['svg-sprite'], function () {
	var watcher = chokidar.watch('./src/img/svg-sprite/*.svg', {
		ignored: /(^|[\/\\])\../
	});
	watcher.on('all', _.debounce(function () {
		runSequence('svg-sprite', 'html');
	}, 1000));
});

gulp.task('copyOtherFiles', function () {
	return gulp.src('./src/*.@(php|mp4|webm|pdf)')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copyOtherFilesTemp', function () {
	return gulp.src('./src/**/*.@(php|mp4|webm|pdf)')
		.pipe(gulp.dest('./src/temp'));
});


gulp.task('default', function () {
	runSequence('copyOtherFilesTemp', 'img', 'js', 'fonts', 'svg-auto-sprite', 'sassStream', 'html');
	browserSync({
		server: {
			baseDir: './src/temp'
		},
		notify: false,
		ghostMode: false
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
	gulp.watch(['./src/*.html', './src/**/*.html'], ['html']);
	gulp.watch('./src/sass/**/_*.sass', ['sass']);
	gulp.watch(['./src/js/*.js', './src/libs/**/*.js'], ['js']);
	gulp.watch('./src/fonts/**/*', ['fonts']);
});

gulp.task('build', function () {
	runSequence(
		['imgProd', 'sassProd', 'fontsProd'], 
		'jsLibs',
		'jsBabel',
		'buildJs',
		'cleanJs',
		'htmlProd',
		'copyOtherFiles'
	);
});

gulp.task('clear', function () {
	return del.sync(['./dist', './src/temp']);
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});