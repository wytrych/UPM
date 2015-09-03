'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

var host = 'http://localhost:8000/app/';

describe('my app', function() {

	it('should open the webpage', function () {
		browser.get(host);
		expect($('h1').getText()).toBe('Hello');
	});

});
