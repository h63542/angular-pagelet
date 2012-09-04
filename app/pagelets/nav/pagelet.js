define(function (require,exports,module) {
	var navModel = {};
	exports.pagelet = {
		id:'nav',
		defaultState:"accordion",
		model:navModel,
		states:{
			accordion:{view:'pagelets/nav/accordion.html',controller:AccordionController},
			tree:{view:'pagelets/nav/accordion.html',controller:TreeController}
		}
	};
	function AccordionController($scope){

	}
	function TreeController($scope){

	}
})