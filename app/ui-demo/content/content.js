define(function (require,exports,module) {
	var PassthroughModel = {
		"ui.config":{
		   // The ui-jq directive namespace
		   jq: {
		      // The qtip namespace
		      qtip: {
		         // qTip options. This object will be used as the defaults
		         position: {
		            my: 'left center',
		            at:'right center'
		         }
		      }
		   }
		},
		demoUrl:"../components/Passthrough_demo.html"
	};
	exports.pagelet = {
		id:'content',
		defaultState:"date",
		model:{},
		template:"content.html",
		states:{
			Passthrough:{view:"../components/doc.html",onParamUpdate:onParamUpdate,model:PassthroughModel},
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