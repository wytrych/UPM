define(() => {

    'use strict';

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
});
