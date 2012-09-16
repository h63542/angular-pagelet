define(function (require,exports,module) {
	exports.pagelet = {
		id:'apibar',
		defaultState:"api_bar",
		model:{},
		states:{
			api_bar:{view:"bar.html"}
		}
	};
})