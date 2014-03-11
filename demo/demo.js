'use strict';

window.asyncBootstrap(window.document.body, 'demoApp', function($http) {
  return $http.get('/api/demo-config');
});

angular.module('demoApp', [])
  .config(function (STARTUP_CONFIG) {
    console.log('in config - ' + JSON.stringify(STARTUP_CONFIG));
  })
  .run(function (STARTUP_CONFIG) {
    console.log('in run - ' + JSON.stringify(STARTUP_CONFIG));
  })
  .controller('AppController', function ($scope, STARTUP_CONFIG) {
    $scope.value = STARTUP_CONFIG.name;
  });