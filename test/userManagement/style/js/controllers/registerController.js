/**
 * 用户管理用户注册
 */
define(['userManagementModule'], function(userManagement) {
	userManagement.controllers.register('registerController', ['$scope', '$state', 'userService', '$timeout', '$stateParams',
		function($scope, $state, userService, $timeout, $stateParams) {
			//按钮提交状态
			$scope.loading = false;
			if ($stateParams.login_type != 'recruiters' && $stateParams.login_type != 'candidates') {
				$state.go("^.login", {
					'login_type': 'candidates'
				});
			}
			console.log("+");
			console.log($stateParams);console.log("+");
			$scope.loginType = $stateParams.login_type;
			console.log($scope.loginType);
			//验证注册的方式是邮箱还在手机
			$scope.validateRegisterType = function() {
				var username = $scope.formData.username;
				if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(username)) {
					$scope.registerType = "mobile";
				} else if (/^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/.test(username)) {
					$scope.registerType = "email";
				} else {
					$scope.registerType = "";
				}
				//清空验证码
				$scope.formData.code = "";
			}

			//验证码提示内容
			$scope.codeNotice = "发送验证码";
			//能否发送验证码
			$scope.codeEnable = true;
			//发送验证吗
			$scope.sendMobile = function() {
				//判断手机好是否已经输入
				if ($scope.formData.username && $scope.codeEnable) {
					userService.sendMobile($scope.loginType, $scope.formData.username).then(function(data) {
						if (data && data.isError) {
							$scope.errorInfo = data;
						} else {
							alert("验证码发送成功！");
							$scope.codeEnable = false;
							//倒计时
							var count = 59;
							$scope.codeNotice = count;
							$scope.enable = false;
							var countdowntime = setInterval(function() {
								if (count > 0) {
									count--;
									$scope.codeNotice = count;
								} else {
									$scope.codeEnable = true;
									$scope.codeNotice = "重发验证码";
									clearInterval(countdowntime);
								}
								$scope.$digest();
							}, 1000);
						}
					});
				}
			}

			//表单提交的错误信息


			//提交表单
			$scope.dologinIn = function(invalid) {
				$scope.loading = true;
				if (invalid) {
					if ($scope.registerType == "mobile") {
						var updata = {};
						updata.mobile = $scope.formData.username;
						updata.code = $scope.formData.code;
						updata.pwd = $scope.formData.pwd;
						//手机注册
						userService.mobileRegister($scope.loginType, updata).then(function(data) {
							if (data && data.isError) {
								$scope.errorInfo = data;
							} else {
								//注册成功，自动登录
								if ($scope.loginType == 'candidates') {
									var loginData = {};
									loginData.username = updata.mobile;
									loginData.password = updata.pwd;
									userService.loginIn('candidates', loginData).then(function(value) {
										if (value) {
											//跳转到c用户页面
											$state.go('candidates.edit');
										} else {
											$state.go('user.login.candidates');
										}
									})
								} else if ($scope.loginType == 'recruiters') {
									var loginData = {};
									loginData.username = updata.mobile;
									loginData.password = updata.pwd;
									userService.loginIn('recruiters', loginData).then(function(value) {
										$state.go('recruiters.setting.company');
									})
								}

							}
							$scope.loading = false;
						});
					} else if ($scope.registerType == "email") {
						var updata = {};
						updata.email = $scope.formData.username;
						updata.pwd = $scope.formData.pwd;
						//邮箱注册
									console.log("-");
			console.log($stateParams);console.log("-");
						userService.mailRegister($scope.loginType, updata).then(function(data) {
							console.log("=============" + $scope.loginType);
							if (data && data.isError) {
								$scope.errorInfo = data;
							} else {
								$state.go("^.notice", {
									'code': $scope.formData.username,
									'type': $scope.loginType
								});
							}
							$scope.loading = false;
						});
					}
				}

			}




		}
	]);



});