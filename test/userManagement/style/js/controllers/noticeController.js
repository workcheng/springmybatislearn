/**
 * 用户管理用户注册
 */
define(['userManagementModule'], function(userManagement) {
	userManagement.controllers.register('noticeController', ['$scope', '$state', '$stateParams', 'userService',
		function($scope, $state, $stateParams, userService) {
			//判断是不是验证邮箱登录
			console.log($stateParams);
			$scope.code = $stateParams.code;
			$scope.RegisterType = $stateParams.RegisterType;
			if (/^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/.test($scope.code)) {
				$scope.type = "notice";
			} else {
				$scope.type = "success";
			}
			if ($scope.type == "success") {
				console.log($scope.type);
				//发送邮箱验证吗
				var data = {};
				data.code = $stateParams.code;
				if ($scope.RegisterType == 'candidates') {
					userService.registerByMail(data).then(function(info) {
						if (info.isError) {
							alert(info.message);
							$state.go("userManagement.login");
						} else {
							var timeAccess = setInterval(function() {
								clearInterval(timeAccess);
								countDown();
							}, 0);
						}
					}, function(info) {
						console.log(info);
					});
				} else if ($scope.RegisterType == 'recruiters') {
					userService.businessRegisterByMail(data).then(function(info) {
						if (info.isError) {
							alert(info.message);
							$state.go("userManagement.login");
						} else {
							var timeAccess = setInterval(function() {
								clearInterval(timeAccess);
								countDown();
							}, 0);
						}
					}, function(info) {
						console.log(info);
					});
				}

			} else {
				//循环访法是否已经登录
				if (userService.getUserInfo()) {
					var timeAccess = setInterval(function() {
						var userInfo = userService.getUserInfo();
						if (userInfo && userInfo.username) {
							clearInterval(timeAccess);
							countDown();
						}
					}, 0);
				} else {
					var timeAccess = setInterval(function() {
						var userInfo = userService.getUserInfo();
						if (userInfo && userInfo.username) {
							clearInterval(timeAccess);
							countDown();
						}
					}, 1000);
				}
			}

			//发送邮箱验证吗
			function countDown() {
				$scope.$apply(function() {
					$scope.type = "success";
					$scope.time = 3;
				})
				var countDownTime = setInterval(function() {
					$scope.time--;
					$scope.$digest();
					if ($scope.time <= 0) {
						clearInterval(countDownTime);
						console.log('+++++++++');
						if ($scope.RegisterType == 'candidates') {
							//跳转到个人编辑页面
							$state.go('candidates.taho');
						} else if ($scope.RegisterType == 'recruiters') {
							$state.go('userManagement.login', {
								'login_type': 'recruiters'
							});
						}

					}
				}, 1000);
			}

			//立即跳转
			$scope.goNow = function() {
				$scope.RegisterType = $stateParams.RegisterType;
				//发送邮箱验证吗
				var data = {};
				data.code = $stateParams.code;
				if ($scope.RegisterType == 'candidates') {
					userService.registerByMail(data).then(function(info) {
						var timeAccess = setInterval(function() {
							clearInterval(timeAccess);
							countDown();
						}, 0);
					}, function(info) {
						console.log(info);
					});
				} else if ($scope.RegisterType == 'recruiters') {
					userService.businessRegisterByMail(data).then(function(info) {
						var timeAccess = setInterval(function() {
							clearInterval(timeAccess);
							countDown();
						}, 0);
					}, function(info) {
						console.log(info);
					});
				}

			}



		}
	]);
});