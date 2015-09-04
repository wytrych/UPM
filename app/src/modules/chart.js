(function (d3) {
	'use strict';

	var height = 500;
	var width = 500;

	var graph = {
		nodes: [
			{ x:   30, y: 40 },
			{ x:   80, y: 10 },
			{ x:   130, y: 90 },
			{ x:   230, y: 300 }
		],
		links: [
			{ source: 0, target: 1 },
			{ source: 0, target: 2 },
			{ source: 0, target: 3 }
		]
	};

	var nodes = graph.nodes;
	var links = graph.links;

	var svg = d3.select('main').append('svg')
	    .attr('width', width)
	    .attr('height', height);

	var force = d3.layout.force()
	    .size([width, height])
	    .nodes(nodes)
	    .links(links);

	force.linkDistance(100);
	force.linkStrength(1);
	force.charge(-800);

	var link = svg.selectAll('.link')
	    .data(links)
	    .enter().append('line.link')
	    .attr('x1', d3.f('source', 'x'))
	    .attr('y1', d3.f('source', 'y'))
	    .attr('x2', d3.f('target', 'x'))
	    .attr('y2', d3.f('target', 'y'));

	var node = svg.selectAll('.node')
	    .data(nodes)
	    .enter().append('circle.node')
		.attr('r', width/25)
		.attr('cx', d3.f('x'))
		.attr('cy', d3.f('y'));

	var animating = true;
	var animationStep = 200;

//	force.on('tick', function() {
//		node.transition().ease('linear').duration(animationStep)
//			.attr('cx', d3.f('x'))
//			.attr('cy', d3.f('y'));
//
//		link.transition().ease('linear').duration(animationStep)
//			.attr('x1', d3.f('source', 'x'))
//			.attr('y1', d3.f('source', 'y'))
//			.attr('x2', d3.f('target', 'x'))
//			.attr('y2', d3.f('target', 'y'));
//
//		force.stop();
//
//		if (animating) {
//			setTimeout(function() { force.start() }, animationStep);
//		}
//	});
//
	force.on('end', function() {
		node
			.attr('r', width/25)
			.attr('cx', d3.f('x'))
			.attr('cy', d3.f('y'));


	    link
		.attr('x1', d3.f('source', 'x'))
		.attr('y1', d3.f('source', 'y'))
		.attr('x2', d3.f('target', 'x'))
		.attr('y2', d3.f('target', 'y'));
	});

	force.start();

})(window.d3);
