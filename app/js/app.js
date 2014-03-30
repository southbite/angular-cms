'use strict';

/* App Module */

var cmsControllers = angular.module('cmsControllers', []);

var cmsApp = angular.module('cmsApp', [  
  'ui.bootstrap',                                            
  'firebase',
  'ngAnimate',
  'cmsControllers',
  'cmsServices',
  'angularBootstrapNavTree',
  'ui.ace',
  'ui.sortable',
  'ngRoute',
  'localytics.directives'
]);

cmsApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:toplevel', {
        templateUrl: function(params){ return '../templates/page_content.html'; },
        controller: 'PageContentController'
      }).
      otherwise({
    	  templateUrl: '../templates/home.html',
          controller: 'PageContentController'
      });
  }]);

cmsApp.run(function($rootScope) {
     $rootScope.$on('$routeChangeSuccess', function(ev,data) {  
  	   console.log('route change');
  	   console.log(ev);
  	 console.log(data);
         $rootScope.currentRoute = data.$route;
     });
  });

cmsApp.config(['$provide', function($provide) {
    return $provide.decorator('$rootScope', [
      '$delegate', function($delegate) {
        $delegate.safeApply = function(fn) {
          var phase = $delegate.$$phase;
          if (phase === "$apply" || phase === "$digest") {
            if (fn && typeof fn === 'function') {
              fn();
            }
          } else {
            $delegate.$apply(fn);
          }
        };
        return $delegate;
      }
    ]);
  }
]);

var registerFirebaseService = function (serviceName) {
	cmsApp.factory(serviceName, function (angularFire) {
		var _metaDataURL = null;
        var _metaDataRef = null;
        
        var _dataURL = null;
        
        return {
        	init:function(dataURL, metaDataURL, done){
        		
        		try
        		{
        			_dataURL = dataURL;
            		_metaDataURL = metaDataURL;
            		_metaDataRef = new Firebase(_metaDataURL);
            		
            		_metaDataRef.once('value', function(data) {
            			//we wait until all the meta data is loaded before proceeding
            			done();
            		});
            	
        		}catch(e)
        		{
        			done(e);
        		}
        	},
        	addUpdateSystemFields:function(obj){
        		obj.lastupdated = new Date();
        	},
        	addCreateSystemFields:function(obj){
        		obj.timestamp = new Date();
        		obj.deleted = false;
        		obj.systemVersion = 0;
        	},
        	retrieve:function(type, id, done){
        		try
        		{
        			var dataRef = new Firebase(_dataURL + '/' + type + '/' + id);
        			
        			dataRef.on('value', function(snapshot) {
        				done(null, snapshot.val());
        			});
        		}
        		catch(e)
        		{
        			done(e);
        		}
        	},
        	attach:function(scope, localScopeVarName, type, id, done){
        		try
        		{
        			var dataRef = new Firebase(_dataURL + '/' + type + '/' + id);
        			angularFire(dataRef, scope, localScopeVarName);
        			done();
        		}
        		catch(e)
        		{
        			done(e);
        		}
        	},
        	add:function(type, obj, done){
        		try
        		{
        			this.addCreateSystemFields(obj);
        			
        			var pushRef = new Firebase(_dataURL + '/' + type).push();
        			pushRef.set(obj, function(e){
        				if (!e)
        					done(null, pushRef.name());
        				else
        					done(e);
        			});
        		}
        		catch(e)
        		{
        			done(e);
        		}
        	},
        	update:function(type, id, obj, done){
        		try
        		{
        			this.addUpdateSystemFields(obj);
        			
        			console.log('in update');
        			
        			var dataRef = new Firebase(_dataURL + '/' + type + '/' + id);
        			dataRef.set(obj, function(e){
        				done(e);
        			});
        		}
        		catch(e)
        		{
        			done(e);
        		}
        	},
        	setMetaDataToScope:function(scope, localScopeVarName){
        		 angularFire(_metaDataRef, scope, localScopeVarName);
        	},
            traverse:function(data, path, done){
            	try
            	{
            		console.log('traversing');
            		console.log(data);
            		
            		var currentNode = data;
            		var found = false;
            		
            		if (path[0] = '/')
            			path = path.substring(1, path.length);
            	
                	path.split('/').map(function(current, index, arr){
                		currentNode = currentNode[current];
                		if (index + 1 == arr.length && currentNode){
                			found = true;
                			done(null, currentNode);
                		}
                	});
                	
                	if (!found)
                		done(null, null);
            	}catch(e){
            		done(e);
            	}
            	
            }
        }
    });
};

