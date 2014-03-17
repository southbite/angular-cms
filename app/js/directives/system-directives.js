cmsApp.directive ('compileHtml', function($compile) { 
	return  {
	  restrict: 'A',
	  scope: { compileHtml : '=' },
	  replace: true,  
	  link: function (scope, element, attrs) {
		  console.log('compile html happening');
		  console.log(element);
		  console.log(element);
		 
		  scope.$watch('compileHtml', function(html) {
			  element.html(html);
			  $compile(element.contents())(scope.$parent);
		  });
	  }
	}});