'use strict';
define(function(require, exports, module){
  var siboPagelet = ['$http', '$location','$templateCache', '$anchorScroll', '$compile',
                         '$controller','$q','pageletMetaService',function($http, $location,$templateCache, $anchorScroll, $compile,
                         $controller,$q,pageletMetaService){
    return {
      restrict : "E",
      compile:function(element, attr, linker){
        var define = attr["define"],loadsucess = false,util = require("./util"),
            pageletMeta,pageletBase=define.substring(0,define.lastIndexOf("/"));

        require.async(define,function(meta){
            console.info(meta.pagelet);  
            pageletMeta = meta.pagelet;
        });
        return function(scope, pageletStartElement, attr){
            //current dirctive's pagelet Meta,pagelet's name,current pagelet state's name,pagelet state's controller,state's view Template
            var p_name,p_s,p_s_name,p_controller,p_model,p_s_model,p_s_controller,p_s_view,lastScope,
                onloadExp = attr.onload || '',
                currentPagelet,last,locals={},template;
            //pageletMeta = pageletMetaService.getPageletMeta(attr.name);
            if(!pageletMeta){
                require.async(define,function(meta){
                    console.info(meta.pagelet);  
                    pageletMeta = meta.pagelet;
                    initExecLink();
                    registerPageletEvent();
                });
            }else{
                initExecLink();
                registerPageletEvent();
            }
            function initExecLink(){
                console.info("link");  
                console.info(pageletMeta);  
                var currentPageletInstances = util.parseLocation2Pagelet($location.absUrl());
                currentPagelet = getCurrentPageletInstance(pageletMeta.id);
                if(!currentPagelet){
                    currentPagelet = {
                      pageletName:pageletMeta.id,
                      stateName:pageletMeta.defaultState,
                      path:"",
                      queryParam:[]
                    }
                }
                loadContent();
                function getCurrentPageletInstance(id){
                  for(var i=0;i<currentPageletInstances.length;i++){
                    if(currentPageletInstances[i].pageletName === id){
                      return currentPageletInstances[i];
                    }
                    return undefined;
                  }
                }

            }
            function registerPageletEvent(){
                scope.$on("sibo_pageletUpdate",pageletUpdate);
                scope.$on("sibo_pageletNew",pageletNew);
            }
            function pageletUpdate(){
                currentPagelet = arguments[1];
                last = arguments[2];
                if(!pageletMeta){
                    return;
                }
                //judge  whether current pagelet has update 
                if(currentPagelet.pageletName === pageletMeta.id){
                  loadContent()
                }
            }
            function pageletNew(){
              currentPagelet = arguments[1];
                  last = arguments[2];
              if(!pageletMeta){
                      return;
                  }
                  //judge  whether current pagelet has update 
              if(currentPagelet.pageletName === pageletMeta.id){
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
                  p_controller = pageletMeta.controller;
                  p_model = pageletMeta.model||{};
                  p_s_name = currentPagelet["stateName"];
                  p_s = pageletMeta.states[p_s_name];
                  if(!p_s){
                      p_s = {view:"error.html",model:{erroecode:"-1",message:"State:"+p_s_name+" not exit!"}};
                  }
                  p_s_view = p_s.view;
                  p_s_model = p_s.model;
                  p_s_controller = p_s.controller;
                  if(!p_s_view){
                    p_s_view = pageletMeta.states[pageletMeta.defaultState];
                  }
                  //1.load new state content
                  //2.invoke afterPagelet update callback function
                  if(p_s_view){
                    template = $http.get(pageletBase+"/"+p_s_view, {cache: $templateCache}).
                    then(function(response) { return response.data; });

                    $q.when(template).then(function(data){
                      if(data){
                        element.html(data);
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
                    });
                  }else{
                      clearContent();
                  }
            }

        };
      }
    };
  }];
  /* Directives */
  angular.module('sibo.directives', ['sibo.services']).
    directive('siboPagelet', siboPagelet)
    .run(['pageletLoaction',function(pageletLoaction){
            pageletLoaction.init();
          }]);
})
