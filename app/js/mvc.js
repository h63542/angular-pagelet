define(function (require,exports,module) {
	exports.init = function  (config) {
		var frameworkModules = 	['sibo.directives','sibo.services'],dependencies=[];
		if(config){
			dependencies = config.dependencies||{};
		}
		_loadFrameWorkModule();
		dependencies = _.union(frameworkModules, dependencies);
		$(function(){
			_bootStrapAngular(dependencies);
		});		
	}
	function _bootStrapAngular(dependencies){
		var app = angular.module("sibo.mvc",dependencies);
		angular.bootstrap(document,["sibo.mvc"]);
	}
	function _loadFrameWorkModule(){
		require("./services");
		require("./directives");
	}
})