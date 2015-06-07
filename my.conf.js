// Karma configuration
// Generated on Fri Jun 05 2015 14:36:59 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: 'public/js/lib/angular/angular.js', watch: false},
        {pattern: 'public/js/lib/angular/angular-resource.js', watch: false},
        {pattern: 'public/js/lib/angular/angular-mocks.js', watch: false},
        {pattern: 'public/js/lib/angular/jquery-1.11.3.min.js', watch: false},
        // {pattern: 'public/js/lib/angular/ngkit.js', watch: false},
      'routes/search.js',
      'public/js/HelloWorld.js',
      // 'public/js/card_viewer.js',
      // 'public/js/competition.js',
      'public/js/script.js',
      'public/js/Search_Results.js',
      'public/js/view.js',
      'public/js/popUp.js',
      'public/js/leaderboard.js',
      'public/js/flashcardJS.js',
      'public/js/favoriteSets.js',
      'public/js/edit_a_set.js',
      'public/js/createSet.js',
      'public/test/*.js',
      '/routes/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
