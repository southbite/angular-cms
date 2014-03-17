'use strict';

/* Services */

var cmsServices = angular.module('cmsServices', []);

cmsServices.factory('systemServices',['$sce', function($sce) {
	 return {
		 attach:function($scope){
			 
			 $scope.to_trusted = function(html_code) {
				  return $sce.trustAsHtml(html_code);
			 };
			 
			 $scope.toArray = function(items, ignore){
				  var returnArray = [];
				  for (var item in items)
				  {
					  if (ignore && item == ignore)
						  continue;
					  else
						  returnArray.push(item);
				  }
					 
				  return returnArray;
			  };
			  
			  $scope.toObjArray = function(items, ignore){
				  var returnArray = [];
				  for (var item in items)
				  {
					  if (ignore && item == ignore)
						  continue;
					  else
					  {
						 // var obj = {key:item, val:items[item]};
						  items[item].meta.objectKey = item;
						  returnArray.push(items[item]);
					  }
						  
				  }
					 
				  return returnArray;
			  };
			  
			  $scope.dataToObjArray = function(items, ignore){
				  var returnArray = [];
				  for (var item in items)
				  {
					  if (ignore && item == ignore)
						  continue;
					  else
					  {
						  returnArray.push(items[item]);
					  }
						  
				  }
					 
				  return returnArray;
			  };
			  
		 }
	 }
}]);