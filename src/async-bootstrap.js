'use strict';

window.asyncBootstrap = function (element, module, callback) {
  var injector = angular.injector(['ng']);
  var $http = injector.get('$http');
  callback($http).then(function (response) {
    console.log('config loaded');
    angular.module(module).constant('STARTUP_CONFIG', response.data);
    angular.bootstrap(element, [module]);
  });
};
