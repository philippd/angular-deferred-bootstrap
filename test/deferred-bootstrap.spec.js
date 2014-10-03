'use strict';

// A jasmine 2.0 -like interface for async tests
function itAsync(title, func) {
  it(title, function () {
    var finished = false;

    function done() {
      finished = true;
    }

    func(done);

    waitsFor(function () {
      return finished === true;
    });
  });
}

/* global checkConfig, createInjector, isPromise, loadingClass, errorClass */
describe('deferredBootstrapper', function () {

  it('should provide bootstrap function', function () {
    expect(typeof window.deferredBootstrapper.bootstrap).toBe('function');
  });

  describe('bootstrap', function () {

    var bootstrap,
        bodyElement;
    var APP_NAME = 'testApp';

    beforeEach(function () {
      bootstrap = window.deferredBootstrapper.bootstrap;
      bodyElement = window.document.body;
    });

    itAsync('should inject $location', function (done) {
      bootstrap({
        element: bodyElement,
        module: APP_NAME,
        resolve: {
          LOCATION: function ($http, $q, $location) {
            var deferred = $q.defer();

            deferred.resolve($location);

            return deferred.promise;
          }
        }
      });

      angular.module(APP_NAME, [])
        .config(function (LOCATION) {
          expect(LOCATION).toBeDefined();

          done();
        });
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

    itAsync('should allow constants to be added to a specified module', function (done) {
      var appModule ='app.module',
        constantsModuleOne = 'app.constants.one',
        constantsModuleTwo = 'app.constants.two';

      angular.module(appModule, ['ng'])
        .config(function ($injector) {

          expect($injector.has('CONSTANTS_ONE_CONFIG')).toBe(false);
          expect($injector.has('CONSTANTS_ONE_MORE_CONFIG')).toBe(false);
          expect($injector.has('CONSTANTS_TWO_CONFIG')).toBe(false);

          done();
        });

      angular.module(constantsModuleOne, []);
      angular.module(constantsModuleTwo, []);

      bootstrap({
        element: bodyElement,
        module: appModule,
        moduleResolves: [
          {
            module: constantsModuleOne,
            resolve: {
              CONSTANTS_ONE_CONFIG: function ($q) {
                var deferred = $q.defer();

                deferred.resolve('foo');

                return deferred.promise;
              },
              CONSTANTS_ONE_MORE_CONFIG: function ($q) {
                var deferred = $q.defer();

                deferred.resolve('foo');

                return deferred.promise;
              }
            }
          },
          {
            module: constantsModuleTwo,
            resolve: {
              CONSTANTS_TWO_CONFIG: function ($q) {
                var deferred = $q.defer();

                deferred.resolve('foo');

                return deferred.promise;
              }
            }
          }
        ]
      }).then(function () {
        var constantsOneInjector = angular.injector([constantsModuleOne]),
          constantsTwoInjector = angular.injector([constantsModuleTwo]);

        expect(constantsOneInjector.has('CONSTANTS_ONE_CONFIG')).toBe(true);
        expect(constantsOneInjector.has('CONSTANTS_ONE_MORE_CONFIG')).toBe(true);
        expect(constantsOneInjector.has('CONSTANTS_TWO_CONFIG')).toBe(false);

        expect(constantsTwoInjector.has('CONSTANTS_ONE_CONFIG')).toBe(false);
        expect(constantsTwoInjector.has('CONSTANTS_ONE_MORE_CONFIG')).toBe(false);
        expect(constantsTwoInjector.has('CONSTANTS_TWO_CONFIG')).toBe(true);
        done();
      });
    });

    itAsync('should allow custom injector module(s) to be used to create the injector', function (done) {
      var customModuleName = 'custom.module';
      angular.module(customModuleName, ['ng'])
        .service('CustomService', ['$q', function ($q) {
          this.get = function () {
            var deferred = $q.defer();

            deferred.resolve('foo');

            return deferred.promise;
          };
        }]);

      var promise = bootstrap({
        element: bodyElement,
        module: APP_NAME,
        injectorModules: customModuleName,
        resolve: {
          CONFIG: ['CustomService', function (CustomService) {
            return CustomService.get();
          }]
        }
      });

      expect(isPromise(promise)).toBe(true);

      promise.then(function (result) {
        expect(result).toBe(true);

        done();
      });
    });

    itAsync('should allow to inject services from ng module even if custom modules dont list it as dependency', function (done) {
      var customModuleName = 'custom.module';
      angular.module(customModuleName, [])
        .service('CustomService', ['$q', function ($q) {
          this.get = function () {
            var deferred = $q.defer();

            deferred.resolve('foo');

            return deferred.promise;
          };
        }]);

      var promise = bootstrap({
        element: bodyElement,
        module: APP_NAME,
        injectorModules: customModuleName,
        resolve: {
          CONFIG: ['CustomService', '$timeout', function (CustomService, $timeout) {
            return $timeout(CustomService.get, 1);
          }]
        }
      });

      expect(isPromise(promise)).toBe(true);

      promise.then(function (result) {
        expect(result).toBe(true);

        done();
      });
    });

    itAsync('should use the default ngInjector if "ng" is specified as the injectorModules config option', function (done) {
      var promise = bootstrap({
        element: bodyElement,
        module: APP_NAME,
        injectorModules: ['ng'],
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

    describe('CSS class handling', function () {

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
          CONST: function () {
          }
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
          CONST: function () {
          }
        }
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.module\' must be a string.');
    });

    it('should throw if both resolve and moduleResolves are defined', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {
          }
        },
        moduleResolves: []
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('Bootstrap configuration can contain either \'resolve\' or \'moduleResolves\' but not both');
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

    it('should throw if bootstrapConfig is not an object', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {
          }
        },
        bootstrapConfig: 123
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.bootstrapConfig\' must be an object.');
    });

    it('should accept valid deferred bootstrap config with bootstrapConfig option', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {
          }
        },
        bootstrapConfig: {
          strictDi: true
        }
      };
      checkConfig(config);
    });

    it('should throw if moduleResolves is not an array', function () {
      var config = {
        element: {},
        module: 'myModule',
        moduleResolves: 1234
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.moduleResolves\' must be an array.');
    });

    it('should throw if a moduleResolve does not contain a module name', function () {
      var config = {
        element: {},
        module: 'myModule',
        moduleResolves: [{
          module: 'A.Test.Module',
          resolve: {}
        }, {
          resolve: {}
        }]
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('A \'moduleResolve\' configuration item must contain a \'module\' name.');
    });

    it('should throw if a moduleResolve does not contain a resolve block', function () {
      var config = {
        element: {},
        module: 'myModule',
        moduleResolves: [{
          module: 'A.Test.Module',
          resolve: {}
        }, {
          module: 'A.Test.Module'
        }]
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'moduleResolve.resolve\' must be an object.');
    });

    it('should throw if onError is defined but not a function', function () {
      var config = {
        element: {},
        module: 'myModule',
        resolve: {
          CONST: function () {
          }
        },
        onError: 'bla'
      };
      expect(function () {
        checkConfig(config);
      }).toThrow('\'config.onError\' must be a function.');
    });

  });

  describe('createInjector()', function () {
    var element;

    beforeEach(function () {
      angular.module('module1', []);
      angular.module('module2', []);
      element = angular.element('<div></div>');
    });

    it('should create injector with given module as string', function () {
      // given
      var modules = 'module1';
      spyOn(angular, 'injector').andCallThrough();

      // when
      createInjector(modules, element);
      var injectorModules = angular.injector.mostRecentCall.args[0];

      // then
      expect(injectorModules.indexOf('ng')).not.toBe(-1);
      expect(injectorModules.indexOf('module1')).not.toBe(-1);
    });

    it('should create injector with given modules as array', function () {
      // given
      var modules = ['module1', 'module2'];
      spyOn(angular, 'injector').andCallThrough();

      // when
      createInjector(modules, element);
      var injectorModules = angular.injector.mostRecentCall.args[0];

      // then
      expect(injectorModules.indexOf('ng')).not.toBe(-1);
      expect(injectorModules.indexOf('module1')).not.toBe(-1);
      expect(injectorModules.indexOf('module2')).not.toBe(-1);
    });

    it('should create injector with given element', function () {
      // given
      var modules = 'module1';
      spyOn(angular, 'injector').andCallThrough();

      // when
      createInjector(modules, element);

      // then
      expect(angular.injector).toHaveBeenCalledWith(jasmine.any(Object), element);
    });
  });

  describe('isPromise()', function () {

    it('should check if object is a promise', function () {
      var promise = {
        then: function () {
        }
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
