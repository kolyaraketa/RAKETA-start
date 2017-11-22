var gulp           = require('gulp'),
		_              = require('lodash'),
		browserSync    = require('browser-sync'),
		nunjucks       = require('gulp-nunjucks'),
		rename         = require('gulp-rename'),
		include        = require('gulp-file-include'),
		runSequence    = require('gulp-run-sequence'),
		cache          = require('gulp-cache'),
		del            = require('del'),
		svgSprite      = require('gulp-svg-sprite'),
		svgmin         = require('gulp-svgmin'),
		chokidar       = require('chokidar'),
		uglify         = require('gulp-uglify'),
		concat         = require('gulp-concat'),
		rename         = require('gulp-rename'),
		cleanCSS       = require('gulp-clean-css'),
		autoprefixer   = require('gulp-autoprefixer'),
		imagemin       = require('gulp-imagemin'),
		uglify         = require('gulp-uglify'),
		replace        = require('gulp-replace'),
		sass           = require('gulp-sass');

gulp.task('html', function () {
	return gulp.src(['./src/[^_]*.html', './src/templates/[^_]*.html'])
			.pipe(nunjucks.compile({build: 'dev'}))
			.pipe(gulp.dest('src/temp'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('htmlProd', function () {
	return gulp.src(['./src/[^_]*.html', './src/templates/[^_]*.html'])
		.pipe(nunjucks.compile({build: 'prod'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
	return gulp.src('./src/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/temp/css'))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('sassProd', function () {
	gulp.src('./src/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 15 versions']}))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulp.dest('dist/css'))
		.pipe(gulp.dest('src/css'));
	return gulp.src(['src/css/header.min.css'])
		.pipe(replace('@font-face', '111'))
		.pipe(gulp.dest('src/css'));
});

gulp.task('js', function() {
	gulp.src('./src/libs/**/*.js')
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('src/temp/js'));
	return gulp.src('src/js/scripts.js')
		.pipe(gulp.dest('src/temp/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('jsProd', function() {
	return gulp.src(['./src/libs/**/*.js', './src/js/scripts.js'])
		.pipe(uglify())
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
	return gulp.src('./src/fonts/**')
		.pipe(gulp.dest('src/temp/fonts'));
});

gulp.task('fontsProd', function () {
	return gulp.src('./src/fonts/**')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('img', function () {
	chokidar.watch('src/img/', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
		if(event === 'add'){
			var newPath = 'src\\temp' + path.substring(3);
			newPath = ('src\\temp' + path.substring(3)).substring(0, newPath.lastIndexOf('\\'));
			return gulp.src(path).pipe(gulp.dest(newPath));
		}else if(event === 'unlink'){
			del('src\\temp' + path.substring(3));
		}else if(event === 'change'){
			del('src\\temp' + path.substring(3));
			var newPath = 'src\\temp' + path.substring(3);
			newPath = newPath.substring(0, newPath.lastIndexOf('\\'));
			return gulp.src(path).pipe(gulp.dest(newPath));
		}
	});
});

gulp.task('imgProd', function () {
	gulp.src(['src/img/**/*.jpg', 'src/img/**/*.png'])
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));
	return gulp.src('src/img/*.svg')
	.pipe(svgmin())
	.pipe(gulp.dest('dist/img'));
});

gulp.task('svg-sprite', function() {
	return gulp.src('src/img/svg-sprite/*.svg')
		.pipe(svgmin())
		.pipe(svgSprite({ mode : { inline : true, symbol : true }}))
		.pipe(gulp.dest('src/img/svg-sprite/sprite'));
});

gulp.task('svg-auto-sprite', ['svg-sprite'], function() {
	var watcher = chokidar.watch('src/img/svg-sprite/*.svg', {
		ignored: /(^|[\/\\])\../
	});
	watcher.on('all', _.debounce(function(){
		runSequence('svg-sprite', 'html');
	}, 1000));
});


gulp.task('default', ['js', 'sass', 'html', 'fonts', 'svg-auto-sprite', 'img'], function () {
	browserSync({
		server: { baseDir: 'src/temp' },
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
	gulp.watch(['./src/*.html', './src/templates/*.html', './src/css/header.css'], ['html']);
	gulp.watch('./src/sass/**/*.sass', ['sass']);
	gulp.watch(['./src/js/*.js', './src/libs/**/*.js'], ['js']);
	gulp.watch('./src/fonts/**/*', ['fonts']);
});

gulp.task('build', ['imgProd', 'sassProd', 'jsProd', 'fontsProd', 'htmlProd']);

gulp.task('removetemp', function() { return del.sync('./src/temp'); });

gulp.task('clearcache', function () { return cache.clearAll(); });