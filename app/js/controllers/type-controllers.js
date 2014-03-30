cmsControllers.controller('type_new', ['$scope', '$modalInstance', 'metadata', 'dataService', 'systemServices', function($scope, $modalInstance, metadata, dataService, systemServices) {

	  systemServices.attach($scope);
	  $scope.meta = metadata;

	  console.log($scope.meta);
	  
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
	console.log($scope.editData);
	
	//$scope.contentScope
	console.log($scope.contentScope);
	
	dataService.setMetaDataToScope($scope, 'meta')
	
	console.log('$scope.meta');
	console.log($scope.meta);
	  
	
	$scope.typeChanged = function(){
		
		console.log('type changed');
		console.log($scope.selectedFieldItem.type);
		
	}
	
	$scope.sortableItemSelected = function(item){
		console.log('field selected happened');
		console.log(item);
		
		$scope.selectedFieldItem = item;
		$scope.safeApply();
	};
	
	
	$scope.editData.fields = [{name:'Test Text', label:'Test Text Label', type:'Text', required:true, parameters:{}},
	                          {name:'Test Date', label:'Test Date Label', type:'Date', required:true, parameters:{}},
	                          {name:'Test Number', label:'Test Number Label', type:'Number', required:true, parameters:{}},
	                          {name:'Test Boolean', label:'Test Boolean Label', type:'Boolean', required:true, parameters:{}},
	                          {name:'Test Enumeration', label:'Test Enumeration Label', type:'Enumeration', required:true, parameters:{}},
	                          {name:'Test Tab', label:'Test Tab Label', type:'Tab', required:true, parameters:{}},
	                          {name:'Test Code', label:'Test Code Label', type:'Code', required:true, parameters:{}},
	                          {name:'Test Category', label:'Test Category Label', type:'Category', required:true, parameters:{}},
	                          {name:'Test Custom', label:'Test Custom Label', required:true, type:'Custom', parameters:{}},
	                          {name:'Test File', label:'Test File Label', required:true, type:'File', parameters:{}}]
	
	$scope.selectedFieldItem = $scope.editData.fields[0];
	$scope.safeApply();
	
	$scope.modalEvent = function(evt, args){
		console.log('modal event');
		console.log(evt);
	};
	
	$scope.newEnumerationField = function(){
		
		$scope.openModal ('../templates/system/type/EnumerationNewField.html', 'type_new_enumerationfield', {
			saved:function(field){
				console.log(field);
				console.log('saved');
				
				if (!$scope.selectedFieldItem.parameters.enumerationfields)
					$scope.selectedFieldItem.parameters.enumerationfields = [];
				
				$scope.selectedFieldItem.parameters.enumerationfields.push(field.data);
			},
			dismissed:function(){
				console.log('dismissed');
			}
		}, []);
		
		/*
		console.log('enumeration field added');
		console.log($scope.newEnumerationFieldLabel);
		console.log($scope.newEnumerationFieldID);
		
		var enumFields = $scope.selectedFieldItem.parameters.enumerationfields;
		
		if (!$scope.selectedFieldItem.parameters.enumerationfields)
			$scope.selectedFieldItem.parameters.enumerationfields = [];
		
		$scope.selectedFieldItem.parameters.enumerationfields.push({label:$scope.newEnumerationFieldLabel, id: $scope.newEnumerationFieldId});
		$scope.safeApply();
		
		$scope.newEnumerationFieldLabel = '';
		$scope.newEnumerationFieldID = '';
		
		console.log($scope.selectedFieldItem.parameters.enumerationfields);
		*/
	};
	
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

cmsControllers.controller('type_new_enumerationfield', ['$scope', '$modalInstance', 'metadata', 'dataService', 'systemServices', function($scope, $modalInstance, metadata, dataService, systemServices) {

	 $scope.newField = {label:'',id:''};
	
	 $scope.ok = function () {
		  
			var okToSave = false;
			
			/*
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
			*/
			
			okToSave = true;
			
			if (okToSave)
			{
				$modalInstance.close({data:$scope.newField, message:"Item saved successfully"});
				
				/*
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
				*/
			}
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
	
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

