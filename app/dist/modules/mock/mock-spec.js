'use strict';

describe('Components module: ', function () {
    'use strict';
    var module;

    beforeEach(function () {
        module = window.modules.components;
    });

    describe('adder', function () {

        it('should allow to add an item to the constructor state object', function () {
            var state = {
                dataObjects: {}
            };

            var anAdder = module.adder(state);

            anAdder.add('aString', 'newType');

            expect(state.dataObjects.newType).toBe('aString');
        });

        it('should accept a data parser argument', function () {
            var state = {
                dataObjects: {}
            };

            var parser = function parser(data) {
                return data + ' parsed';
            };

            var anAdder = module.adder(state, parser);

            anAdder.add('aString', 'newType');

            expect(state.dataObjects.newType).toBe('aString parsed');
        });

        it('should throw an error if namespace is already in use', function () {

            var state = {
                dataObjects: {
                    newType: 'aString'
                }
            };

            var anAdder = module.adder(state);

            expect(function () {
                anAdder.add('aString', 'newType');
            }).toThrow();
        });
    });

    describe('objectGetter', function () {
        it('should return a reference to an object', function () {
            var state = {
                container: {
                    anObject: {}
                }
            };

            var objectGetter = module.objectGetter(state, 'container');

            expect(objectGetter.getReferenceTo('anObject')).toBe(state.container.anObject);
        });
    });

    describe('getter', function () {
        it('should return a copy of an object', function () {
            var state = {
                container: {
                    anObject: {}
                }
            };

            var getter = module.getter(state, 'container');

            expect(getter.getData()).not.toBe(state.container);
            expect(getter.getData()).toEqual(state.container);
        });
    });

    describe('allocator', function () {
        it('should add points to a target object', function () {
            var state = {
                data: {
                    target: {
                        name: 'me',
                        allocatedPoints: 15
                    }
                }
            };

            var allocator = module.allocator(state);

            allocator.allocatePoints('me', 10);

            expect(state.data.target.allocatedPoints).toBe(15 + 10);
        });

        it('should throw if target doesnt exist', function () {
            var state = {
                data: {
                    target: {
                        name: 'notMe',
                        allocatedPoints: 15
                    }
                }
            };

            var allocator = module.allocator(state);

            expect(function () {
                allocator.allocatePoints('me', 10);
            }).toThrow();
        });
    });

    describe('assigner', function () {
        beforeEach(function () {
            this.person = {
                velocity: 12
            };
            this.newProject = {
                name: 'projectA'
            };

            this.state = {
                data: {
                    project: {
                        name: 'projectA',
                        allocatedPoints: 18
                    }
                }
            };

            this.targetContainer = module.allocator(this.state);

            this.assigner = module.assigner();
        });

        it('should assign a person to a project', function () {

            this.assigner.assignToProject(this.person, this.newProject, this.targetContainer);

            expect(this.state.data.project.allocatedPoints).toBe(30);
            expect(this.person.project).toBe('projectA');
        });

        it('should deassign from an old project when no new one is given', function () {
            this.person.project = 'projectA';

            this.assigner.assignToProject(this.person, undefined, this.targetContainer);

            expect(this.state.data.project.allocatedPoints).toBe(6);
            expect(this.person.project).toBe('');
        });
    });

    describe('plotter', function () {
        beforeEach(function () {
            this.canvas = d3.select('body').append('svg');
            this.groupName = 'group';
            this.state = {
                sourceDataObject: {
                    getData: function getData() {
                        return [{ name: 'item' }];
                    }
                },
                data: [{
                    name: 'item'
                }],
                steps: [function (x) {
                    return x;
                }]
            };
            this.plotter = module.plotter(this.state, this.canvas, this.groupName);
        });

        it('should create coordinates for data points that dont have them', function () {

            expect(this.state.data[0].x).toBeUndefined();
            expect(this.state.data[0].y).toBeUndefined();

            this.plotter.plot();

            expect(this.state.data[0].x).toEqual(jasmine.any(Number));
            expect(this.state.data[0].y).toEqual(jasmine.any(Number));
        });

        it('shouldnt change the coordinates for data point that already have them', function () {

            this.state.data[0].x = 100;
            this.state.data[0].y = 200;

            this.plotter.plot();

            expect(this.state.data[0].x).toBe(100);
            expect(this.state.data[0].y).toBe(200);
        });

        it('should create svg circles for each data point', function () {

            expect(this.canvas.selectAll('circle.group')[0].length).toBe(0);

            this.plotter.plot();

            expect(this.canvas.selectAll('circle.group')[0].length).toBe(1);
        });

        it('should call all provided steps', function () {
            this.state.steps = [jasmine.createSpy('step1'), jasmine.createSpy('step2')];

            this.plotter.plot();

            var selection = this.canvas.selectAll('circle.group');

            expect(this.state.steps[0]).toHaveBeenCalled();
            expect(this.state.steps[1]).toHaveBeenCalled();
        });
    });
});