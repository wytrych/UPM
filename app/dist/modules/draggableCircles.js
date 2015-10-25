'use strict';

define(function (require) {

    'use strict';

    var components = require('components');
    var structures = require('structures');
    var utils = require('utils');
    var plottingSteps = require('plottingSteps');

    var data = {
        projects: [{
            name: 'Catbreed',
            velocity: 80,
            allocatedPoints: 0
        }, {
            name: 'Coalesion',
            velocity: 80,
            allocatedPoints: 0
        }],
        people: [{
            name: 'Alice',
            velocity: 20,
            field: 'backend'
        }, {
            name: 'Bob',
            velocity: 30,
            field: 'javascript'
        }, {
            name: 'Claire',
            velocity: 40,
            field: 'css'
        }]
    };

    var projectVisualiser = function projectVisualiser(canvas, groupName, dataBank) {
        var radiusFunction = function radiusFunction(d) {
            return d.velocity - d.allocatedPoints;
        };

        var state = {
            steps: [plottingSteps.positionCircles(radiusFunction)],
            data: [],
            sourceDataObject: dataBank.getReferenceTo(groupName),
            dataBank: dataBank
        };

        return Object.assign({}, components.getter(state), components.plotter(state, canvas, groupName));
    };

    var peopleVisualiser = function peopleVisualiser(canvas, groupName, dataBank, mainPlotter) {
        var radiusFunction = function radiusFunction(d) {
            return d.velocity;
        };
        var state = {};
        var dragger = utils.getDragger('projects', state, canvas);

        state.steps = [plottingSteps.positionCircles(radiusFunction), plottingSteps.addClassFromProperty('field'), plottingSteps.addDragger(dragger)];
        state.data = [];
        state.sourceDataObject = dataBank.getReferenceTo(groupName);
        state.projects = dataBank.getReferenceTo('projects');

        state.collision = function (item, collidedWith) {
            components.assigner().assignToProject(item, collidedWith, state.projects);
            mainPlotter.plot('projects');
        };

        return Object.assign({}, components.plotter(state, canvas, groupName));
    };

    var dataBank = structures.dataManager();
    dataBank.add(data.projects, 'projects');
    dataBank.add(data.people, 'people');

    var svg = utils.createContainer();

    var visualisations = structures.plotContainer();

    var projectVisualisation = projectVisualiser(svg, 'projects', dataBank);
    var peopleVisualisation = peopleVisualiser(svg, 'people', dataBank, visualisations);

    visualisations.add(projectVisualisation, 'projects');
    visualisations.add(peopleVisualisation, 'people');
    visualisations.plotAll();
});