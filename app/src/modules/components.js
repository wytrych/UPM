define(() => {

    'use strict';

    const adder = (state, dataParser = data => data) => ({
        add: (data, type) => {
            if (typeof state.dataObjects[type] !== 'undefined') {
                let error = 'Object of this type already exists.';
                console.error(error);
                throw new Error (error);
            }

            state.dataObjects[type] = dataParser(data);
        }
    });

    const objectGetter = (state, property) => ({
        getReferenceTo: (type) => state[property][type]
    });

    const getter = (state, property = 'data') => ({
        getData: () => JSON.parse(JSON.stringify(state[property]))
    });

    const allocator = (state) => ({
        allocatePoints: (name, points) => {
            let target = _.find(state.data, (item) => item.name === name);

            if (!target) {
                let message = `Target "${name}" doesn't exist.`;
                console.error(message);
                throw new Error(message);
            } else {
                target.allocatedPoints += points;
            }
        }
    });

    const assigner = () => ({
        assignToProject: (person, newProject, targetContainer) => {
            let previousProject;

            if (person.project) {
                previousProject = person.project;
                person.project = '';
            }

            if (previousProject) {
                targetContainer.allocatePoints(previousProject, -person.velocity);
            }

            if (newProject) {
                person.project = newProject.name;
                targetContainer.allocatePoints(newProject.name, person.velocity);
            }

        }
    });

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
                .append('circle')
                .classed(groupName, true);

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

    return {
        adder,
        objectGetter,
        getter,
        allocator,
        assigner,
        plotter
    };
}, 'components');
