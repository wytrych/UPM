'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function (d3, _) {

    'use strict';

    var data = [{
        name: 'Catbreed',
        velocity: 80,
        allocatedPoints: 0,
        type: 'project'
    }, {
        name: 'Coalesion',
        velocity: 80,
        allocatedPoints: 0,
        type: 'project'
    }, {
        name: 'Alice',
        velocity: 20,
        field: 'backend',
        type: 'person'
    }, {
        name: 'Bob',
        velocity: 30,
        field: 'javascript',
        type: 'person'
    }, {
        name: 'Claire',
        velocity: 40,
        field: 'css',
        type: 'person'
    }];

    var allocatePoints = function allocatePoints(name, points) {
        var project = _.find(data, function (item) {
            return item.name === name;
        });

        if (project) {
            project.allocatedPoints += points;
        }
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

            svg.selectAll("circle").attr("cx", function (d) {
                return d.x;
            }).attr("cy", function (d) {
                return d.y;
            });

            var project = _.find(projects, function (project) {
                return project.name === item.project;
            });

            if (previousProject) {
                previousProject.allocatedPoints -= item.velocity;
                allocatePoints(previousProject.name, -item.velocity);
            }

            if (project) {
                project.allocatedPoints += item.velocity;
                allocatePoints(project.name, item.velocity);
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

    var svg = createContainer(width, height);

    var addCircles = function addCircles(container, data) {
        return container.selectAll('circle').data(data).enter().append('circle').attr('class', function (d) {
            var classNames = d.type;
            if (d.field) classNames += ' ' + d.field;

            return classNames;
        });
    };

    var createVisualRepresentation = function createVisualRepresentation(data) {
        var representation = JSON.parse(JSON.stringify(data));
        representation.forEach(function (item) {
            item.x = Math.round(Math.random() * 300);
            item.y = Math.round(Math.random() * 300);
        });

        return representation;
    };

    var visualRepresentation = createVisualRepresentation(data);

    addCircles(svg, visualRepresentation).each(function (d) {
        if (d.type === 'person') d3.select(this).call(getDragger());
    });

    var plotCircles = function plotCircles(selection) {
        selection.attr("r", d3.f('velocity')).attr("cx", d3.f('x')).attr("cy", d3.f('y'));
    };

    plotCircles(svg.selectAll('circle'));

    window.printData = function () {
        console.log(data);
    };
})(window.d3, window._);