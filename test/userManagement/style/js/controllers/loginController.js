//用户控制模块
var load_from_router = true;
var G_loginType = "";
define(['userManagementModule'], function(userManagement) {
	userManagement.controllers.register('loginController', ['$scope', '$state', 'auxiliaryService', '$stateParams', '$filter', 'userService',
		function($scope, $state, auxiliaryService, $stateParams, $filter, userService) {
			$scope.noStatus = true;
			if ($stateParams.login_type != 'recruiters' && $stateParams.login_type != 'candidates') {
				$state.go("^.login", {
					'login_type': 'candidates'
				});
			}
			$scope.loginType = $stateParams.login_type;
			G_loginType = $stateParams.login_type;
			$scope.changeValue = function() {
				$scope.loginError = false;
				$scope.isInvalid = false;
			}

			$scope.loginFormData = {};
			$scope.dologinIn = function(isValid) {
				if (!isValid) {
					$scope.isInvalid = true;
				} else {
					$scope.isInvalid = false;

					$scope.noStatus = false;
					userService.loginIn($scope.loginType, $scope.loginFormData).then(function(value) {
						if (value) {
							var from = $stateParams["from"];
							$state.go(from && from != "login" ? from : $scope.loginType);
						} else {
							$scope.loginError = true;
						}
						$scope.noStatus = true;
					});

					//更行用户缓冲
					auxiliaryService.resetLoadBasicInfo();
				}
			}
		}
	]);
});