# angular-async-bootstrap [![Build Status](https://travis-ci.org/philippd/angular-async-bootstrap.png?branch=master)](https://travis-ci.org/philippd/angular-async-bootstrap)

> Bootstrap AngularJS apps with async config.

## Install

#### [Bower](http://bower.io)

```
bower install --save angular-async-bootstrap
```

## Use

Instead of using the ng-app directive or angular.bootstrap(), use the asyncBootstrapper to initialize your app:
```js
asyncBootstrapper.bootstrap({
  element: document.body,
  module: 'MyApp',
  resolve: {
    APP_CONFIG: function ($http) {
      return $http.get('/api/demo-config');
    }
  }
});
```

This will make the response of your $http call available as a constant to your AngularJS app. This means you can now use dependency injection to access the APP_CONFIG wherever you need it in your app (even in config() blocks!).
```js
angular.module('MyApp', [])
  .config(function (APP_CONFIG) {
    console.log('APP_CONFIG is: ' + JSON.stringify(APP_CONFIG));
  })
```

## Error handling
TODO

## Advanced configuration
TODO

## Testing
TODO

## License

[MIT](http://opensource.org/licenses/MIT) © Philipp Denzler