/*
var registerFirebaseService = function (serviceName) {
	cmsApp.factory(serviceName, function (angularFire) {
        var _url = null;
        var _ref = null;

        return {
        	reInit:function(url, append){
        		if (append)
        			url += url;
        		
        		this.init(url, true);
        	},
            init: function (url, force) {
            	if (_url == null || force)
            	{
            		_url = url;
                    _ref = new Firebase(_url);
            	}
            },
            setValue:function(path, ){
            	if (key)
            		_ref.child(key).set(obj);
            	else
            		_ref.set(obj);
            },
            getValue:function(path, done){
            	
            },
            setToScope: function (scope, localScopeVarName) {
                angularFire(_ref, scope, localScopeVarName);
            },
            traverse:function(data, path, done){
            	try
            	{
            		console.log('traversing');
            		console.log(data);
            		
            		var currentNode = data;
            		var found = false;
            		
            		if (path[0] = '/')
            			path = path.substring(1, path.length);
            	
                	path.split('/').map(function(current, index, arr){
                		currentNode = currentNode[current];
                		if (index + 1 == arr.length && currentNode){
                			found = true;
                			done(null, currentNode);
                		}
                	});
                	
                	if (!found)
                		done(null, null);
            	}catch(e){
            		done(e);
            	}
            	
            }
        };
    });
};
*/
registerFirebaseService('dataService');

cmsApp.factory('AppSession', function($rootScope) {
	  return {
		firebaseURL: 'https://wesgro.firebaseio.com',
		//currently what path are we editing
	    currentPath: '',
	    //data that is being currently edited, keyed by the path of the item
	    dirty:{},
	    //used rootscope to push an event throughout the app
	    broadcastEvent: function(event, args) {
	      $rootScope.$broadcast(event, args);
	    },
	    defaultOperationCode:'LyoNCg0KVGhlIHByb2Mgb2JqZWN0IGdpdmVzIHlvdSBhY2Nlc3MgdG8gc3lzdGVtIGhlbHBlciBmdW5jdGlvbnMuDQpUaGUgcGFyYW1zIGFyZSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgaW50byB0aGlzIG9wZXJhdGlvblQNClRoZSBsaW5lIGlzIHRoZSByYXcgbGluZSB0byBiZSBwcm9jZXNzZWQNCkFmdGVyIHRoZSBsaW5lIGhhcyBiZWVuIHRyYW5zZm9ybWVkIG9yIGNoZWNrZWQsIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkIHRvIHBhc3MgdGhlIGxpbmUgYWxvbmcgdGhlIHByb2Nlc3MNCiovDQoNCmZ1bmN0aW9uIHBlcmZvcm0ocHJvYywgcGFyYW1zLCBsaW5lLCBjYWxsYmFjayl7DQogICAgDQogICAgY2FsbGJhY2soJ09LJywgbGluZSk7DQp9',
	    defaultControlCode:'PCEtLSBUaGlzIGlzIHRoZSBzb3VyY2UgZm9yIHlvdXIgY29udHJvbHMsIGFzIHlvdSBjYW4gc2VlIHdlIGFyZSB1c2luZyBuZy1tb2RlbCB0byBsaW5rIHRoZSB1c2VyIGlucHV0IHRvIHRoZSBhY3R1YWwgcGFyYW1ldGVycyB1c2VkIGZvciB0aGUgb3JjaGVzdHJhdGlvbiAtLT4NCg0KPGZvcm0gY2xhc3M9ImZvcm0taG9yaXpvbnRhbCIgcm9sZT0iZm9ybSI+DQogIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiPg0KICAgPGxhYmVsIGZvcj0iY29udHJvbFBhcmFtMSIgY2xhc3M9ImNvbC1zbS0yIGNvbnRyb2wtbGFiZWwiPlBhcmFtZXRlciAxPC9sYWJlbD4NCiAgIDxkaXYgY2xhc3M9ImNvbC1zbS0xMCI+DQogICAgICA8aW5wdXQgY2xhc3M9ImZvcm0tY29udHJvbCIgaWQ9ImNvbnRyb2xQYXJhbTEiIHBsYWNlaG9sZGVyPSJOYW1lIiBuZy1tb2RlbD0icGFyYW1zLlBhcmFtMSI+PC9pbnB1dD4NCiAgICA8L2Rpdj4NCiAgPC9kaXY+DQogICA8ZGl2IGNsYXNzPSJmb3JtLWdyb3VwIj4NCiAgIDxsYWJlbCBmb3I9ImNvbnRyb2xQYXJhbTIiIGNsYXNzPSJjb2wtc20tMiBjb250cm9sLWxhYmVsIj5QYXJhbWV0ZXIgMjwvbGFiZWw+DQogICA8ZGl2IGNsYXNzPSJjb2wtc20tMTAiPg0KICAgICAgPGlucHV0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIGlkPSJjb250cm9sUGFyYW0yIiBwbGFjZWhvbGRlcj0iTmFtZSIgbmctbW9kZWw9InBhcmFtcy5QYXJhbTIiPjwvaW5wdXQ+DQogICAgPC9kaXY+DQogIDwvZGl2Pg0KIDwvZm9ybT4='
	  };
	});

