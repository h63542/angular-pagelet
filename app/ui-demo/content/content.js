define(function (require,exports,module) {
	exports.pagelet = {
		id:'content',
		defaultState:"content",
		model:{},
		template:"content.html",
		states:{
			content:{view:"content.html",onParamUpdate:onParamUpdate},
			date:{view:"../components/Date.html",onParamUpdate:onParamUpdate},
			markdown:{view:"../components/markdown.html"}
		},
		events:{
			testEvnetId:function(event){
				console.info(arguments);
			}
		}
	};
	function onParamUpdate(scope,oldParam,newParam){
		console.info(scope);
		console.info(newParam);
	}
})