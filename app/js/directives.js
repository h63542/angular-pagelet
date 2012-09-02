'use strict';
define(function(require, exports, module){

var siboPagelet = ['$http', '$templateCache', '$anchorScroll', '$compile',
                       '$controller','pageletMetaService',function($http, $templateCache, $anchorScroll, $compile,
                       $controller,pageletMetaService){
  return {
    restrict : "E",
    compile:function(element, attr, linker){
      return function(scope, pageletStartElement, attr){
          //current dirctive's pagelet Meta,pagelet's name,current pagelet state's name,pagelet state's controller,state's view Template
          var pageletMeta,p_name,p_s_name,p_controller,p_model,p_s_model,p_s_controller,p_s_view,lastScope,
              onloadExp = attr.onload || '',
              current,last,locals,template;
          pageletMeta = pageletMetaService.getPageletMeta(attr.name);
          function pageletUpdate(){
              current = arguments[1];
              last = arguments[2];
              if(!pageletMeta){
                  return;
              }
              //judge  whether current pagelet has update 
              if(current.id === pageletMeta.id){
                loadContent()
              }
          }
          function pageletNew(){
            current = arguments[1];
                last = arguments[2];
            if(!pageletMeta){
                    return;
                }
                //judge  whether current pagelet has update 
            if(current.id === pageletMeta.id){
                  loadContent()
                }
          }
          function destroyLastScope() {
            if (lastScope) {
              lastScope.$destroy();
              lastScope = null;
            }
          }
          function clearContent() {
            element.html('');
            destroyLastScope();
          }
          function loadContent(){
                p_s_name = current["state.name"];
                p_s_view = pageletMeta.states[p_s_name].view;
                p_s_model = pageletMeta.states[p_s_name].model;

                if(!p_s_view){
                  p_s_view = pageletMeta.states[pageletMeta.defaultState];
                }
                //1.load new state content
                //2.invoke afterPagelet update callback function
                if(p_s_view){
                  template = $http.get(p_s_view, {cache: $templateCache});
                  if(template){
                    element.html(template);
                    destroyLastScope();

                    var link = $compile(element.contents()),
                        current = {},
                        controller;
                    //construct scope object(merage pagelet'model and p_s_model )
                    lastScope = current.scope = angular.extend(scope.$new(),angular.extend(p_model, p_s_model));

                    if(p_s_controller){
                        current.controller = angular.extend(p_s_controller,p_controller);
                    }else{
                        current.controller = p_controller;
                    }
                    if (current.controller) {
                      locals.$scope = lastScope;
                      controller = $controller(current.controller, locals);
                      element.contents().data('$ngControllerController', controller);
                    }
                    link(lastScope);
                    lastScope.$emit('sibo_pageletLoaded');
                    lastScope.$eval(onloadExp);
                    // $anchorScroll might listen on event...
                    $anchorScroll();
                  }else{
                    clearContent();
                  }
                }else{
                    clearContent();
                }
          }
          scope.$on("sibo_pageLetUpdate",pageletUpdate);
          scope.$on("sibo_pageLetNew",pageletNew);
      };
    }
  };
}];
/* Directives */
angular.module('sibo.directives', []).
  directive('siboPagelet', ['version', function(version) {
    return function(scope, elm, attrs) {
      
    };
  }]);
})
