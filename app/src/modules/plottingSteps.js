define(() => {

    'use strict';

    const positionCircles = (radiusFunction) => 
        (selection) => {
            //console.log(selection);
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
                let currentClass = element.attr('class') || '';

                element.attr('class', `${currentClass} ${d[property]}`);
            });
        };

    return {
        positionCircles,
        addDragger,
        addClassFromProperty
    };

}, 'plottingSteps');
