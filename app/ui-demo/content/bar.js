define(function (require,exports,module) {
	exports.pagelet = {
		id:'apibar',
		defaultState:"api-bar",
		model:{},
		states:{
			api-bar:{view:"/ui-demo/content/bar.html"}
		}
	};
})