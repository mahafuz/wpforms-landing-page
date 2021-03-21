const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const babel = require("gulp-babel");

// Sass Task
function scssTask() {
	return src("sass/style.sass", { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([cssnano()]))
		.pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
	return src("js/script.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(
			babel({
				presets: ["@babel/env"],
			})
		)
		.pipe(dest("dist", { sourcemaps: "." }));
}

// Browsersync Task
function browsersyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: ".",
		},
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch("*.html", browsersyncReload);
	watch(
		["sass/**/*.sass", "js/**/*.js"],
		series(scssTask, jsTask, browsersyncReload)
	);
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
