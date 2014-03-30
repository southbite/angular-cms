'use strict';

cmsControllers.controller('BaseController', ['$scope', '$rootScope', '$modal', '$log', '$sce', 'dataService', 'systemServices', 'AppSession', function($scope, $rootScope, $modal, $log, $sce, dataService, systemServices, AppSession) {
	
	  systemServices.attach($scope);
	  
	  $scope.dataInitialized = false;
	  $scope.flashmessage = {type:'alert-warning', message:'', display:'none'};
	  $scope.topMenu = {display:'none'};
	  $scope.base_visible = 'none';
	  
	  $scope.topMenuSelected = function(item){
		  $scope.subMenu = item.SubMenu;
		  
	  };
	  
	  $scope.showTopMenu = function(){
		  $scope.topMenu.display = 'block';
	  }
	
	  $scope.showMessage = function(type, message){
		  $scope.flashmessage.type = type;
		  $scope.flashmessage.message = message;
		  $scope.flashmessage.display = 'block';
		  $scope.safeApply();
	  };
	  
	  $scope.$watch('flashmessage', function(){
		 console.log('flash changed'); 
	  });
	
	
	
	  var url = AppSession.firebaseURL + '/CMS/MetaData';
	  
	  dataService.init(AppSession.firebaseURL + '/CMS/Data', AppSession.firebaseURL + '/CMS/MetaData', function(e){
		  if (!e){
			  dataService.setMetaDataToScope($scope, 'metadata');
			  $scope.$watch('metadata.Settings', function(){
				  
				  if (!$scope.loadedDefaults)
				  {
					  $scope.topMenuSelected($scope.metadata.Menu[$scope.metadata.Settings['default_menu']]);
					  $scope.base_visible = 'block';
					  $scope.dataInitialized = true;
					  
					  $scope.safeApply();
					  $scope.loadedDefaults = true;
				  }
			  });
			  
		  }else{
			  //TODO: handle errors here
		  }
	  });
	  
	  $scope.openModal = function (templatePath, controller, handler, args) {
		    var modalInstance = $modal.open({
		      templateUrl: templatePath.toLowerCase(),
		      controller: controller.toLowerCase(),
		      resolve: {
		        metadata: function () {
		          return $scope.metadata;
		        },
		        dataService: function () {
			          return dataService;
			    },
		        args: function () {
		          return args;
		        },
		        systemServices:function () {
		          return systemServices;
		        },
		        handler: function () {
			          return handler;
			    }
		      }
		    });

      if (handler)
    	  modalInstance.result.then(handler.saved, handler.dismissed);
      
	 };
		  
	 $scope.openNewModal = function (type, action) {
		 
		 var handler = {
				 saved:function(result){
					 $scope.selected = result.data;
					 $scope.showMessage('alert-success', result.message);
				 },
				 dismissed:function(){
					 $log.info('Modal dismissed at: ' + new Date());
				 }
		 };
		 
		 return $scope.openModal('../templates/' + action + '.html', action.toString(), handler);
	 };
	 
}]);


cmsControllers.controller('AdminTreeController',  ['$scope', '$rootScope', 'angularFire', 'dataService', 'AppSession',
  function($scope, $rootScope, angularFire, dataService, AppSession) {
	
	$scope.on_expand_or_contract = function(branch) {
		if (branch.expanded)
		{
			console.log('branch expanded');
			$scope.meta.expanded[branch.path] = true;
		}	  
	  	else
	  	{
	  		console.log('branch contracted');	
	  		delete $scope.meta.expanded[branch.path];
	  	}
	};
	  
	$scope.my_tree_handler = function(branch) {
		console.log("You selected: " + branch.path);
		console.log(branch);
		$scope.meta.selected = branch.path;
		if (branch.meta && branch.meta.editable == true)
		{
			 $rootScope.$broadcast('editItemSelected', branch);
			 //$rootScope.$apply();
			 console.log('editItemSelected event happened');
		}
			
	};
	  
	$scope.meta = {expanded:{}, selected:null};
	$scope.ux_treedata = null;
	console.log('setting to scope ux_treedata');
	dataService.setMetaDataToScope($scope, 'ux_treedata');
	//data, path, done
	
	
}]);

