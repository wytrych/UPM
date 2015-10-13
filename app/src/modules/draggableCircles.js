(function (d3, _) {

    'use strict';

    var data = {
        people: [
            {
                name: 'Alice',
                x: 10,
                y: 10,
                velocity: 20,
                field: 'backend'
            },
            {
                name: 'Bob',
                x: 30,
                y: 30,
                velocity: 30,
                field: 'javascript'
            },
            {
                name: 'Claire',
                x: 50,
                y: 50,
                velocity: 40,
                field: 'css'
            }
        ],
        projects: [
            {
                name: 'Catbreed',
                x: 100,
                y: 100,
                velocity: 80,
                allocatedPoints: 0
            },
            {
                name: 'Coalesion',
                x: 300,
                y: 300,
                velocity: 80,
                allocatedPoints: 0
            }
        ]
    };

    const getDragger = function () {

        const dragstop = function (item) {
            let nodes = Array.of(item, ...data.projects);
            var previousProject;

            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            if (item.project) {
                previousProject = _.find(data.projects, (project) => {
                    return project.name === item.project;
                });
            }

            item.project = null;

            while (++i < n) {
                q.visit(collide(nodes[i], item));
            }

            svg.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

            let project = _.find(data.projects, (project) => {
                return project.name === item.project;
            });

            if (previousProject) {
                previousProject.allocatedPoints -= item.velocity;
            }

            if (project) {
                project.allocatedPoints += item.velocity;
            }

            svg.selectAll('circle.projects')
            .attr('r', (d) => {
                return d.velocity - d.allocatedPoints;
            });
        
        };

        const collide = function (node, item) {
            var r = node.velocity + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
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

        const dragmove = function (d) {
            /* jshint validthis: true */
            d3.select(this)
            /* jshint validthis: false */
                .attr("cx", d3.event.x)
                .attr("cy", d3.event.y);

            d.x = d3.event.x;
            d.y = d3.event.y;
        };

        return d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragend", dragstop);
    };

    const width = 540,
        height = 425;

    const createContainer = function (width, height) {
        return d3.select("body").append("svg").attr("width", width).attr("height", height);
    };

    var svg = createContainer(width, height);

    const addCircles = function (container, data, circleClass) {
        var elements = 'circle.' + circleClass;
        return container.selectAll(elements).data(data[circleClass])
            .enter()
                .append(elements);
    };

    addCircles(svg, data, 'projects');
    addCircles(svg, data, 'people')
        .attr('class', (d) => {
            return 'people ' + d.field;
        })
        .call(getDragger());

    const plotCircles = function (selection) {
       selection 
            .attr("r", d3.f('velocity'))
            .attr("cx", d3.f('x'))
            .attr("cy", d3.f('y'));
    };

    plotCircles(svg.selectAll('circle'));

})(window.d3, window._);
