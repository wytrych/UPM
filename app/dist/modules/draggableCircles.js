'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function (d3, _) {

    'use strict';

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

    var adder = function adder(state) {
        return {
            add: function add(data, type) {
                try {
                    if (typeof state.dataObjects[type] !== 'undefined') throw new Error('Object of this type already exists.');

                    state.dataObjects[type] = dataContainer(data);
                } catch (e) {
                    console.error(e);
                }
            }
        };
    };

    var dataManager = function dataManager() {
        var state = {
            dataObjects: {}
        };

        return Object.assign({}, adder(state), objectGetter(state, 'dataObjects'));
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

                if (target) {
                    target.allocatedPoints += points;
                }
            }
        };
    };

    var assigner = function assigner(state) {
        return {
            assignToProject: function assignToProject(personName, newProject) {
                var person = _.find(state.data, function (item) {
                    return item.name === personName;
                });
                var previousProject = undefined;

                if (person.project) {
                    previousProject = person.project;
                }

                person.project = newProject.name;

                if (previousProject) {
                    state.projects.allocatePoints(previousProject, -person.velocity);
                }

                if (newProject) {
                    state.projects.allocatePoints(newProject.name, person.velocity);
                }

                projectVisualisation.plot();
            }
        };
    };

    var dataContainer = function dataContainer(sourceData, targets) {
        var data = JSON.parse(JSON.stringify(sourceData));
        var state = {
            data: data,
            projects: targets
        };

        return Object.assign({}, getter(state), allocator(state), assigner(state));
    };

    var getDragger = function getDragger(target, state) {

        var dragstop = function dragstop(item) {
            var targetNodes = target.getData();
            var nodes = Array.of.apply(Array, [item].concat(_toConsumableArray(targetNodes)));
            var previousProject;

            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            var collidedWith = {};

            while (++i < n) {
                q.visit(collide(nodes[i], collidedWith));
            }

            state.assignToProject(item.name, collidedWith);
        };

        var collide = function collide(node, collidedWith) {
            var r = node.velocity + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function (quad, x1, y1, x2, y2) {
                if (quad.point && quad.point !== node) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.r + quad.point.r;
                    if (l < r) {
                        collidedWith.name = node.name;
                        l = (l - r) / l * 0.5;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        };

        var dragmove = function dragmove(d) {
            /* jshint validthis: true */
            d3.select(this)
            /* jshint validthis: false */
            .attr("cx", d3.event.x).attr("cy", d3.event.y);

            d.x = d3.event.x;
            d.y = d3.event.y;
        };

        return d3.behavior.drag().on("drag", dragmove).on("dragend", dragstop);
    };

    var createContainer = function createContainer() {
        var width = arguments.length <= 0 || arguments[0] === undefined ? 540 : arguments[0];
        var height = arguments.length <= 1 || arguments[1] === undefined ? 425 : arguments[1];
        return d3.select("body").append("svg").attr("width", width).attr("height", height);
    };

    var addCircles = function addCircles(container, data, groupName) {
        var selection = container.selectAll('circle.' + groupName).data(data);

        selection.enter().append('circle');

        selection.attr('id', function (d) {
            return d.name;
        }).attr('class', groupName);

        return selection;
    };

    var positionCircles = function positionCircles(radiusFunction) {
        return function (selection) {
            selection.each(function (d) {
                d.r = radiusFunction(d);
                d3.select(this).attr("r", d.r).attr("cx", d.x).attr("cy", d.y);
            });
        };
    };

    var addDragger = function addDragger(dragger) {
        return function (selection) {
            selection.each(function (d) {
                d3.select(this).call(dragger);
            });
        };
    };

    var addClassFromProperty = function addClassFromProperty(property) {
        return function (selection) {
            selection.each(function (d) {
                var element = d3.select(this);
                var currentClass = element.attr('class');

                element.attr('class', currentClass + (' ' + d[property]));
            });
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

    var projectVisualiser = function projectVisualiser(canvas, groupName, dataBank) {
        var radiusFunction = function radiusFunction(d) {
            return d.velocity - d.allocatedPoints;
        };

        var state = {
            steps: [positionCircles(radiusFunction)],
            data: [],
            sourceDataObject: dataBank.getReferenceTo(groupName),
            dataBank: dataBank
        };

        return Object.assign({}, getter(state), plotter(state, canvas, groupName));
    };

    var peopleVisualiser = function peopleVisualiser(canvas, groupName, dragger, dataBank) {
        var radiusFunction = function radiusFunction(d) {
            return d.velocity;
        };

        var state = {
            steps: [positionCircles(radiusFunction), addClassFromProperty('field'), addDragger(dragger)],
            data: [],
            sourceDataObject: dataBank.getReferenceTo(groupName),
            dataBank: dataBank
        };

        return Object.assign({}, plotter(state, canvas, groupName));
    };

    var dataBank = dataManager();
    dataBank.add(data.projects, 'projects');
    dataBank.add(data.people, 'people');

    var myProjects = dataBank.getReferenceTo('projects');
    var myPeople = dataBank.getReferenceTo('people');

    var svg = createContainer();

    var projectVisualisation = projectVisualiser(svg, 'projects', dataBank);
    projectVisualisation.plot();

    var peopleVisualisation = peopleVisualiser(svg, 'people', getDragger(projectVisualisation, myPeople), dataBank);
    peopleVisualisation.plot();
})(window.d3, window._);