define(function (require,exports,module) {
	exports.pagelet = {
		id:'content',
		defaultState:"content",
		model:{},
		states:{
			content:{view:"content.html"}
		}
	};
})