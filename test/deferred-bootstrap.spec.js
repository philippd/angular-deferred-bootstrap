'use strict';

// A jasmine 2.0 -like interface for async tests
function itAsync(title, func) {
  it(title, function() {
    var finished = false;

    function done() {
      finished = true;
    }

    func(done);

    waitsFor(function() {
      return finished === true;
    });
  });
}

/* global checkConfig, isPromise, loadingClass, errorClass */
describe('deferredBootstrapper', function () {

  it('should provide bootstrap function', function () {
    expect(typeof window.deferredBootstrapper.bootstrap).toBe('function');
  });

  describe('bootstrap', function () {

    var bootstrap,
        bodyElement;
    var APP_NAME = 'testApp';

    beforeEach(function() {
      bootstrap = window.deferredBootstrapper.bootstrap;
      bodyElement = window.document.body;
    });

    itAsync('should resolve with the value returned from the defined constant', function (done) {
      bootstrap({
        element: bodyElement,
        module: APP_NAME,
        resolve: {
          CONFIG: function ($http, $q) {
            var deferred = $q.defer();

            deferred.resolve('foo');

            return deferred.promise;
          }
        }
      });

      angular.module(APP_NAME, [])
        .config(function (CONFIG) {
          expect(CONFIG).toBe('foo');

          done();
        });
    });

    itAsync('should return a Promise which resolves with `true` in success case', function (done) {
      var promise = bootstrap({
        element: bodyElement,
        module: APP_NAME,
        resolve: {
          CONFIG: function ($http, $q) {
            var deferred = $q.defer();

            deferred.resolve('foo');

            return deferred.promise;
          }
        }
      });

      expect(isPromise(promise)).toBe(true);

      promise.then(function (result) {
          expect(result).toBe(true);

          done();
        });
    });

    describe('CSS class handling', function() {

      itAsync('should add loading class immediately and remove it when resolved', function (done) {
        var promise = bootstrap({
          element: window.document.body,
          module: APP_NAME,
          resolve: {
            CONFIG: function ($http, $q) {
              expect(bodyElement.classList.contains(loadingClass)).toBe(true);

              var deferred = $q.defer();

              deferred.resolve('foo');

              return deferred.promise;
            }
          }
        });

        angular.module(APP_NAME, [])
          .config(function () {
            // Yep, it's still there at this point
            expect(bodyElement.classList.contains(loadingClass)).toBe(true);
          });

        promise.then(function () {
          expect(bodyElement.classList.contains(loadingClass)).toBe(false);

          done();
        });
      });

      itAsync('should add error class in case Promise resolves to an error', function (done) {
        bootstrap({
          element: window.document.body,
          module: APP_NAME,
          resolve: {
            CONFIG: function ($http, $q) {
              expect(bodyElement.classList.contains(errorClass)).toBe(false);

              var deferred = $q.defer();

              deferred.reject(new Error('bar'));

              return deferred.promise;
            }
          },
          onError: function (/* err */) {
            expect(bodyElement.classList.contains(errorClass)).toBe(true);

            done();
          }
        });
      });

    });

  });

  describe('checkConfig()', function () {

    it('should accept valid deferred bootstrap config', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {}
        }
      };
      checkConfig(config);
    });

    it('should throw if config is not an object', function () {
      var config = 12;
      expect(function () {
        checkConfig(config);
      }).toThrow('Bootstrap configuration must be an object.');
    });

    it('should throw if module is not a string', function () {
      var config = {
        element: {},
        module: [],
        resolve: {
          CONST: function () {}
        }
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.module\' must be a string.');
    });

    it('should throw if resolve is not an object', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: 123
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.resolve\' must be an object.');
    });

    it('should throw if onError is defined but not a function', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {}
        },
        onError: 'bla'
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.onError\' must be a function.');
    });

  });

  describe('isPromise()', function () {

    it('should check if object is a promise', function () {
      var promise = {
        then: function () {}
      };
      expect(isPromise(promise)).toBe(true);
    });

    it('should detect if object is not a promise', function () {
      expect(isPromise({})).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise(null)).toBe(false);
    });
  });

});
