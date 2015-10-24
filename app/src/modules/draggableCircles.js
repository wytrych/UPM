(function (d3, _) {

    'use strict';

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

    const adder = (state, dataParser = data => data) => ({
        add: (data, type) => {
            try {
                if (typeof state.dataObjects[type] !== 'undefined') 
                    throw new Error ('Object of this type already exists.');

                state.dataObjects[type] = dataParser(data);

            } catch (e) {
                console.error(e);
            }
        }
    });

    const dataManager = () => {
        let state = {
            dataObjects: {}
        };

        return Object.assign(
            {},
            adder(state, dataContainer),
            objectGetter(state, 'dataObjects')
        );
    };
    
    const objectGetter = (state, property) => ({
        getReferenceTo: (type) => state[property][type]
    });

    const getter = (state, property = 'data') => ({
        getData: () => JSON.parse(JSON.stringify(state[property]))
    });

    const allocator = (state) => ({
        allocatePoints: (name, points) => {
            let target = _.find(state.data, (item) => item.name === name);

            if (target) {
                target.allocatedPoints += points;
            }
        }
    });

    const assigner = () => ({
        assignToProject: (person, newProject, targetContainer) => {
            let previousProject;

            if (person.project) {
                previousProject = person.project;
            }

            person.project = newProject.name;

            if (previousProject) {
                targetContainer.allocatePoints(previousProject, -person.velocity);
            }

            if (newProject) {
                targetContainer.allocatePoints(newProject.name, person.velocity);
            }

        }
    });

    const dataContainer = (sourceData, targets) => {
        let data = JSON.parse(JSON.stringify(sourceData));
        let state = {
            data,
            projects: targets
        };

        return Object.assign(
            {},
            getter(state),
            allocator(state)
        );
    };

    const getDragger = function (targetGroup, state, container) {

        const dragstop = function (item) {
            let nodes = [item];
            container.selectAll(`.${targetGroup}`).each(d => {
                nodes.push(d);
            });
            let q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            let collidedWith = {};

            while (++i < n) {
                q.visit(collide(nodes[i], collidedWith));
            }

            state.collision(item, collidedWith);

        };

        const collide = function (node, collidedWith) {
            var r = node.r + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
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

    const createContainer = (width = 540, height = 425) => 
        d3.select("body").append("svg").attr("width", width).attr("height", height);

    const positionCircles = (radiusFunction) => 
        (selection) => {
            selection.each(function (d) {
                d.r = radiusFunction(d);
                d3.select(this)
                    .attr("r", d.r)
                    .attr("cx", d.x)
                    .attr("cy", d.y);
            });
        };

    const addDragger = (dragger) =>
        (selection) => {
            selection.each(function (d) {
                d3.select(this).call(dragger);
            });
        };

    const addClassFromProperty = (property) => 
        (selection) => {
            selection.each(function (d) {
                let element = d3.select(this);
                let currentClass = element.attr('class');

                element.attr('class', currentClass + ` ${d[property]}`);
            });
        };

    const plotter = (state, canvas, groupName) => {
        const visualRepresentation = (data, visualData) => {
            data.forEach( (item, key) => {

                if (!visualData[key] || typeof visualData[key].x === 'undefined') 
                    item.x = Math.round(Math.random() * 300);
                else
                    item.x = visualData[key].x;

                if (!visualData[key] || typeof visualData[key].y === 'undefined') 
                    item.y = Math.round(Math.random() * 300);
                else
                    item.y = visualData[key].y;
            });

            return data;
        };

        const addCircles = (container, data, groupName) => {
            let selection = container.selectAll(`circle.${groupName}`).data(data);
            
            selection
                .enter()
                .append(`circle.${groupName}`);

            return selection;
        };

        return {
            plot: () => {
                state.data = visualRepresentation(state.sourceDataObject.getData(), state.data);
                let selection = addCircles (canvas, state.data, groupName);
                state.steps.forEach(item => item(selection));
            }
        };
    };

    const projectVisualiser = (canvas, groupName, dataBank) => {
        let radiusFunction = (d) => d.velocity - d.allocatedPoints;

        let state = {
            steps: [
                positionCircles(radiusFunction)
            ],
            data: [],
            sourceDataObject: dataBank.getReferenceTo(groupName),
            dataBank
        };

        return Object.assign(
            {},
            getter(state),
            plotter(state, canvas, groupName)
        );
    };

    const peopleVisualiser = (canvas, groupName, dataBank, mainPlotter) => {
        let radiusFunction = (d) => d.velocity;
        let state = {};
        let dragger = getDragger('projects', state, canvas);

        state.steps =  [
            positionCircles(radiusFunction),
            addClassFromProperty('field'),
            addDragger(dragger)
        ];
        state.data = [];
        state.sourceDataObject = dataBank.getReferenceTo(groupName);
        state.projects = dataBank.getReferenceTo('projects');

        state.collision = (item, collidedWith) => {
            assigner().assignToProject(item, collidedWith, state.projects);
            mainPlotter.plot('projects');
        };

        return Object.assign(
            {},
            plotter(state, canvas, groupName)
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
            adder(state),
            bulkPlotter(state)
        );
    };

    var dataBank = dataManager();
    dataBank.add(data.projects, 'projects');
    dataBank.add(data.people, 'people');

    var svg = createContainer();

    var visualisations = plotContainer();

    var projectVisualisation = projectVisualiser(svg, 'projects', dataBank);
    var peopleVisualisation = peopleVisualiser(svg, 'people', dataBank, visualisations);

    visualisations.add(projectVisualisation, 'projects');
    visualisations.add(peopleVisualisation, 'people');
    visualisations.plotAll();

})(window.d3, window._);
