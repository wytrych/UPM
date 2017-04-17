'use strict';

define(function (require) {

    'use strict';

    var d3 = require('d3');

    var getDragger = function getDragger(targetGroup, state, container) {

        var dragstop = function dragstop(item) {
            var nodes = [item];
            container.selectAll('.' + targetGroup).each(function (d) {
                nodes.push(d);
            });
            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            var collidedWith = {};

            while (++i < n) {
                q.visit(collide(nodes[i], collidedWith));
            }

            state.collision(item, collidedWith);
        };

        var collide = function collide(node, collidedWith) {
            var r = node.r + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function (quad, x1, y1, x2, y2) {
                if (quad.point && quad.point !== node) {
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

        var dragmove = function dragmove(d) {
            /* jshint validthis: true */
            d3.select(this)
            /* jshint validthis: false */
            .attr("cx", d3.event.x).attr("cy", d3.event.y);

            d.x = d3.event.x;
            d.y = d3.event.y;
        };

        return d3.behavior.drag().on("drag", dragmove).on("dragend", dragstop);
    };

    var createContainer = function createContainer() {
        var width = arguments.length <= 0 || arguments[0] === undefined ? 540 : arguments[0];
        var height = arguments.length <= 1 || arguments[1] === undefined ? 425 : arguments[1];
        return d3.select("body").append("svg").attr("width", width).attr("height", height);
    };

    return {
        getDragger: getDragger,
        createContainer: createContainer
    };
});