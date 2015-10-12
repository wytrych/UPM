'use strict';

(function (d3, _) {

    'use strict';

    var people = [{
        name: 'Alice',
        x: 10,
        y: 10,
        velocity: 20,
        field: 'backend'
    }, {
        name: 'Bob',
        x: 30,
        y: 30,
        velocity: 30,
        field: 'javascript'
    }, {
        name: 'Claire',
        x: 50,
        y: 50,
        velocity: 40,
        field: 'css'
    }];

    var projects = [{
        name: 'Catbreed',
        x: 100,
        y: 100,
        velocity: 80,
        allocatedPoints: 0
    }, {
        name: 'Coalesion',
        x: 300,
        y: 300,
        velocity: 80,
        allocatedPoints: 0
    }];

    var dragstop = function dragstop(item) {
        var nodes = Array.of.apply(Array, [item].concat(projects));
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
        }

        if (project) {
            project.allocatedPoints += item.velocity;
        }

        svg.selectAll('circle.projects').attr('r', function (d) {
            return d.velocity - d.allocatedPoints;
        });
    };

    function collide(node, item) {
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
    }

    var width = 540,
        height = 425;

    var drag = d3.behavior.drag().on("drag", dragmove).on("dragend", dragstop);

    var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

    svg.selectAll('circle.projects').data(projects).enter().append('circle.projects');

    svg.selectAll('circle.people').data(people).enter().append('circle').attr('class', function (d) {
        return 'people ' + d.field;
    }).call(drag);

    svg.selectAll('circle').attr("r", d3.f('velocity')).attr("cx", d3.f('x')).attr("cy", d3.f('y'));

    function dragmove(d) {
        /* jshint validthis: true */
        d3.select(this)
        /* jshint validthis: false */
        .attr("cx", d3.event.x).attr("cy", d3.event.y);

        d.x = d3.event.x;
        d.y = d3.event.y;
    }
})(window.d3, window._);