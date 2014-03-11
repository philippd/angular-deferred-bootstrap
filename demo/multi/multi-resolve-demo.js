'use strict';

window.asyncBootstrapper.bootstrap({
  element: window.document.body,
  module: 'demoApp',
  resolve: {
    STARTUP_CONFIG: function ($http) {
      return $http.get('/api/demo-config');
    },
    OTHER_CONFIG: function ($http) {
      return $http.get('/api/demo-config-2');
    },
    USING_Q: function ($http, $q, injector) {
      var deferred = $q.defer(), $timeout = injector.get('$timeout');
      $timeout(function () {
        deferred.resolve('MyConstant');
      }, 2000);
      return deferred.promise;
    }
  }
});

angular.module('demoApp', [])
  .config(function (STARTUP_CONFIG, OTHER_CONFIG, USING_Q) {
    console.log('in config() - STARTUP_CONFIG: ' + JSON.stringify(STARTUP_CONFIG));
    console.log('in config() - OTHER_CONFIG: ' + JSON.stringify(OTHER_CONFIG));
    console.log('in config() - USING_Q: ' + USING_Q);
  })
  .run(function (STARTUP_CONFIG) {
    console.log('in run() - STARTUP_CONFIG: ' + JSON.stringify(STARTUP_CONFIG));
  })
  .controller('AppController', function ($scope, STARTUP_CONFIG) {
    $scope.value = STARTUP_CONFIG.name;
  });