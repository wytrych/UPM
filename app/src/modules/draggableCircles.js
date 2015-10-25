define(function (require) {

    'use strict';

    var components = require('components');
    var structures = require('structures');
    var utils = require('utils');
    var plottingSteps = require('plottingSteps');

    var data = {
        projects: [
            {
                name: 'Catbreed',
                velocity: 80,
                allocatedPoints: 0
            },
            {
                name: 'Coalesion',
                velocity: 80,
                allocatedPoints: 0
            }
        ],
        people: [
            {
                name: 'Alice',
                velocity: 20,
                field: 'backend'
            },
            {
                name: 'Bob',
                velocity: 30,
                field: 'javascript'
            },
            {
                name: 'Claire',
                velocity: 40,
                field: 'css'
            }
        ]
    };


    const projectVisualiser = (canvas, groupName, dataBank) => {
        let radiusFunction = (d) => d.velocity - d.allocatedPoints;

        let state = {
            steps: [
                plottingSteps.positionCircles(radiusFunction)
            ],
            data: [],
            sourceDataObject: dataBank.getReferenceTo(groupName),
            dataBank
        };

        return Object.assign(
            {},
            components.getter(state),
            components.plotter(state, canvas, groupName)
        );
    };

    const peopleVisualiser = (canvas, groupName, dataBank, mainPlotter) => {
        let radiusFunction = (d) => d.velocity;
        let state = {};
        let dragger = utils.getDragger('projects', state, canvas);

        state.steps =  [
            plottingSteps.positionCircles(radiusFunction),
            plottingSteps.addClassFromProperty('field'),
            plottingSteps.addDragger(dragger)
        ];
        state.data = [];
        state.sourceDataObject = dataBank.getReferenceTo(groupName);
        state.projects = dataBank.getReferenceTo('projects');

        state.collision = (item, collidedWith) => {
            components.assigner().assignToProject(item, collidedWith, state.projects);
            mainPlotter.plot('projects');
        };

        return Object.assign(
            {},
            components.plotter(state, canvas, groupName)
        );
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
