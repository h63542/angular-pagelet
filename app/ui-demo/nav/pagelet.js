define(function (require,exports,module) {
	var navModel = {codeMirrorModel:  "var helloWorld = 'Success!';"}  ;

	//$scope.codeMirrorModel = "var helloWorld = 'Success!';";
	exports.pagelet = {
		id:'nav',
		defaultState:"tree",
		model:navModel,
		states:{
			accordion:{view:'accordion.html',controller:AccordionController},
			tree:{view:'tree.html',controller:TreeController}
		}
	};
	function AccordionController($scope){

	}
	function TreeController($scope){

	}
})