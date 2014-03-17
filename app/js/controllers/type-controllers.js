cmsControllers.controller('type_new', ['$scope', '$modalInstance', 'metadata', 'dataService', 'systemServices', function($scope, $modalInstance, metadata, dataService, systemServices) {

	  systemServices.attach($scope);
	  $scope.meta = metadata;

	  $scope.newObj = {name:'', description:'', type: 'type', editable:true}; 
	  
	  $scope.ok = function () {
		  
		var okToSave = false;
		
		if (!$scope.newObj.name)
			$scope.showMessage('alert-warning', 'A type needs a name');
		else
		if (!$scope.newObj.description)
			$scope.showMessage('alert-warning', 'A type needs a description');
		else
		if ($scope.meta.Types[$scope.newObj.name] != null)
			$scope.showMessage('alert-warning', 'A type by this name already exists');
		else
			okToSave = true;
		
		if (okToSave)
		{
			dataService.add($scope.newObj.type,$scope.newObj, function(e, id){
				
				if (!e){
					console.log($scope.meta);
					console.log($scope.newObj);
					console.log(id);
					
					$scope.meta.Types[$scope.newObj.name] = {meta:{type:$scope.newObj.type, id:id, editable:true}};	
					$modalInstance.close({data:$scope.newObj, message:"Item saved successfully"});
				}else{
					console.log('save error: ' + e);
					$scope.showMessage('alert-danger', 'An error occured saving the type');
				}
			});
		}
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	  
}]);

cmsControllers.controller('type_edit', ['$scope', 'dataService', 'systemServices', function($scope, dataService, systemServices) {

	console.log('edit controller loaded');
	console.log('$scope.editData');
	console.log($scope.editData);//metaNode
	
	var tmpList = [];
	  
	  for (var i = 1; i <= 6; i++){
	    tmpList.push({
	      text: 'Item ' + i,
	      value: i
	    });
	  }
	  
	  $scope.editData.fields = tmpList;
	  $scope.safeApply();
	  
	  $scope.sortingLog = [];
	  
	  $scope.sortableOptions = {
	    update: function(e, ui) {
	      var logEntry = tmpList.map(function(i){
	        return i.value;
	      }).join(', ');
	      $scope.sortingLog.push('Update: ' + logEntry);
	    },
	    stop: function(e, ui) {
	      // this callback has the changed model
	      var logEntry = tmpList.map(function(i){
	        return i.value;
	      }).join(', ');
	      $scope.sortingLog.push('Stop: ' + logEntry);
	    }
	  };
	
	
	 
	 console.log($scope.list);
	 
	 var onSave = function(args){
		 console.log('doing onsave')
		 dataService.update($scope.metaNode.type, $scope.metaNode.id, $scope.editData, function(e){
			 console.log('update happened' + e)
			 if (!e)
			 {
				 $scope.showMessage('alert-success', 'Item updated successfully'); 
				 console.log('show message happened');
			 }
			 else{
				 console.log(e);
				 $scope.showMessage('alert-success', 'Item update failed'); 
			 }
		 });
	 };
	
	 var actions = [
		{
			text:'save',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-floppy-disk'
		},
		{
			text:'tag',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-tag'
		},
		{
			text:'history',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-time'
		},
		{
			text:'delete',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-remove'
		}];
	 
	 $scope.actions = actions;
	 $scope.$emit('editor_loaded', actions);
	 console.log('control_edit controller loaded');
	 
}]);

cmsControllers.controller('type_view', ['$scope', '$modalInstance','$rootScope', 'dataService', 'AppSession', 'args', 'cmsHelper', function($scope, $modalInstance, $rootScope, dataService, AppSession, args, cmsHelper) {
	dataService.setToScope($scope, 'data');
	$scope.view_html = args.view_html;
	$scope.params = {Param1:'Test',Param2:'Test'};
	$scope.helper = cmsHelper;
	
	$scope.ok = function(){
		if (args.okHandler != null)
			args.okHandler($modalInstance);
		else
		{
			
			$modalInstance.close('Control viewed OK');
			console.log($scope.params);
		}
			
	};
	
	$scope.cancel = function(){
		if (args.cancelHandler != null)
			args.cancelHandler($modalInstance);
		else
			$modalInstance.close('Control viewed OK');
	};
		
}]);

