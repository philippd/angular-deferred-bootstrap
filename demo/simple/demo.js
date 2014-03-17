'use strict';

window.deferredBootstrapper.bootstrap({
  element: window.document.body,
  module: 'demoApp',
  resolve: {
    STARTUP_CONFIG: function ($http) {
      return $http.get('/api/demo-config');
    }
  }
});

angular.module('demoApp', [])
  .config(function (STARTUP_CONFIG) {
    console.log('in config() - STARTUP_CONFIG: ' + JSON.stringify(STARTUP_CONFIG));
  })
  .run(function (STARTUP_CONFIG) {
    console.log('in run() - STARTUP_CONFIG: ' + JSON.stringify(STARTUP_CONFIG));
  })
  .controller('AppController', function ($scope, STARTUP_CONFIG) {
    $scope.value = STARTUP_CONFIG.name;
  });
