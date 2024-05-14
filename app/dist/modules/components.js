'use strict';

define(function () {

    'use strict';

    var adder = function adder(state) {
        var dataParser = arguments.length <= 1 || arguments[1] === undefined ? function (data) {
            return data;
        } : arguments[1];
        return {
            add: function add(data, type) {
                if (typeof state.dataObjects[type] !== 'undefined') {
                    var error = 'Object of this type already exists.';
                    throw new Error(error);
                }

                state.dataObjects[type] = dataParser(data);
            }
        };
    };

    var objectGetter = function objectGetter(state, property) {
        return {
            getReferenceTo: function getReferenceTo(type) {
                return state[property][type];
            }
        };
    };

    var getter = function getter(state) {
        var property = arguments.length <= 1 || arguments[1] === undefined ? 'data' : arguments[1];
        return {
            getData: function getData() {
                return JSON.parse(JSON.stringify(state[property]));
            }
        };
    };

    var allocator = function allocator(state) {
        return {
            allocatePoints: function allocatePoints(name, points) {
                var target = _.find(state.data, function (item) {
                    return item.name === name;
                });

                if (!target) {
                    var message = 'Target "' + name + '" doesn\'t exist.';
                    throw new Error(message);
                } else {
                    target.allocatedPoints += points;
                }
            }
        };
    };

    var assigner = function assigner() {
        return {
            assignToProject: function assignToProject(person, newProject, targetContainer) {
                var previousProject = undefined;

                if (person.project) {
                    previousProject = person.project;
                    person.project = '';
                }

                if (previousProject) {
                    targetContainer.allocatePoints(previousProject, -person.velocity);
                }

                if (newProject && newProject.name) {
                    person.project = newProject.name;
                    targetContainer.allocatePoints(newProject.name, person.velocity);
                }
            }
        };
    };

    var plotter = function plotter(state, canvas, groupName) {
        var visualRepresentation = function visualRepresentation(data, visualData) {
            data.forEach(function (item, key) {

                if (!visualData[key] || typeof visualData[key].x === 'undefined') item.x = Math.round(Math.random() * 300);else item.x = visualData[key].x;

                if (!visualData[key] || typeof visualData[key].y === 'undefined') item.y = Math.round(Math.random() * 300);else item.y = visualData[key].y;
            });

            return data;
        };

        var addCircles = function addCircles(container, data, groupName) {
            var selection = container.selectAll('circle.' + groupName).data(data);

            selection.enter().append('circle').classed(groupName, true);

            return selection;
        };

        return {
            plot: function plot() {
                state.data = visualRepresentation(state.sourceDataObject.getData(), state.data);
                var selection = addCircles(canvas, state.data, groupName);
                state.steps.forEach(function (item) {
                    return item(selection);
                });
            }
        };
    };

    return {
        adder: adder,
        objectGetter: objectGetter,
        getter: getter,
        allocator: allocator,
        assigner: assigner,
        plotter: plotter
    };
}, 'components');