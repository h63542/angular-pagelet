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
            pageletMeta = meta.pagelet;
            var initRequireMethod = pageletMeta["initRequire"];
            if(_.isFunction(initRequireMethod)){
                initRequireMethod();
            }
        });

        return function(scope, pageletStartElement, attr){
            //current dirctive's pagelet Meta,pagelet's name,current pagelet state's name,pagelet state's controller,state's view Template
            var currentPagelet,last;
            //pageletMeta = pageletMetaService.getPageletMeta(attr.name);
            if(!pageletMeta){
                require.async(define,function(meta){
                    pageletMeta = meta.pagelet;
                    initExecLink();
                    registerPageletEvent();
                });
            }else{
                initExecLink();
                registerPageletEvent();
            }
            /**
             * init exec Pagele init
             * @return {[type]} [description]
             */
            function initExecLink(){
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
                bindingQueryParam2Scope(currentPagelet.queryParam);
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
                bindingQueryParam2Scope(currentPagelet.queryParam);
                //judge  whether current pagelet has update 
                if(currentPagelet.pageletName === pageletMeta.id){
                  //if state has update
                  if(last.stateName != currentPagelet.stateName){
                    loadContent()
                  }else{
                    if(!(_.isEqual(last.queryParam ,currentPagelet.queryParam ))){
                        updateQueryParam(last.queryParam,currentPagelet.queryParam);  
                    }
                  }
                }
            }
            function pageletNew(){
              currentPagelet = arguments[1];
                  last = arguments[2];
              if(!pageletMeta){
                      return;
                  }
              bindingQueryParam2Scope(currentPagelet.queryParam);    
              //judge  whether current pagelet has update 
              if(currentPagelet.pageletName === pageletMeta.id){
                    loadContent()
              }
            }
            
            /**
             * get PageletMeta attribute value
             * @param  {[type]} attrName [description]
             * @return {[type]}          [description]
             */
            function getPageletMetaAttr(attrName){
                if(_.isFunction(pageletMeta[attrName])){
                  return pageletMeta[attrName](scope);
                }else{
                  return _.clone(pageletMeta[attrName]);
                }
            }
            /**
             * when pagelet queryParam has change invoked 
             * @param  {[type]} oldParam [description]
             * @param  {[type]} newParam [description]
             * @return {[type]}          [description]
             */
            function updateQueryParam(oldParam,newParam){
              var states = getPageletMetaAttr("states");
              p_s_name = currentPagelet["stateName"];
              p_s = states[p_s_name];
              if(_.isFunction(p_s["onParamUpdate"])){
                  p_s["onParamUpdate"](scope,oldParam,newParam);
              }
            }
            /**
             * bind pagelet queryParam to scope Object
             * @param  {[type]} newParam [description]
             * @return {[type]}          [description]
             * TODO bind queryParam to scope Object property
             * 
             */
            function bindingQueryParam2Scope(newParam){
                scope._queryParam = newParam;
            }
            function loadContent(){
                var p_name,p_template,p_s,p_s_name,p_controller,p_model,p_s_model,p_s_controller,p_s_view,p_events,lastScope,
                onloadExp = attr.onload || '',locals={},p_content,s_template,p_states,state_parentElement;
                // is  need clone?
                p_controller = pageletMeta.controller;
                p_model = pageletMeta.model||{};
                p_template = pageletMeta.template;
                p_s_name = _.clone(currentPagelet["stateName"]);
                p_states = getPageletMetaAttr("states");
                p_s = p_states?_.clone(p_states[p_s_name]):undefined;
                if(!p_s){
                    p_s = {view:"error.html",model:{erroecode:"-1",message:"State:"+p_s_name+" not exit!"}};
                }
                p_s_view = p_s.view||{};
                p_s_model = p_s.model||{};
                p_s_controller = p_s.controller;
                if(!p_s_view){
                  p_s_view = pageletMeta.states[pageletMeta.defaultState];
                }
                //load template
                if(p_template){
                  if(p_template.indexOf("/") !=0 ){
                      p_template = pageletBase+"/"+p_template;
                  }
                  p_content = $http.get(p_template, {cache: $templateCache}).
                  then(function(response) { return response.data; }); 
                    $q.when(p_content).then(function(content){
                      if(content){
                           element.html(content);
                           content = null;
                      }
                    })
                }

                if(!p_s_view){
                  p_s_view = pageletMeta.states[pageletMeta.defaultState];
                }
                //1.load new state content
                //2.invoke afterPagelet update callback function
                if(p_s_view){
                  //if a/b/c.html -> $pageletBaseDir+a/b/c.html
                  if(p_s_view.indexOf("/") !=0 ){
                    p_s_view = pageletBase+"/"+p_s_view;
                  }
                  s_template = $http.get(p_s_view, {cache: $templateCache}).
                  then(function(response) { return response.data; });

                  $q.when(s_template).then(function(data){
                    if(data){
                      if(element.find("div.pagelet-template").length > 0){
                        state_parentElement = angular.element(element.find("div.pagelet-template")[0]);
                      }else if(element.find("pagelet-template").length > 0){
                        state_parentElement = angular.element(element.find("pagelet-template")[0]);;
                      }else{
                        state_parentElement = element;
                      }
                      //util.html(state_parentElement,data);
                      state_parentElement.html(data);
                      data = null;
                      destroyLastScope();
                      var link = $compile(element.contents()),
                          current = {},
                          controller;
                      //construct scope object(merage pagelet'model and p_s_model )
                      p_model = angular.extend(p_model,{"pageletBase":pageletBase+"/"});
                      if(_.isObject(currentPagelet.queryParam)){
                        p_s_model = angular.extend(p_s_model,angular.extend(p_model,currentPagelet.queryParam));
                      }
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

                      //register event binding
                      p_events = pageletMeta.events;
                      if(_.isObject(p_events)){
                        for(var it in p_events){
                          if(p_events.hasOwnProperty(it)){
                            if(_.isFunction(p_events[it])){
                                scope.$on(pageletMeta.id+"."+it,p_events[it]);
                            }
                          }
                        }
                      }
                    }else{
                      clearContent();
                    }
                  });
                }else{
                    clearContent();
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
            }
        };
      }
    };
  }];

  var markdown = function(){
    var showdown = new Showdown.converter(),
        template = '<section>' +
                     '<article ng-bind-html-unsafe="markdown(content)"></article>';
    
    return {
        restrict: 'E',
        scope: {},
        compile: function(templateElement) {
            var initialContent = templateElement.html();
            templateElement.html(template);
            return function(scope, element, attrs) {
              scope.content = initialContent;
                scope.markdown = showdown.makeHtml;
            }
        }
    }
  }
  /* Directives */
  angular.module('sibo.directives', ['sibo.services']).
    directive('siboPagelet', siboPagelet)
    .directive('markdown',markdown)
    .run(['pageletLoaction',function(pageletLoaction){
            pageletLoaction.init();
          }]);
})
