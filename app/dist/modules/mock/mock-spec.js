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
});