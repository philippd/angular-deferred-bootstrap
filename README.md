# angular-deferred-bootstrap

[![Build Status](https://travis-ci.org/philippd/angular-deferred-bootstrap.svg?branch=master)](https://travis-ci.org/philippd/angular-deferred-bootstrap) [![Coverage Status](https://img.shields.io/coveralls/philippd/angular-deferred-bootstrap.svg)](https://coveralls.io/r/philippd/angular-deferred-bootstrap?branch=master)[![NPM version](https://badge.fury.io/js/angular-deferred-bootstrap.svg)](http://badge.fury.io/js/angular-deferred-bootstrap)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/philippd/angular-deferred-bootstrap?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Initialize your AngularJS app with constants loaded from the back-end.

This component provides a global resolve function for your app. It works similar to the resolve functions you may know from ngRoute or ui-router: You define what needs to be loaded from the back-end before your application can be started and the deferred bootstrapper takes care of loading the data and bootstrapping the application.

- [Install](#user-content-install)
- [Usage](#user-content-usage)
- [Loading and error indicators](#user-content-loading-and-error-indicators)
- [Advanced usage](#user-content-advanced-usage)
- [Attach constants to specific modules](#user-content-attach-constants-to-specific-modules)
- [Custom injector modules](#user-content-custom-injector-modules)
- [Bootstrap Config and StrictDi](#user-content-bootstrap-config-and-strictdi)
- [Testing](#user-content-testing)
- [License](#user-content-license)

## Install

#### [Bower](http://bower.io)

```
bower install --save angular-deferred-bootstrap
```


#### [npm](http://www.npmjs.com)

```
npm install angular-deferred-bootstrap
```

#### [jspm](http://jspm.io)

```
jspm install angular-deferred-bootstrap
```

## Usage

Instead of using the ```ng-app``` directive or ```angular.bootstrap()```, use the ```deferredBootstrapper``` to initialize your app:
```js
deferredBootstrapper.bootstrap({
  element: document.body,
  module: 'MyApp',
  resolve: {
    APP_CONFIG: ['$http', function ($http) {
      return $http.get('/api/demo-config');
    }]
  }
});
```

This will make the response of your ```$http``` call available as a constant to your AngularJS app. This means you can now use dependency injection to access the ```APP_CONFIG``` wherever you need it in your app (even in ```config()``` blocks!).
```js
angular.module('MyApp', [])
  .config(function (APP_CONFIG) {
    console.log('APP_CONFIG is: ' + JSON.stringify(APP_CONFIG));
  })
```

## Loading and error indicators
To make it possible to conditionally show a loading indicator or an error message when the initialization fails, the following CSS classes are set on the HTML body:

* **deferred-bootstrap-loading** while the data is loading
* **deferred-bootstrap-error** if an error occurs in a resolve function and the app can not be bootstrapped

Have a look at the demo pages to see this in action.

## Advanced usage
You can have multiple constants resolved for your app and you can do in the resolve function whatever is necessary before the app is started. The only constraint is, that the function has to return a promise.

To handle exceptions when the promises are resolved, you can add an ```onError``` function to the configuration object.

Example:
```js
deferredBootstrapper.bootstrap({
  element: document.body,
  module: 'MyApp',
  resolve: {
    APP_CONFIG: ['$http', function ($http) {
      return $http.get('/api/demo-config');
    }],
    OTHER_CONSTANT: ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve('MyConstant');
      }, 2000);
      return deferred.promise;
    }]
  },
  onError: function (error) {
	alert('Could not bootstrap, error: ' + error);
  }
});
```

## Attach constants to specific modules
By default, any constants specified in the ```resolve``` object will be attached to the module specified in the ```module``` option. If you have a need to attach constants to different modules then this can be achieved by using  ```moduleResolves```:

```js
window.deferredBootstrapper.bootstrap({
        element: document.body,
        module: 'myApp',
        moduleResolves: [
            {
                module: 'myApp.settings',
                resolve: {
                    CONSTANT_ONE: ['$http', function ($http) {
                        return $http.get();
                    }],
                    CONSTANT_TWO: ['$http', function ($http) {
                        return $http.get();
                    }]
                }
            },
            {
                module: 'myApp.moreSettings',
                resolve: {
                    CONSTANT_THREE: ['$http', function ($http) {
                        return $http.get();
                    }]
                }
            }
        ]
    })
```

In the above example, ```CONSTANT_ONE``` and ```CONSTANT_TWO``` will be added to the ```'myApp.settings'``` module and ```CONSTANT_THREE``` will be added to the ```'myApp.moreSettings'``` module. There are no limits on how many ```moduleResolve``` objects you create and also no limit on the number of constants per ```moduleResolve```

**Note** that only ```resolve``` or ```moduleResolves``` can be used - using both in the same configuration will throw an exception

## Custom injector modules
By default, the injector that calls your resolve functions only provides the services from the AngularJS core module ```ng```. If you have a use case where you want to use one of your existing services to get configuration at bootstrap time, you can specify which modules should be made available and inject services from those modules in the resolve function. An example is below:

```js
deferredBootstrapper.bootstrap({
        element: document.body,
        module: 'myApp',
        injectorModules: 'myApp.settings',
        resolve: {
            SETTINGS: ['SettingsService', function (SettingsService) {
                return SettingsService.get('/settings');
            }]
        }
    });
```

The ```injectorModules``` option can also take an array of modules. If you have multiple services spread across different modules you can also inject them:

```js
deferredBootstrapper.bootstrap({
        element: document.body,
        module: 'myApp',
        injectorModules: ['myApp.settings', 'myApp.foo']
        resolve: {
            SETTINGS: ['SettingsService', function (SettingsService) {
                return SettingsService.get('/settings');
            }],
            FOO: ['FooService', function (FooService) {
                return FooService.get('/foo');
            }]
        }
    });
```

**Note** that the services which are injected in your resolve functions will be instantiated again when the actual app starts. This means you can not save any state in your services in the resolve functions.


## Bootstrap Config and StrictDi
To set the AngularJS ```strictDi``` mode, or any future ```angular.boostrap``` config parameters, pass in an optional config object called ```bootstrapConfig```:
```js
deferredBootstrapper.bootstrap({
  element: document.body,
  module: 'MyApp',
  bootstrapConfig: {
    strictDi: true
  },
  resolve: {
    APP_CONFIG: ['$http', function ($http) {
      return $http.get('/api/demo-config');
    }]
  }
});
```

## Testing
Since the constants that deferredBootstrapper adds to your applications module are not available in your unit tests, it makes sense to provide them in a global beforeEach():
```js
beforeEach(function () {
  module(function ($provide) {
    $provide.constant('APP_CONFIG', { someUrl: '/dummyValue' });
  });
});
```

## License

[MIT](http://opensource.org/licenses/MIT) © Philipp Denzler
