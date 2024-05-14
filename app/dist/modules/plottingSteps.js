"use strict";

define(function () {

    'use strict';

    var positionCircles = function positionCircles(radiusFunction) {
        return function (selection) {
            selection.each(function (d) {
                d.r = radiusFunction(d);
                d3.select(this).attr("r", d.r).attr("cx", d.x).attr("cy", d.y);
            });
        };
    };

    var addDragger = function addDragger(dragger) {
        return function (selection) {
            selection.each(function (d) {
                d3.select(this).call(dragger);
            });
        };
    };

    var addClassFromProperty = function addClassFromProperty(property) {
        return function (selection) {
            selection.each(function (d) {
                var element = d3.select(this);
                var currentClass = element.attr('class') || '';

                element.attr('class', currentClass + " " + d[property]);
            });
        };
    };

    return {
        positionCircles: positionCircles,
        addDragger: addDragger,
        addClassFromProperty: addClassFromProperty
    };
}, 'plottingSteps');