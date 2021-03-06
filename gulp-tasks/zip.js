module.exports = function() {
    const gulp = require('gulp');
    const util = require('gulp-util');
    const replace = require('gulp-replace');
    const inlinesource = require('gulp-inline-source');
    const zip           = require('gulp-zip');
    const checkFileSize = require('gulp-check-filesize');

    const config = util.env.boilerplate.config;
    const zipConfig = config.tasks.zip;

    var replaceList = {
        'phone-camera-icon': 'pci',
        'phone-progress-bar': 'ppb',
        'phone-sound-icon': 'psi',
        'phone-health-icon': 'phi',
        'signal-bar': 'sb',
        'phone-top-bar': 'ptb',
        'phone-bottom-bar': 'pbb',
        'phone-home': 'ph',
        'phone-sleep': 'sl',
        'phone-volume': 'pv',
        'phone-sensor': 'ps',
        'phone-flash': 'pf',
        'phone-speaker': 'pk',
        'phone-screen': 'sc',
        'phone-app': 'pa',
        'phone-health': 'pe',
        'phone-light-icon': 'pli',
        'phone-light': 'pl',
        'phone-camera': 'pc',
        'phone-settings': 'se',
        'phone-gear': 'ge',
        'phone-notes': 'no',
        'phone-sound': 'so',
        'compass-pointer-wrapper': 'cpw',
        'compass-pointer': 'cp',
        'iphone-keyboard-wrapper': 'ikw',
        'countdown': 'cd',
        'iphone-keyboard': 'ik',
        'text-overlay': 'to',
    }

    var valueList = [];
    for (var text in replaceList) {
        if (replaceList.hasOwnProperty(text)) {
            var value = replaceList[text];
            if(valueList.indexOf(value) >=0) {
                console.log('----------- duplicate replace value: "' + value + '"')
            } else {
                valueList.push(value);
            }
        }
    }
    
    gulp.task('zip', function () {
        var task = gulp.src(config.destinationRoot + zipConfig.source).pipe(inlinesource({
            compress: false
        }));
            
        for (var text in replaceList) {
            if (replaceList.hasOwnProperty(text)) {
                task = task.pipe(replace(text, replaceList[text]));
            }
        }

        return task.pipe(zip(zipConfig.filename))
            .pipe(gulp.dest(zipConfig.destination))
            .pipe(checkFileSize({
                fileSizeLimit: 16384
            }));
    });
};