# Changelog

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
