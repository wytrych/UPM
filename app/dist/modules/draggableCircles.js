'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function (d3, _) {

    'use strict';

    var projects = [{
        name: 'Catbreed',
        velocity: 80,
        allocatedPoints: 0
    }, {
        name: 'Coalesion',
        velocity: 80,
        allocatedPoints: 0,
        type: 'project'
    }];

    var people = [{
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
    }];

    var getter = function getter(state) {
        return {
            getData: function getData() {
                return JSON.parse(JSON.stringify(state.data));
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

    var dataContainer = function dataContainer(sourceData) {
        var data = JSON.parse(JSON.stringify(sourceData));
        var state = {
            data: data
        };

        return Object.assign({}, getter(state), allocator(state));
    };

    var getDragger = function getDragger() {

        var dragstop = function dragstop(item) {
            var projects = _.filter(visualRepresentation, function (d) {
                return d.type === 'project';
            });
            var nodes = Array.of.apply(Array, [item].concat(_toConsumableArray(projects)));
            var previousProject;

            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            if (item.project) {
                previousProject = _.find(projects, function (project) {
                    return project.name === item.project;
                });
            }

            item.project = null;

            while (++i < n) {
                q.visit(collide(nodes[i], item));
            }

            svg.selectAll("circle").attr("cx", d3.f('x')).attr("cy", d3.f('y'));

            var project = _.find(projects, function (project) {
                return project.name === item.project;
            });

            if (previousProject) {
                previousProject.allocatedPoints -= item.velocity;
                myProjects.allocatePoints(previousProject.name, -item.velocity);
            }

            if (project) {
                project.allocatedPoints += item.velocity;
                myProjects.allocatePoints(project.name, item.velocity);
            }

            svg.selectAll('circle.project').attr('r', function (d) {
                return d.velocity - d.allocatedPoints;
            });
        };

        var collide = function collide(node, item) {
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
                        r = node.velocity + quad.point.velocity;
                    if (l < r) {
                        item.project = node.name;
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

    var width = 540,
        height = 425;

    var createContainer = function createContainer(width, height) {
        return d3.select("body").append("svg").attr("width", width).attr("height", height);
    };

    var addCircles = function addCircles(container, data, groupName) {
        return container.selectAll('circle.' + groupName).data(data).enter().append('circle').attr('id', function (d) {
            return d.name;
        }).attr('class', groupName);
    };

    var createVisualRepresentation = function createVisualRepresentation(data) {
        data.forEach(function (item) {
            item.x = Math.round(Math.random() * 300);
            item.y = Math.round(Math.random() * 300);
        });

        return data;
    };

    var plotData = function plotData(selection) {
        selection.each(function (d) {
            d3.select(this).attr("r", d.velocity).attr("cx", d.x).attr("cy", d.y);
        });
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

    var plotter = function plotter(steps, canvas, groupName) {
        return {
            plot: function plot(data) {
                var selection = addCircles(canvas, createVisualRepresentation(data), groupName);
                steps.forEach(function (item) {
                    return item(selection);
                });
            }
        };
    };

    var projectVisualiser = function projectVisualiser(canvas, groupName) {
        var features = [plotData];
        return plotter(features, canvas, groupName);
    };

    var peopleVisualiser = function peopleVisualiser(canvas, groupName, dragger) {
        var features = [plotData, addClassFromProperty('field'), addDragger(dragger)];
        return plotter(features, canvas, groupName);
    };

    var myProjects = dataContainer(projects);
    var myPeople = dataContainer(people);

    var svg = createContainer(width, height);

    var projectVisualisation = projectVisualiser(svg, 'project');
    projectVisualisation.plot(myProjects.getData());

    var peopleVisualisation = peopleVisualiser(svg, 'person', getDragger());
    peopleVisualisation.plot(myPeople.getData());
})(window.d3, window._);