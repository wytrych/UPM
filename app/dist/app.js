'use strict';

(function (angular) {
  'use strict';

  // Declare app level module which depends on views, and components
  angular.module('app', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    var x = function x(a) {
      var y = arguments.length <= 1 || arguments[1] === undefined ? 12 : arguments[1];
      return a + y;
    };

    {
      var _x2 = 12;
    }
  }]);
})(window.angular);