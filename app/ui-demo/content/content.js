define(function (require,exports,module) {
	exports.pagelet = {
		id:'content',
		defaultState:"content",
		model:{},
		states:{
			content:{view:"content.html"},
			date:{view:"../components/Date.html"},
			markdown:{view:"../components/markdown.html"}
		},
		events:{
			testEvnetId:function(event){
				console.info(arguments);
			}
		}
	};
})