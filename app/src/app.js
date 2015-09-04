(function (angular) {
 'use strict';

 // Declare app level module which depends on views, and components
 angular.module('app', [
	 'ngRoute'
 ]).
 config(['$routeProvider', function($routeProvider) {
	var x = (a, y=12) => a + y;

	{
		let x = 12;
	}
		
 }])
})(window.angular);
