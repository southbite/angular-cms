'use strict';

/**
 * Binds an element to a jsplumb instance
 * 
 * https://github.com/localytics/angular-chosen
 */
angular.module('ui.treeCombo', [])
  .directive('treeCombo', ['$templateCache', function ($templateCache) {
    if (angular.isUndefined(window.JQuery)) {//TODO what is jquery.ui 's name?
      throw new Error('We need jquery to work... (o rly?)');
    }
    
    return {
      restrict: 'E',
      scope: {
    	  treeData: '=',
    	  controlEvent: '='
      },
     // template: $templateCache.get('../templates/js-plumb.html'),
      template: '<div class="tree-combo-container" >' + 
    	     		'<a class="tree-combo-path"></a>' +       
    	     		'<div class="tree-combo-tree"></div>' +  
    	     	'</div> ',
      link: function (scope, elm, attrs) {
       
        opts = angular.extend({}, scope.$eval(attrs.treeCombo));
        var instance = $(elm);
        
        scope.$watch(treeData, function(){
        	
        	controlEvent('treeDataChanged', [instance]);
        	
        });
        
    	//
		// listen for clicks on connections, and offer to delete connections on click.
		//
		instance.bind("click", function(conn, originalEvent) {
			
			var sourceShapeId = conn.sourceId.replace('flowchart','');
			var targetShapeId = conn.targetId.replace('flowchart','');
			
			if (confirm("Delete connection from " + sourceShapeId + " to " + targetShapeId + "?"))
			{
				jsPlumb.detach(conn); 
				scope.drawingEvent("connectionDetached", [conn, sourceShapeId, targetShapeId]);
			}
				
			scope.drawingEvent("click", [conn, originalEvent]);
		});	
		
		instance.bind("connectionDrag", function(connection) {
			console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
			
			scope.drawingEvent("connectionDrag", [connection]);
		});		
		
		instance.bind("connectionDragStop", function(connection) {
			console.log("connection " + connection.id + " was dragged");
			
			scope.drawingEvent("connectionDragStop", [connection]);
		});

		instance.bind("connectionMoved", function(params) {
			console.log("connection " + params.connection.id + " was moved");
			
			scope.drawingEvent("connectionMoved", [params]);
		});
        
		scope.drawingEvent("instanceCreated", [instance]);
		
     
		
		scope.$watch(
				//we are watching the container html
			    function () { return document.getElementById(scope.drawingData.id).innerHTML},  
			    function(newval, oldval){
			       
			        var shapes = $(document.getElementById(scope.drawingData.id)).find('.' + scope.drawingData.shapeClass);

			        //we check if the drawing hasn't been loaded yet, and we have the right amount of shapes in the html (ng-repeat is done)
			        if (shapes != null && shapes.length == scope.drawingData.shapes.length && !loadedComplete)
			        {
			        	 // suspend drawing and initialise.
			        	instance.doWhileSuspended(function() {

							//connect all the shapes
							scope.drawingData.shapes.map(function(currentShape, arrInex, arr){
								var currentShapeElement = $('#flowchart' + currentShape.id);
								_addEndpoints(currentShape.id, currentShape.sourceEndPoints, currentShape.targetEndPoints);
								initShape(currentShapeElement);
							});
							
							// listen for new connections; initialise them the same way we initialise the connections at startup.
							instance.bind("connection", function(connInfo, originalEvent) { 
								initConnection(connInfo.connection);
							});			
							
							// link all connections to the current scopes shapes
							scope.drawingData.connections.map(function(currentConnection, arrIndex, arr){
								instance.connect(currentConnection);
							});
							
						});
				    	
				        loadedComplete = true;
			        }
					
			    }, true);
      }
    };
  }]);