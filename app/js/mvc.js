define(function (require,exports,module) {
	var sibojs = this.sibojs||{};
	exports.init = function  (config) {
		var frameworkModules = 	['sibo.directives','sibo.services'],dependencies=[],appInjector;
		if(config){
			dependencies = config.dependencies||{};
		}
		_loadFrameWorkModule();
		dependencies = _.union(frameworkModules, dependencies);
		$(function(){
			appInjector = _bootStrapAngular(dependencies);
			sibojs.appRootScope = appInjector.get("$rootScope");
			pageletEvent = require("./pageletEvent");
			pageletEvent.setAppRootScope(sibojs.appRootScope);
		});		
	}
	exports.appRootScope = sibojs.appRootScope;
	function _bootStrapAngular(dependencies){
		var app = angular.module("sibo.mvc",dependencies);
		return angular.bootstrap(document,["sibo.mvc"]);
	}
	function _loadFrameWorkModule(){
		require("./services");
		require("./directives");
	}
})