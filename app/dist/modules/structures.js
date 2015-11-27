'use strict';

define(function (require) {
    console.log('strc');

    'use strict';

    var components = require('components');
    var _ = require('_');

    var dataManager = function dataManager() {
        var state = {
            dataObjects: {}
        };

        var dataContainer = function dataContainer(sourceData, targets) {
            var data = JSON.parse(JSON.stringify(sourceData));
            var state = {
                data: data,
                projects: targets
            };

            return Object.assign({}, components.getter(state), components.allocator(state));
        };

        return Object.assign({}, components.adder(state, dataContainer), components.objectGetter(state, 'dataObjects'));
    };

    var plotContainer = function plotContainer() {
        var bulkPlotter = function bulkPlotter(state) {
            return {
                plotAll: function plotAll() {
                    _.forEach(state.dataObjects, function (item) {
                        item.plot();
                    });
                },
                plot: function plot(name) {
                    state.dataObjects[name].plot();
                }
            };
        };

        var state = {
            dataObjects: {}
        };

        return Object.assign({}, components.adder(state), bulkPlotter(state));
    };

    return {
        dataManager: dataManager,
        plotContainer: plotContainer
    };
}, 'structures');