cmsControllers.controller('PageContentController', ['$scope', '$rootScope', '$modal', '$routeParams', '$log',  'dataService', 'AppSession', function($scope, $rootScope, $modal, $routeParams, $log,  dataService, AppSession) {
	
	//we go to firebase look for a page with the key associated with this top level
	// we pull out the page object - it has a data link property and a template name
	
	//we get the data, then load the template
	console.log('$rootScope meta');
	console.log($scope.metadata);
	console.log($routeParams.toplevel);
	
	if ($scope.metadata['Pages'][$routeParams.toplevel])
	{
		var pageMetaData = $scope.metadata['Pages'][$routeParams.toplevel].meta;
		console.log('pageMetaData');
		console.log(pageMetaData);
		dataService.retrieve('page', pageMetaData.data_link, function(e, page){
			
			if (!e)
			{
				console.log('got page data');
				console.log(page);
				$scope.page_metadata = pageMetaData;
				$scope.page = page;
				$scope.safeApply();
				
			}else
				console.log('Error happened in page: ' + e);
			
		});
	}
	
	console.log('page content loaded: ' + $routeParams.toplevel);
	
}]);

cmsControllers.controller('BulletedListController', ['$scope', '$rootScope', '$modal', '$routeParams', '$log',  'dataService', 'AppSession', function($scope, $rootScope, $modal, $routeParams, $log,  dataService, AppSession) {
	  
	console.log('bulleted list loaded: ' + $routeParams.toplevel);
	
	$scope.$watch('page', function(){
		console.log('page change happened');
		console.log($scope.page);
	});
	
	$scope.testCompiledValue = 'Test Value';
	
	$scope.selectedContent = '';
	
	$scope.selectContent = function(item){
		$scope.selectedContent = item.content;
	}
	
}]);

cmsControllers.controller('ListController', ['$scope', '$rootScope', '$modal', '$routeParams', '$log',  'dataService', 'AppSession', function($scope, $rootScope, $modal, $routeParams, $log,  dataService, AppSession) {
	  
	console.log('bulleted list loaded: ' + $routeParams.toplevel);
	
	$scope.$watch('page', function(){
		console.log('page change happened');
		console.log($scope.page);
	});
	
	$scope.testCompiledValue = 'Test Value';
	
	$scope.selectedContent = '';
	
	$scope.selectContent = function(item){
		$scope.selectedContent = item.content;
	}
	
}]);

cmsControllers.controller('FeaturedListController', ['$scope', '$rootScope', '$modal', '$routeParams', '$log',  'dataService', 'AppSession', function($scope, $rootScope, $modal, $routeParams, $log,  dataService, AppSession) {
	  
	
	
}]);


cmsControllers.controller('ContentController', ['$scope', '$rootScope', '$modal', '$log',  'dataService', 'AppSession', function($scope, $rootScope, $modal, $log,  dataService, AppSession) {

	  $scope.action_selected = function(action){
		  action.handler();
	  };
	  
	  $scope.testObj = {name:'test', method:function(test){}};
	  
	  $scope.$on('editItemSelected', function(event, args) {
		  $scope.flashmessage.display = 'none';
		  console.log('editItemSelected event broadcasted');
		  dataService.traverse($scope.metadata, args.path, function(e, node){
			  if (!e){
				  console.log('traversed: ');
				  console.log(node);
				  
				  dataService.retrieve(node.meta.type, node.meta.id, function(e, data){
					  if (!e){
						  $scope.metaNode = node.meta;
						  $scope.editData = data;
						  $scope.templatePath = '../templates/' + args.meta.type + '_edit.html';
						  $scope.eventArgs = args;
						  $scope.safeApply();
					  } else {
						  console.log('Error happened on editing item: ' + e);
					  }
				  });
				  
			  }else{
				  console.log('error traversing: ' + e);
				  //TODO error handling?
				  throw e;
			  }
			  
		  });
	  });
	  
	  $scope.$on('editor_loaded', function(event, args) {
		  
		  $scope.actions = [];
		  $scope.methods = [];
		  
		  $scope.actions_display = "none";
		  $scope.contentScope = event.targetScope;
		 
		  if (event.targetScope.actions != null && event.targetScope.actions.length > 0)
		  {
			  $scope.actions = event.targetScope.actions;
			  $scope.actions_display = "inline";
		  }
		  
		  if (event.targetScope.methods != null)
		  {
			  $scope.methods = event.targetScope.methods;
		  }
	  });
	  
}]);


cmsControllers.controller('ModalContentController', ['$scope', '$modal', '$log', 'dataService', 'AppSession', function($scope, $modal, $log, dataService, AppSession) {
	
	 dataService.setMetaDataToScope($scope, 'data');
	
	  $scope.open = function (type, action) {

	    var modalInstance = $modal.open({
	      templateUrl: '../templates/' + action + '.html',
	      controller: action.toString(),
	      resolve: {
	        data: function () {
	          return $scope.data;
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	}]);


