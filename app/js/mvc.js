define(function (require,exports,module) {
	exports.init = function  (config) {
		var frameworkModules = 	['sibo.directives','sibo.services'],dependencies;
		_loadFrameWorkModule();
		if(config && angular.isArray(config.dependencies)){
			dependencies = angular.copy(frameworkModules, (config.dependencies||[]));
		}
		$(function(){
			_bootStrapAngular(dependencies);
		});		
	}
	function _bootStrapAngular(dependencies){
		var app = angular.module("sibo.mvc",['sibo.directives','sibo.services']);
		angular.bootstrap(document,["sibo.mvc"]);
	}
	function _loadFrameWorkModule(){
		require("./services");
		require("./directives");
	}
})