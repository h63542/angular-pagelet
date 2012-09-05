define(function (require,exports,module) {
	var navModel = {codeMirrorModel:  "var helloWorld = 'Success!';"}  ;

	//$scope.codeMirrorModel = "var helloWorld = 'Success!';";
	exports.pagelet = {
		id:'nav',
		defaultState:"accordion",
		model:navModel,
		states:{
			accordion:{view:'nav/accordion.html',controller:AccordionController},
			tree:{view:'nav/tree.html',controller:TreeController}
		}
	};
	function AccordionController($scope){

	}
	function TreeController($scope){

	}
})