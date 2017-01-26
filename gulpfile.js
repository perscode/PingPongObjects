/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var args = require('yargs').argv;
var browserSync = require('browser-sync').create();
var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var port = process.env.PORT || config.defaultPort; 


gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

var onError = function (err) {
    console.log(err);
};
// This task should be run, when you want to reload the webpage, when files change on disk.
// This task will only watch JavaScript file changes in the folder "/Client" and it's subfolders.
gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch(config.js, ['reload']);
});

gulp.task('reload', function () {
    // Change the filepath, when you want to live reload a different page in your project.
    $.livereload.reload(config.index);
});


gulp.task('fonts', function () {
    log('Copying fonts');
    return gulp.src(config.fonts)
    .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function() {
    log('Compiling Less --> CSS');
    
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

// gulp.task('clean-styles', function(done) {
//    var files = config.temp + '**/*.css';
//    return clean(files); 
// });

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
  var files = config.temp + '**/*.css';
  log('Cleaning-styles: ' + $.util.colors.green(files));
  return clean(files, done);
});

gulp.task('less-watcher', function() {
   gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function () {
    log('Injecting css');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function(){
   log('Starting nodemon');
   var isDev = true;
   var nodeOptions = {
     script: config.nodeServer, 
     delayTime: 1,
     env: {
         'PORT': port,
         'NODE_ENV': isDev ? 'dev' : 'build'
     },
     watch: [config.server] 
   };
   
   return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted' );
            log('files changed on restar:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        }); 
});

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
    if(browserSync.active){
        log('browser sync is already active. returning');
        return;
    }
    
    log('Starting browser-sync on port: ' + port);
    
    gulp.watch([config.less], ['styles'])
        .on('change', changeEvent);
        
    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.js',
            config.client + '**/*.html',
            config.client + '**/*.jpg',
            config.client + '**/*.png',
            config.client + '**/*.gif',
            config.temp + '**/*.css'
        ],
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        injectChanges: true, // if false, it will always reload even when no change occur
        logFileChanges: true, // default value true
        logLevel: 'debug', // default value true
        logPrefix: 'gulp-patterns', // Helps us keeping track where the log originates from 
        notify: true, // a shell that pops up inside the browser to make you know when it's ready,
        reloadDelay: 0 //1000
    };
    return browserSync.init(config.less, options);
}
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}
// function clean(path) {
//     log('Cleaning: ' + $.util.colors.blue(path));
//     return del(path);
// }

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
  log('Cleaning: ' + $.util.colors.green(path));
  del(path)
        .then(function(){
            return done();
        });
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

module.exports = gulp;