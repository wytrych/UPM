module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/dist/modules/helpers/definitions.js',
        'app/lib/d3/d3.js',
        'app/lib/lodash/lodash.js',
      'app/dist/modules/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox'],

    plugins : [
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
