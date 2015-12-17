# Changelog

## 0.1.9 - 2015-12-17
- Fixed broken support for AMD modules

## 0.1.8 - 2015-12-15
- Add support for CommonJS and AMD modules

## 0.1.7 - 2015-05-09
- Add JSPM support

## 0.1.6 - 2015-04-09
- Remove error class after successful bootstrap, fixes [#32](https://github.com/philippd/angular-deferred-bootstrap/issues/32)

## 0.1.5 - 2014-10-08
- Fixed call of resolve function to not fail if angular.forEach passes the object as third argument in each iteration (Angular > 1.3.0-rc.1), see [#20](https://github.com/philippd/angular-deferred-bootstrap/issues/20)
- Pass additional configuration to bootstrap the AngularJS app (for example ```strictDi``` mode), implemented by [@jeffsheets](https://github.com/jeffsheets), see [#23](https://github.com/philippd/angular-deferred-bootstrap/pull/23)

## 0.1.4 - 2014-10-03
- Improved injector creation to allow injecting services depending on the $rootElement, implemented by [@B8li](https://github.com/B8li), see [#22](https://github.com/philippd/angular-deferred-bootstrap/pull/22)

## 0.1.3 - 2014-08-08
- Fixed bug that the resolve function was called twice during bootstrapping, see aea0e2058e3c5bb881a92a1b3c277e4f0aed6dc5

## 0.1.2 - 2014-08-04
- Added ability to specify which module a constant is added to, implemented by [@Shepless](https://github.com/Shepless), see [#16](https://github.com/philippd/angular-deferred-bootstrap/pull/16)

## 0.1.1 - 2014-07-04
- always add ```ng``` to the initial injector which is used during bootstrapping, see [#15](https://github.com/philippd/angular-deferred-bootstrap/issues/15)

## 0.1.0 - 2014-06-10
- the resolve functions can now use dependency injection to access services from the AngularJS core
- BREAKING: the resolve functions can NOT anymore directly get access to the 'injector' (which is also not needed anymore) -> check the updated demos and the docs
- the bootstrap configuration takes a new argument 'injectorModules' where the modules which should be made available to the resolve functions can be specified, thanks [@Shepless](https://github.com/Shepless), see: [#11](https://github.com/philippd/angular-deferred-bootstrap/pull/11)

## 0.0.5 - 2014-04-22
- bootstrap() now returns a promise, thanks [@harriha](https://github.com/harriha)
- fixed [#9](https://github.com/philippd/angular-deferred-bootstrap/issues/9): Loading/error CSS classes didn't work if the script was loaded in <head>, thanks [@harriha](https://github.com/harriha)

## 0.0.4 - 2014-04-16
- add onError to allow custom error handling, closes [#1](https://github.com/philippd/angular-deferred-bootstrap/issues/1)

## 0.0.3 - 2014-04-15
- remove loading class after angular app is bootstrapped, fixes [#7](https://github.com/philippd/angular-deferred-bootstrap/issues/7)

## 0.0.2 - 2014-04-15
- add support for IE8 ([#8](https://github.com/philippd/angular-deferred-bootstrap/pull/6)), fixes [#5](https://github.com/philippd/angular-deferred-bootstrap/issues/5)
