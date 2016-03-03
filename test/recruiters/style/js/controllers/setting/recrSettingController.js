/**
 * 加载招聘这-taho展示和编辑
 */
define(['recruitersModule'], function(recruiters) {
	//=================================招聘者设置对象=================================
	recruiters.controllers.register('recrSettingController', ['$scope', 'userService', function($scope, userService) {
		//获取用户信息
		$scope.userInfo;
		$scope.setting = {};
		$scope.setting.editSetting = "";
		$scope.setting.loading = false;
		$scope.update = {};
		//监听编辑的模块
		$scope.$watch('setting.editSetting', function(tag) {
			switch (tag) {
				case 'business_user_name':
					$scope.update.editName = angular.copy($scope.userInfo.business_user_name);
					break;
				case 'mobile_number':
					$scope.update.mobile_number = "";
					$scope.update.code = "";
					break;
				case 'email':
					$scope.update.email = "";
					$scope.update.code = "";
					$scope.update.mailCodeEnable = true;
					break;
				case 'change_password':
					;
					break;
				case 'privacy_setting':
					setPrivacySetting(angular.copy($scope.userInfo.privacy_setting));
					break;
			}
		});

		//表单提示重置
		$scope.cancelForm = function(form) {
			form.$setPristine();
			$scope.setting.editSetting = '';
		}


		function setPrivacySetting(str) {
			var strs = [];
			strs = str.split(",");
			$scope.update.privacy = {};
			$scope.update.privacy.privacy_1 = strs[0];
			$scope.update.privacy.privacy_2 = strs[1];
			$scope.update.privacy.privacy_3 = strs[2];
			$scope.update.privacy.privacy_4 = strs[3];
			$scope.update.privacy.privacy_5 = strs[4];
		}

		//修改全局的userInfo信息
		$scope.changeUserInfo = function(data) {
			if ($scope.setting.editSetting == 'change_password') {
				if ($scope.userInfo.hasOwnProperty('loginInfo') && $scope.userInfo.loginInfo.hasOwnProperty('password')) {
					$scope.userInfo.loginInfo.password = data;
				}
			} else {
				$scope.userInfo[$scope.setting.editSetting] = data;
				//设置缓存的数据
				userService.setUserInfo(angular.copy($scope.userInfo));
			}
			$scope.update = {};
		}



	}]);


	//============================个人信息=================================
	recruiters.controllers.register('recrSettingUserController', ['$scope', 'recrSettingService', 'userService', '$q', function($scope, recrSettingService, userService, $q) {
		//提交表单
		$scope.submitForm = function(valid) {
			if (valid) {
				$scope.setting.loading = true;
				//编辑用户名
				if ($scope.setting.editSetting == 'business_user_name') {
					recrSettingService.updateName($scope.update.editName).then(function() {
						$scope.setting.loading = false;
						//修改userInfo的name信息
						$scope.changeUserInfo($scope.update.editName);
						$scope.setting.editSetting = '';
					});
				}
			}
		}

		//上传头像
		$scope.uploadAvatar = function(data) {
			if (angular.isDefined(data)) {
				//修改头像
				$scope.setting.loading = true;
				var deffer = $q.defer();
				recrSettingService.updateAvatar(data).then(function(info) {
					$scope.userInfo.avatar = info.url;
					//设置缓存的数据
					userService.setUserInfo(angular.copy($scope.userInfo));
					$scope.setting.loading = false;
					//修改userInfo的name信息
					deffer.resolve(data);
				});
				return deffer.promise;
			}
		}

	}]);

	//=================================公司信息=================================
	recruiters.controllers.register('recrSettingCompanyController', ['$scope', '$filter', 'auxiliaryService', 'userService', 'recrSettingService', 'CONFIG', '$q', function($scope, $filter, auxiliaryService, userService, recrSettingService, CONFIG, $q) {
		//获取最原始的数据
		$scope.$watch('comInfo', function(data) {
			if (angular.isDefined(data)) {
				var getData = angular.copy(data);
				$scope.comInfoModule = $scope.comInfo;
				return;
			}
		});



		//获取joho详细信息
		$scope.refreshJohoDetail = function() {
			var deffer = $q.defer();
			recrSettingService.getCompanyInfo().then(function(data) {
				/*********显示comInfo数据*********/
				$scope.comInfo = data;

				//广播给兄弟节点基本信息
				var obj = {}
				obj.company_name = $scope.comInfo.company_name;
				obj.short_company_name = $scope.comInfo.job_status;
				obj.industry_id = $scope.comInfo.job_id;
				obj.location_id = $scope.comInfo;
				obj.company_size_type_id = $scope.comInfo;
				obj.company_website = $scope.comInfo;
				obj.company_type_id = $scope.comInfo;
				obj.company_logo = $scope.comInfo;
				obj.company_introduce = $scope.comInfo;
				$scope.$emit('comInfo', obj);
				deffer.resolve();
			});
			return deffer.promise;
		}


		$scope.showError = false;

		//用于获取正确的提交数据
		var formDataStand = {
			"company_name": '',
			"short_company_name": '',
			"industry_id": '',
			"location_id": '',
			"company_size_type_id": '',
			"company_website": '',
			"company_type_id": '',
			"company_logo": '',
			"company_introduce": '',
		};

		//定义常用变量
		auxiliaryService.getAuxiliaryInfo().then(function(data) {
			$scope.industyList = data.industies;
			$scope.companyTypeList = data.company_types;
		});
		//获取企业大小
		$scope.companyTypeSizeList = CONFIG.companyTypeSize;

		//warnMessage作为判断是否显示提示信息（只有点击保存时才会显示是否有填写完整公司信息）
		$scope.warnMessage = 0;
		//表单提交
		$scope.submitForm = function(valid, dirty) {
			//保存公司信息时，先判断是否将必填信息填写完整，若信息不完整，将调到页面最上面，显示提示信息
			$scope.warnMessage = 1;
			if ($scope.comInfoModule == null || $scope.comInfoModule.company_name == null || $scope.comInfoModule.short_company_name == null ||
				$scope.comInfoModule.industry_id == null || $scope.comInfoModule.industry_id == 0 || $scope.comInfoModule.company_type_id == null ||
				$scope.comInfoModule.company_type_id == 0 || $scope.comInfoModule.location_id == null || $scope.comInfoModule.location_id == 0 ||
				$scope.comInfoModule.company_size_type_id == null || $scope.comInfoModule.company_size_type_id == 0) {
				window.scroll(0, 0);
			}
			if (!valid) {
				$scope.showError = true;
			} else {
				if (dirty) { //判断comInfo是否修改过
					//对提交结果进行处理
					var formData = angular.copy($scope.comInfoModule);
					//对头像进行处理
					var resultForm = $filter('standardArr')(angular.copy(formDataStand), formData);
					console.log(resultForm['company_logo']);
					//判断company_logo 是否为base64格式
					if (resultForm['company_logo'].indexOf('base64', 0) < 0) {
						console.log(resultForm['company_logo'].indexOf('base64', 0));
						resultForm['company_logo'] = resultForm['company_logo'];
					} else if (resultForm['company_logo']) {
						resultForm['company_logo_data'] = resultForm['company_logo'];
						delete resultForm['company_logo'];
					}

					recrSettingService.updateCompanyInfo(resultForm).then(function() {
						$scope.refreshJohoDetail().then(function() { //刷新数据
						});
						$scope.showEditStatus = false;
						$scope.showEdit = false;

					});
				} else {
					//关闭编辑框
					$scope.showEditStatus = false;
					$scope.showEdit = false;
					$scope.openEditModuleTag('');
				}
				//				$scope.showEditStatus = false;
				//				$scope.showEdit = false;
				alert("保存成功");
				window.scroll(0, 0);
				$("#warn").css("display", "block");
				$scope.warnMessage = 0;
			}
		}


		//获取公司信息数据
		recrSettingService.getCompanyInfo().then(function(data) {
			$scope.comInfo = data;
			$scope.getEdit($scope.comInfo);
		});

		//选中弹出框类型
		$scope.editPluagin = function(id) {
			$scope.editPluaginName = id;
		};
		
		//编辑页面点击取消按钮的操作（当必填信息不完整就提示其必须将公司信息填写完整，若是修改状态即有公司信息，就会到显示页面）
		$scope.cohoCancel = function() {
			if ($scope.comInfoModule == null || $scope.comInfoModule.company_name == null || $scope.comInfoModule.short_company_name == null ||
				$scope.comInfoModule.industry_id == null || $scope.comInfoModule.industry_id == 0 || $scope.comInfoModule.company_type_id == null ||
				$scope.comInfoModule.company_type_id == 0 || $scope.comInfoModule.location_id == null || $scope.comInfoModule.location_id == 0 ||
				$scope.comInfoModule.company_size_type_id == null || $scope.comInfoModule.company_size_type_id == 0) {
					alert("请将公司信息填写完整")
				}else{
					showEditStatus = false;
					$scope.showEditStatus = false;
				}
		};
		

		//上传头像
		$scope.uploadAvatar = function(data) {
			if (angular.isDefined(data)) {
				//修改头像
				$scope.setting.loading = true;
				var deffer = $q.defer();
				recrSettingService.updateAvatar(data).then(function(info) {
					$scope.userInfo.avatar = info.url;
					//设置缓存的数据
					userService.setUserInfo(angular.copy($scope.userInfo));
					$scope.setting.loading = false;
					//修改userInfo的name信息
					deffer.resolve(data);
				});
				return deffer.promise;
			}
		};


		//判断是否显示编辑页面
		$scope.showEdit = false;
		$scope.getEdit = function(data) {
			if (data == null || data.company_name == null || data.short_company_name == null ||
				data.industry_id == null || data.industry_id == 0 || data.company_type_id == null ||
				data.company_type_id == 0 || data.location_id == null || data.location_id == 0 ||
				data.company_size_type_id == null || data.company_size_type_id == 0) {
				$scope.showEdit = true;
			} else {
				$scope.showEdit = false;
			}

//			console.log("ssssss" + data);
//			console.log($scope.showEdit);
		};

	}]);




	//============================我的评价=================================
	recruiters.controllers.register('recrSettingCommentController', ['$scope', '$filter', 'userService', '$state',
		function($scope, $filter, userService, $state) {

		}
	]);


	//=============================账号设置================================
	recruiters.controllers.register('recrSettingAccoutController', ['$scope', 'recrSettingService', function($scope, recrSettingService) {
		//获取验证码
		$scope.codeNotice = "发送验证码";
		//能否发送验证码
		$scope.codeEnable = true;
		//发送验证吗
		$scope.sendMobile = function() {
			//判断手机好是否已经输入
			if ($scope.update.mobile_number && $scope.codeEnable) {
				recrSettingService.sendMobileCode($scope.update.mobile_number).then(function(data) {
					if (data && data.isError) {
						$scope.errorInfo = data;
					} else {
						alert("验证码发送成功！");
						$scope.codeEnable = false;
						//倒计时
						var count = 59;
						$scope.codeNotice = count + "s后重发";
						$scope.enable = false;
						var countdowntime = setInterval(function() {
							if (count > 0) {
								count--;
								$scope.codeNotice = count + "s后重发";
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

		//发送邮箱验证码
		$scope.sendEmail = function() {
			//判断手机好是否已经输入
			if ($scope.update.email && $scope.update.mailCodeEnable) {
				recrSettingService.sendEmailCode($scope.update.email).then(function(data) {
					if (data && data.isError) {
						$scope.errorInfo = data;
					} else {
						alert("验证码发送成功！");
						$scope.update.mailCodeEnable = false;
					}
				});
			}
		}

		//提交表单
		$scope.submitForm = function(valid) {
			if (valid) {
				$scope.setting.loading = true;
				//绑定手机
				if ($scope.setting.editSetting == 'mobile_number') {
					recrSettingService.updateMobile($scope.update.mobile_number, $scope.update.code).then(function(data) {
						$scope.setting.loading = false;
						if (data && data.isError) {
							$scope.errorInfo = data;
						} else {
							//修改userInfo的name信息
							$scope.changeUserInfo($scope.update.mobile_number);
							$scope.setting.editSetting = '';
						}
					});
				} else if ($scope.setting.editSetting == 'change_password' && $scope.update.rePwd == $scope.update.newPwd) {
					//修改密码
					recrSettingService.updatePwd($scope.update.newPwd, $scope.update.oldPwd).then(function(data) {
						$scope.setting.loading = false;
						if (data && data.isError) {
							$scope.errorInfo = data;
						} else {
							//修改userInfo的name信息
							$scope.changeUserInfo($scope.update.newPwd);
							$scope.setting.editSetting = '';
						}
					});
				} else if ($scope.setting.editSetting == 'language') {
					//语言设置
					$scope.setting.editSetting = '';
				} else if ($scope.setting.editSetting == 'email' && $scope.update.code) {
					//修改邮箱
					recrSettingService.updateEmail($scope.update.code).then(function(data) {
						$scope.setting.loading = false;
						if (data && data.isError) {
							$scope.errorInfo = data;
						} else {
							//修改userInfo的email信息
							$scope.changeUserInfo($scope.update.email);
							$scope.setting.editSetting = '';
						}
					});
				}
			}
		}

	}]);


	//=============================隐私设置=================================
	recruiters.controllers.register('recrSettingPrivacyController', ['$scope', 'recrSettingService', function($scope, recrSettingService) {
		//获取要显示的设置
		$scope.$watch('userInfo.privacy_setting', function(data) {
			if (angular.isDefined(data)) {
				privacySetting(data);
			}
		})

		function privacySetting(str) {
			var strs = [];
			strs = str.split(",");
			$scope.privacy_1 = strs[0];
			$scope.privacy_2 = strs[1];
			$scope.privacy_3 = strs[2];
			$scope.privacy_4 = strs[3];
			$scope.privacy_5 = strs[4];
		}


		$scope.submitForm = function(valid) {
			if (valid) {
				$scope.setting.loading = true;
				//编辑隐私内容
				if ($scope.setting.editSetting == 'privacy_setting') {
					//将对象合并成字符串
					var result = angular.copy($scope.update.privacy);
					var str = [];
					for (var key in result) {
						str.push(result[key]);
					}
					var uploadResult = str.join(',');
					recrSettingService.updatePrivacy(uploadResult).then(function() {
						$scope.setting.loading = false;
						//修改userInfo的name信息
						$scope.changeUserInfo(uploadResult);
						$scope.setting.editSetting = '';
					});
				}
			}
		}
	}]);

	//==============================解除关联=================================
	recruiters.controllers.register('recrSettingReleaseController', ['$scope', 'recrSettingService', 'userService', function($scope, recrSettingService, userService) {
		//解除绑定
		$scope.cancelBind = function() {
			$scope.setting.loading = true;
			recrSettingService.cancelBind().then(function() {
				$scope.setting.loading = false;
				//修改userInfo的name信息
				$scope.setting.editSetting = '';
				//登出
				userService.loginOut();
			});
		}
	}]);


});