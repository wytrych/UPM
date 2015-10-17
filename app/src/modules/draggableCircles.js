(function (d3, _) {

    'use strict';

    var projects = [
            {
                name: 'Catbreed',
                velocity: 80,
                allocatedPoints: 0,
                type: 'project'
            },
            {
                name: 'Coalesion',
                velocity: 80,
                allocatedPoints: 0,
                type: 'project'
            }
    ];

    var people = [
            {
                name: 'Alice',
                velocity: 20,
                field: 'backend',
                type: 'person'
            },
            {
                name: 'Bob',
                velocity: 30,
                field: 'javascript',
                type: 'person'
            },
            {
                name: 'Claire',
                velocity: 40,
                field: 'css',
                type: 'person'
            }
        ];

    const getter = (state) => ({
        getData: () => JSON.parse(JSON.stringify(state.data))
    });

    const allocator = (state) => ({
        allocatePoints: (name, points) => {
            let target = _.find(state.data, (item) => (
                item.name === name
            ));

            if (target) {
                target.allocatedPoints += points;
            }
        }
    });

    const dataContainer = (sourceData) => {
        let data = JSON.parse(JSON.stringify(sourceData));
        let state = {
            data
        };

        return Object.assign(
            {},
            getter(state),
            allocator(state)
        );
    };

    var myProjects = dataContainer(projects);
    var myPeople = dataContainer(people);

    const getDragger = function () {

        const dragstop = function (item) {
            let projects = _.filter(visualRepresentation, (d) => ( d.type === 'project' ));
            let nodes = Array.of(item, ...projects);
            var previousProject;

            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            if (item.project) {
                previousProject = _.find(projects, (project) => ( project.name === item.project ));
            }

            item.project = null;

            while (++i < n) {
                q.visit(collide(nodes[i], item));
            }

            svg.selectAll("circle")
                .attr("cx", d3.f('x'))
                .attr("cy", d3.f('y'));

            let project = _.find(projects, (project) => ( project.name === item.project ));

            if (previousProject) {
                previousProject.allocatedPoints -= item.velocity;
                myProjects.allocatePoints(previousProject.name, -item.velocity);
            }

            if (project) {
                project.allocatedPoints += item.velocity;
                myProjects.allocatePoints(project.name, item.velocity);
            }

            svg.selectAll('circle.project')
                .attr('r', (d) => (d.velocity - d.allocatedPoints));
        
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

    const createContainer = (width, height) => (
        d3.select("body").append("svg").attr("width", width).attr("height", height)
    );

    var svg = createContainer(width, height);

    const addCircles = function (container, data, groupName) {
        return container.selectAll('circle.' + groupName).data(data)
            .enter()
                .append('circle')
                .attr('class', (d) => {
                    let classNames = `${d.type} ${groupName}`;
                    if (d.field) 
                        classNames += ` ${d.field}`;

                    return classNames;
                });
    };

    const createVisualRepresentation = function (...data) {
        console.log(data);
        let representation = [];
        data.forEach((item, key) => {
            let newItem = {};
            newItem.x = Math.round(Math.random() * 300);
            newItem.y = Math.round(Math.random() * 300);
            newItem.field = item.field;
            newItem.name = item.name;
            newItem.velocity = item.velocity;
            newItem.type = item.type;
            newItem.allocatedPoints = item.allocatedPoints;

            representation.push(newItem);
        });

        return representation;
    };

    const circleDrawer = (state) => ({
        plot: (data) => {
            addCircles (state.canvas, createVisualRepresentation(...data), state.groupName)
                .each(function(d) {
                    var element = d3.select(this)
                        .attr("r", d.velocity)
                        .attr("cx", d.x)
                        .attr("cy", d.y);

//                    if (d.type === 'person') 
//                        element.call(getDragger());
                });
        }
    });

    const addDragger = (selection) => {
        selection.each(function (d) {
            d3.select(this).call(getDragger());
        });
    };

    const plotData = (selection) => {
        selection.each(function (d) {
            d3.select(this)
                .attr("r", d.velocity)
                .attr("cx", d.x)
                .attr("cy", d.y);
        });
    };

    const staticVisualiser = (canvas, groupName) => ({
        plot: (data) => {
            let selection = addCircles (canvas, createVisualRepresentation(...data), groupName);
            let steps = [plotData];
            steps.forEach(item => item(selection));
        }
    });

    const draggableVisualiser = (canvas, groupName) => ({
        plot: (data) => {
            let selection = addCircles (canvas, createVisualRepresentation(...data), groupName);
            let steps = [plotData, addDragger];
            steps.forEach(item => item(selection));
        }
    });

    var projectVisualisation = staticVisualiser(svg, 'project');
    projectVisualisation.plot(myProjects.getData());

    var peopleVisualisation = draggableVisualiser(svg, 'person');
    peopleVisualisation.plot(myPeople.getData());

})(window.d3, window._);
