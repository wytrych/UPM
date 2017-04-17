module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/lib/d3/d3.js',
        'app/lib/lodash/lodash.js',
        'app/dist/modules/helpers/definitions.js',
        'app/dist/modules/components.js',
        'app/dist/modules/plottingSteps.js',
        'app/dist/modules/structures.js',
        //'app/dist/modules/*.js',
        'app/dist/tests/*.js'
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
