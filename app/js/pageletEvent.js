define(function (require,exports,module) {
	var appRootScope;
	exports.setAppRootScope = function(rootScope){
		appRootScope = rootScope;
	};
	exports.sendPageLetEvent = function(pageletId,evnetId,event){
		if(appRootScope){
			appRootScope.$broadcast(pageletId+"."+evnetId, event);
		}
	};
})