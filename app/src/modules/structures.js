define(require => {
    console.log('strc');

    'use strict';

    let components = require('components');
    let _ = require('_');

    const dataManager = () => {
        let state = {
            dataObjects: {}
        };

        const dataContainer = (sourceData, targets) => {
            let data = JSON.parse(JSON.stringify(sourceData));
            let state = {
                data,
                projects: targets
            };

            return Object.assign(
                {},
                components.getter(state),
                components.allocator(state)
            );
        };

        return Object.assign(
            {},
            components.adder(state, dataContainer),
            components.objectGetter(state, 'dataObjects')
        );
    };

    const plotContainer = () => {
        const bulkPlotter = (state) => ({
            plotAll: () => {
                _.forEach(state.dataObjects, item => {
                    item.plot();
                });
            },
            plot: (name) => {
                state.dataObjects[name].plot();
            }
        });

        let state = {
            dataObjects: {}
        };

        return Object.assign(
            {},
            components.adder(state),
            bulkPlotter(state)
        );
    };

    return {
        dataManager,
        plotContainer
    };
}, 'structures');
