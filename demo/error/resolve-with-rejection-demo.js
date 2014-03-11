'use strict';

window.asyncBootstrapper.bootstrap({
  element: window.document.body,
  module: 'demoApp',
  resolve: {
    ERROR: function ($http, $q, injector) {
      var deferred = $q.defer(), $timeout = injector.get('$timeout');
      $timeout(function () {
        deferred.reject('EXCEPTION');
      }, 2000);
      return deferred.promise;
    }
  }
});

angular.module('demoApp', [])
  .config(function (ERROR) {
    console.log('in config() - ERROR: ' + JSON.stringify(ERROR));
  })
  .controller('AppController', function ($scope, ERROR) {
    $scope.value = ERROR;
  });