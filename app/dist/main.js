requirejs.config({
    //baseUrl: 'dist/modules',
    paths: {
        lib: '../lib',
        d3: '../lib/d3/d3',
        _: '../lib/lodash/lodash',
        components: 'modules/components',
        utils: 'modules/utils',
        plottingSteps: 'modules/plottingSteps',
        structures: 'modules/structures'
    }
});

//requirejs(['lib/d3/d3.js']);
requirejs(['dist/modules/draggableCircles.js']);
