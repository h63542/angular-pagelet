'use strict';

/* Services */
define(function(require,exports,module) {
	/**
	 * Current URL INFO
	 */
	function PageletLoactionProvider(){
		var currentPageletInstances,lastPageletInstances={};
		this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector',
			function($rootScope, $location, $routeParams, $q, $injector){
			//1.init prase url
			//2.lisnener web browser url change evnet
			return {
				init:function() {
				    $rootScope.$on('$locationChangeSuccess', updatePagelet);
				}
			};
			function updatePagelet(){
				var util = require("./util"),
				item,last,current;
				currentPageletInstances = util.parseLocation2Pagelet($location.absUrl());
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
									$rootScope.$broadcast("sibo_pageletUpdate",current,angular.copy(last,{}));
									lastPageletInstances[item] = current;
							}else{
								//send new pagelet request event
								//send pagelet update event
								last = current;
								$rootScope.$broadcast("sibo_pageletNew",current);
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
	function PageletMetaServiceProvider(){
		this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector',
			function($rootScope, $location, $routeParams, $q, $injector){
			return {
				getPageletMeta:function(){

				}
			};
		}];
		//1.loadall Pagelet Meta
		
	}
	angular.module('sibo.services', [])
	.provider('pageletMetaService', PageletMetaServiceProvider)
	.provider('pageletLoaction',PageletLoactionProvider);
});