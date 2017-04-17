describe('Plotting steps module: ', () => {
    'use strict';
    var module;

    beforeEach(function () {
        module = window.modules.plottingSteps;
        var data = [
            {
                velocity: 10,
                x: 20,
                y: 30,
                className: 'someClass'
            }
        ];
        this.svg = d3.select('body').append('svg');

        this.selection = this.svg.selectAll('circle').data(data).enter().append('circle');
    });

    describe('positionCircles', () => {
        
        it('should set appropriate attributes on the circle elements', function () {
            this.radiusFunction = x => x.velocity;
            this.positioner = module.positionCircles(this.radiusFunction);
            this.positioner(this.selection);

            expect(d3.select(this.svg.selectAll('circle')[0][0]).attr('cx')).toBe('20');
            expect(d3.select(this.svg.selectAll('circle')[0][0]).attr('cy')).toBe('30');
            expect(d3.select(this.svg.selectAll('circle')[0][0]).attr('r')).toBe('10');

        });
        
        it('should accept a radius function', function () {
            this.radiusFunction = x => 3 * x.velocity;

            this.positioner = module.positionCircles(this.radiusFunction);
            this.positioner(this.selection);
            expect(d3.select(this.svg.selectAll('circle')[0][0]).attr('r')).toBe('30');
        });
        
    });

    describe('addClassFromProperty', () => {

        it('should add a class to the selection based on the argument', function () {
            
            var classAdder = module.addClassFromProperty('className');
            classAdder(this.selection);
            expect(d3.select(this.svg.selectAll('circle')[0][0]).attr('class')).toBe(' someClass');
        });
        
    });

});
