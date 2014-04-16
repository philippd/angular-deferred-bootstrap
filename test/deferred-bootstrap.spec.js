'use strict';

/* global checkConfig, isPromise */
describe('deferredBootstrapper', function () {

  it('should provide bootstrap function', function () {
    expect(typeof window.deferredBootstrapper.bootstrap).toBe('function');
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
