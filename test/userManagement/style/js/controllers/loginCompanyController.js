//用户控制模块
define(['userManagementModule'],function(userManagement){
	userManagement.controllers.register('loginCompanyController',['$scope','$state','$stateParams','userService',
		function($scope,$state,$stateParams,userService){

		 	$scope.noStatus = true;
		 	$scope.loginType = "companyAdmin";
		 	$scope.changeValue = function(){
		 		$scope.loginError = false;
		 		$scope.isInvalid = false;
		 	}
		 	
			$scope.loginFormData = {};
			$scope.dologinIn = function(isValid){
				if( !isValid ){
					$scope.isInvalid = true;
				}else{
					$scope.isInvalid = false;
					$scope.noStatus = false;
					userService.loginInCompany($scope.loginType,$scope.loginFormData).then(function(value){
						if(value){
							$state.go('company');
						}else{
							$scope.loginError = true;
						}
						$scope.noStatus = true;
					});
				}
			}
	}]);
});
