'use strict';

/* Services */
(function() {
	/**
	 * Current URL INFO
	 */
	function PageletLoaction(){
		var currentPageletInstances,lastPageletInstances;
		this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector',
			function($rootScope, $location, $routeParams, $q, $injector){
			//1.init prase url
			//2.lisnener web browser url change evnet
		    $rootScope.$on('$locationChangeSuccess', updatePagelet);
			return {

			};
			function updatePagelet(){
				var util = require("js/util"),
				item,last,current;
				currentPageletInstances = util.parseLocation2Pagelet($location.path());
				//compare to lastInstance, find which pagelet has changed
				if(angular.equals(currentPageletInstances,lastPageletInstances)){
					return;
				}else{
					for(item in currentPageletInstances){
						if(currentPageletInstances.hasOwnProperty(item)){
							current = currentPageletInstances[item];
							if(lastPageletInstances.hasOwnProperty(item) 
								&& !(angular.equals(lastPageletInstances[item],current))){
									//send pagelet update event
									last = lastPageletInstances[item];
									$rootScope.$boradcast("sibo_pageletUpdate",current,angular.copy(last,{}));
									lastPageletInstances[item] = current;
							}else{
								//send new pagelet request event
								//send pagelet update event
								last = lastPageletInstances[item];
								$rootScope.$boradcast("sibo_pageletNew",current);
								lastPageletInstances[item] = current;
							}
						}
					}
				}
			}
		}];
	}
	/**
	 * Manager Pagelet MetaInfo
	 */
	function PageletMetaService(){
		this.$get = ['',function(){

			return {

			};
		}];
		//1.loadall Pagelet Meta
		
	}
	angular.module('sibo.services', []).
	value('version', '0.1');
})();