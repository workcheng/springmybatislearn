/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'], function(candidates) {
	//=================================创建编辑joho  的controller对象=================================
	candidates.controllers.register('tahoEditController', ['$scope',
		'$stateParams',
		'$filter',
		'tahoService',
		'$q',
		'$timeout',
		'viewTahoService',
		'userService',
		function(
			$scope,
			$stateParams,
			$filter,
			tahoService,
			$q,
			$timeout,
			viewTahoService,
			userService) {
			/*************定义参数***********/
			//获取joho详细信息
			$scope.refreshTahoDetail = function() {
				var deffer = $q.defer();
				tahoService.getTaho().then(function(data) {
					/*******basic******/
					$scope.basic = data['basic'];
					/*******显示education数据******/
					$scope.educations = data['educations'];
					/******work_experiences******/
					$scope.work_experiences = data['work_experiences'];
					/*****显示language数据******/
					$scope.languages = data['languages'];
					/*****显示 skill 数据******/
					$scope.skills = data['skills'];
					/*****显示certifications数据******/
					$scope.certificates = data['certificates'];
					/******显示motivation 数据******/
					$scope.motivation = data['motivation'];
					/******显示 value数据******/
					$scope.value = data['value'];
					/******显示iq数据******/
					$scope.IQ = data['iq'];
					/******显示thinking_pattern数据*******/
					$scope.thinking_pattern = data['thinking_pattern'];
					/**********显示eq数据***********/
					$scope.EQ = data['eq'];
					/**********显示behaviur数据***********/
					$scope.behavior_style = data['behavior_style'];

					/*用于教育与工作经验的显示*/
					$scope.canvasData = {};
					$scope.canvasData.work_experiences = data['work_experiences'];
					$scope.canvasData.educations = data['educations'];


					deffer.resolve($scope.basic.taho_id);
				});
				return deffer.promise;
			}

			//通过js调整模块高度
			$scope.refush = function() {
				//生成状态信息
				$timeout(function() {
					var tabsGroup = $("[class^=tab-0gmi-group-2],[class^=tab-0gmi-group-3]");
					angular.forEach(tabsGroup, function(tabs) {

						$(tabs).find('.tab').css('height', '');
						$(tabs).find('.filp').css('height', '');
						var thisHeight = [];

						var tabClass = $(tabs).find('.tab');
						angular.forEach(tabClass, function(item) {
							thisHeight.push($(item).height());
						});

						var filps = $(tabs).find('.front');
						angular.forEach(filps, function(filp) {
							thisHeight.push($(filp).height());
						});

						var maxHeight = Math.max.apply(Math, thisHeight); //最大值
						$(tabs).find('.tab').height(maxHeight);
						$(tabs).find('.filp').height(maxHeight);
					});
				}, 10);
			}

			//获取taho信息
			$scope.refreshTahoDetail().then(function() {
				$scope.refush();
			});

			//获取你的访客
			var userId = userService.getUserInfo().user_id;
			viewTahoService.getViewTaho(userId).then(function(data) {
				$scope.viewTahos = data.view_history;
			});


			/********其他*********/
			//设定打开的编辑模块
			$scope.openEditModuleTag = function(tag, boolen) {
				//页面跳转到某个位置
				var gotoAnhor = function(tag) {
					$("html,body").animate({
						scrollTop: $("#" + tag).offset().top - 100
					}, 200);
				}
				if (tag == $scope.editModuleTag || !tag) {
					if (!boolen) {
						$scope.editModuleTag = "";
					}
				} else {
					$scope.editModuleTag = tag;
					$timeout(function() {
						gotoAnhor(tag);
					}, 0)
				}
			}

			//选中弹出框类型
			$scope.editPluagin = function(id) {
				$scope.editPluaginName = id;
			}

		}
	]);

	//=================================右侧编辑状态框==================================
	candidates.controllers.register('tahoEditStautsController', ['$scope', '$filter',
		function($scope, $filter) {
			//joho 模块组合
			$scope.tahoModules = [{
				'name': '个人信息',
				'tag': 'basic'
			}, {
				'name': '工作期望',
				'tag': 'expect'
			}, {
				'name': '教育信息',
				'tag': 'educations'
			}, {
				'name': '工作经验',
				'tag': 'work_experiences'
			}, {
				'name': '语言',
				'tag': 'languages'
			}, {
				'name': '技能',
				'tag': 'skills'
			}, {
				'name': '证书',
				'tag': 'certificates'
			}];

			//判断是否编辑完成
			$scope.isEdited = function(tag) {
				if ($filter('isEmptyFilter')($scope[tag])) {
					return false;
				} else {
					return true;
				}
			}
		}
	]);


	//=================================添加basic模版=================================
	candidates.controllers.register('tahoBasicController', ['$scope', '$filter', 'tahoService', 'auxiliaryService', 'userService',
		function($scope, $filter, tahoService, auxiliaryService, userService) {
			//获取最原始的数据
			$scope.$watch('basic', function(data) {
				if (angular.isDefined(data)) {
					var getData = angular.copy(data);
					if (getData.industries.length > 0 && getData.industries[0].hasOwnProperty('industry_id')) {
						getData.industry_id = getData.industries[0]['industry_id'];
					}
					if (getData.positions.length > 0 && getData.positions[0].hasOwnProperty('position_id')) {
						getData.pref_position_id = getData.positions[0]['position_id'];
					}
					if (getData.locations.length > 0 && getData.locations[0].hasOwnProperty('location_id')) {
						getData.location_id = getData.locations[0]['location_id'];
					}
					$scope.basicModule = getData;
					return;
				}
			});
			//获取辅助表内容
			auxiliaryService.getAuxiliaryInfo().then(function(data) {
				$scope.industyList = data.industies;
				$scope.companyTypeList = data.company_types;
			});

			//设定出生日期(/*暂时使用，到时计划做成指令，或服务，目标是指令*/)(注意点)
			var birthYearList = [];
			for (var i = 1945; i <= 2005; i++) {
				birthYearList.push(i);
			}
			$scope.birthYearList = birthYearList;

			//能否输入小孩个数
			$scope.editChildEnable = false;
			$scope.childrenBoxChange = function() {
				if ($scope.editChildEnable)
					$scope.basicModule.children = "";
			}

			//定义form表单,用于获取正确的提交数据
			var formDataStand = {
				"name": "",
				"avatar": "",
				"avatar_data": "",
				"mobile_number": "",
				"email": "",
				"address_id": "",
				"marriage": "",
				"children": "",
				"description": "",
				"birth_year": "",
				"birth": null,
				"gender": "",
				"pref_salary": "",
				"pref_travel_id": "",
				"pref_travel_value": "",
				"industry_id": "",
				"position_id": "",
				"location_id": "",
				"employment_type_id": "",
				"pref_position_id": "",
				"pref_company_type": "",
			};

			//是否显示提示，用于未修改表单就点击提交，检测是否通过
			$scope.showError = false;

			//提交position表单  valid：是否通过验证；dirty：是否修改过
			$scope.submitForm = function(valid, dirty) {
				if (!valid) {
					$scope.showError = true;
				} else {
					if (dirty) { //判断position是否修改过
						//对提交结果进行处理
						var formData = angular.copy($scope.basicModule);
						//对头像进行处理
						var resultForm = $filter('standardArr')(angular.copy(formDataStand), formData);

						if (resultForm.avatar_data) {
							delete resultForm.avatar;
						}
						tahoService.changeTaho('basic', resultForm).then(function(data) {
							$scope.showError = false;
							$scope.refreshTahoDetail().then(function() { //刷新数据
								//修改userInfo信息
								if (resultForm.name != $scope.userInfo.name) {
									$scope.userInfo.name = resultForm.name;
									var change = true;
								}
								if ($scope.basic.avatar_url != $scope.userInfo.avatar) {
									$scope.userInfo.avatar = $scope.basic.avatar_url;
									var change = true;
								}
								if (change) {
									userService.setUserInfo($scope.userInfo);
								}

								$scope.openEditModuleTag(''); //关闭编辑框
								$scope.refush();
							});
						});

					} else {
						//关闭编辑框
						$scope.openEditModuleTag('');
					}
				}
			}
		}
	]);

	//=================================教育模块编辑=================================
	candidates.controllers.register('tahoEducationsController', ['$scope', '$filter', '$state', 'tahoService',
		function($scope, $filter, $state, tahoService) {
			//语言数组中的对象模版
			var objInArr = {
				"university_id": "",
				"edu_level_id": "",
				"pref_edu_level_id": "",
				"start_time": "",
				"end_time": "",
				"majors": [{
					"major_id": ''
				}],
			};

			//获取最原始的数据
			$scope.$watch('educations', function(data) {
				if (angular.isDefined(data)) {
					//对数据进行排序默认最大的结束时间在最上面
					//$scope.$apply(function(){
					var cacheData = angular.copy(data);
					cacheData.sort(function(a, b) {
						if (a['end_time'] == 0) {
							if (b['end_time'] == 0) {
								return a['start_time'] > b['start_time'] ? -1 : 1;
							} else {
								return -1;
							}
						} else {
							return a['end_time'] > b['end_time'] ? 1 : -1;
						}
					});
					$scope.educationsModule = angular.copy(cacheData);
					//});
					$scope.addEducation();
					return;
				}
			});

			//获取某个教育对象是否存在的方法
			$scope.educationIsDisable = function(data, field) {
				var objIsDisable = {};
				objIsDisable.style_1 = false;
				objIsDisable.style_2 = false;
				objIsDisable.style_3 = false;
				objIsDisable.style_4 = false;
				objIsDisable.style_5 = false;
				
				if ($filter('isEmptyFilter')(data.university_id || data.university_name)) {
					//请输入大学
					objIsDisable.style_1 = true;
				}
				if ($filter('isEmptyFilter')(data.edu_level_id) && $filter('isEmptyFilter')(data.pref_edu_level_id)) {
					//请选择商务学历或学位学历
					objIsDisable.style_2 = true;
					objIsDisable.style_5 = true;
				}
				if ($filter('isEmptyFilter')(data.start_time) || (data.end_time !== 0 && $filter('isEmptyFilter')(data.end_time))) {
					//请选择开始时间和结束时间
					objIsDisable.style_3 = true;
					objIsDisable.style_4 = true;
				}
				if (objIsDisable.style_3 == false && data.end_time !== 0 && data.end_time < data.start_time) {
					//开始时间小于结束时间
					objIsDisable.style_4 = true;
				}
				if (data.start_time === 0) {
					objIsDisable.style_3 = false;
					objIsDisable.style_6 = true;
				}
				if (!$filter('isEmptyFilter')(data.edu_level_id) && ($filter('isEmptyFilter')(data.majors) || (data.majors.length > 0 && $filter('isEmptyFilter')(data.majors[0].major_id||data.majors[0].major_name)))) {
					//专业不为空
					objIsDisable.style_5 = true;
				}
				var educationIsUndefined = objIsDisable.style_1 && objIsDisable.style_2 && objIsDisable.style_3 && objIsDisable.style_4 && objIsDisable.style_5
				if (educationIsUndefined) {
					return false;
				} else {
					if (field) {
						return objIsDisable[field];
					} else {
						return objIsDisable.style_1 || objIsDisable.style_2 || objIsDisable.style_3 || objIsDisable.style_4 || objIsDisable.style_5;
					}
				}
			}


			//保存的对象模版
			var formDataStand = [
				"university_id",
				"university_name",
				"edu_level_id",
				"pref_edu_level_id",
				"start_time",
				"end_time",
				"major_ids"
			];

			//删除一组数据
			$scope.removeEducation = function(index) {
					$scope.educationsModule.splice(index, 1);
				}
				//添加一组数据
			$scope.addEducation = function() {
				$scope.educationsModule.push(angular.copy(objInArr));
			}

			//提交表单
			$scope.submitForm = function() {
				var formData = angular.copy($scope.educationsModule);
				var showError = false;
				for (var i = 0; i < formData.length; i++) {
					if ($scope.educationIsDisable(formData[i])) {
						var showError = true;
						break;
					}
				}

				if (showError) {
					$scope.showError = true;
				} else {
					//获取输入的值
					formData = $filter('clearEmptyByFiled')(formData, 'university_name');
					if (!angular.equals(formData, $scope.educations)) { //判断是否修改过
						angular.forEach(formData, function(data) {
							data.major_ids = [];
							if (angular.isDefined(data.majors[0]) && data.majors[0].hasOwnProperty('major_id'))
								if(data.majors[0]['major_id'] == 0 && data.majors[0]['major_name'] && data.majors[0]['major_name'].length >0){
									data.major_ids.push(data.majors[0]['major_name']);
								}else{
									data.major_ids.push(data.majors[0]['major_id']);
								}
						});
						//对提交结果进行处理
						var resultForm = $filter('getArrayFromObject')(formData, formDataStand);
						for (var k = 0; k < resultForm.length; k++) {
							if (0 == resultForm[k].university_id) {
								resultForm[k].custom_university = resultForm[k].university_name;
							}
							delete resultForm[k].university_name;
						}
						//修改taho的工作经验
						tahoService.changeTaho('educations', resultForm).then(function(data) {
							$scope.showError = false;
							$scope.refreshTahoDetail().then(function() { //刷新数据
								$scope.openEditModuleTag(''); //关闭编辑框
							});
						});
					} else {
						//关闭编辑框
						$scope.openEditModuleTag('');
					}
				}
			}

		}
	]);

	//=================================工作经验模块=================================
	candidates.controllers.register('tahoWorkExperiencesController', ['$scope', '$filter', 'tahoService', 'auxiliaryService',
		function($scope, $filter, tahoService, auxiliaryService) {
			//语言数组中的对象模版
			var objInArr = {
				"company_name": "",
				"industry_id": "",
				"position_id": "",
				"start_time": "",
				"end_time": "",
			};

			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data) {
				$scope.industyList = data.industies;
				//$scope.companyTypeList = data.company_types;
			});

			//获取最原始的数据
			$scope.$watch('work_experiences', function(data) {
				if (angular.isDefined(data)) {
					$scope.workExperiencesModule = angular.copy(data);
					$scope.addWorkExperience();
					return;
				}
			});


			//获取某个工作经验对象是否存在的方法
			$scope.workIsDisable = function(data, field) {
				var objIsDisable = {};
				objIsDisable.style_1 = false;
				objIsDisable.style_2 = false;
				objIsDisable.style_3 = false;
				objIsDisable.style_4 = false;
				objIsDisable.style_5 = false;
				if ($filter('isEmptyFilter')(data.company_name)) {
					//请输入公司名称
					objIsDisable.style_1 = true;
				}
				if ($filter('isEmptyFilter')(data.industry_id)) {
					//请输入行业类型
					objIsDisable.style_2 = true;
				}
				if ($filter('isEmptyFilter')(data.start_time) || (data.end_time !== 0 && $filter('isEmptyFilter')(data.end_time))) {
					//请选择开始时间和结束时间
					objIsDisable.style_3 = true;
					objIsDisable.style_4 = true;
				}
				if (objIsDisable.style_3 == false && data.end_time !== 0 && data.end_time < data.start_time) {
					//开始时间小于结束时间
					objIsDisable.style_4 = true;
				}
				if (data.start_time === 0) {
					objIsDisable.style_3 = false;
					objIsDisable.style_6 = true;
				}
				if ($filter('isEmptyFilter')(data.position_id)) {
					//请输入工作职位
					objIsDisable.style_5 = true;
				}
				var educationIsUndefined = objIsDisable.style_1 && objIsDisable.style_2 && objIsDisable.style_3 && objIsDisable.style_4 && objIsDisable.style_5
				if (educationIsUndefined) {
					return false;
				} else {
					if (field) {
						return objIsDisable[field];
					} else {
						return objIsDisable.style_1 || objIsDisable.style_2 || objIsDisable.style_3 || objIsDisable.style_4 || objIsDisable.style_5;
					}
				}
			}





			//保存的对象模版
			var formDataStand = [
				"company_name",
				"industry_id",
				"position_id",
				"start_time",
				"end_time"
			];

			//删除一组数据
			$scope.removeWorkExperience = function(index) {
					$scope.workExperiencesModule.splice(index, 1);
				}
				//添加一组数据
			$scope.addWorkExperience = function() {
				$scope.workExperiencesModule.push(angular.copy(objInArr));
			}

			//提交表单
			$scope.submitForm = function() {
				var formData = angular.copy($scope.workExperiencesModule);
				var showError = false;
				for (var i = 0; i < formData.length; i++) {
					if ($scope.workIsDisable(formData[i])) {
						var showError = true;
						break;
					}
				}

				if (showError) {
					$scope.showError = true;
				} else {
					//获取输入的值
					formData = $filter('clearEmptyByFiled')(formData, 'company_name');
					if (!angular.equals(formData, $scope.work_experiences)) { //判断是否修改过
						//对提交结果进行处理
						var resultForm = $filter('getArrayFromObject')(formData, formDataStand);
						//修改taho的工作经验
						tahoService.changeTaho('work_experiences', resultForm).then(function(data) {
							$scope.showError = false;
							$scope.refreshTahoDetail().then(function() { //刷新数据
								$scope.openEditModuleTag(''); //关闭编辑框
							});
						});
					} else {
						//关闭编辑框
						$scope.openEditModuleTag('');
					}
				}
			}
		}
	]);



	//=================================语言=================================
	candidates.controllers.register('tahoLanguagesController', ['$scope', '$filter', '$state', 'tahoService', 'auxiliaryService',
		function($scope, $filter, $state, tahoService, auxiliaryService) {
			//语言数组中的对象模版
			var objInArr = {
				'language_id': '',
				'language_level_id': "",
			};

			//获取最原始的数据
			$scope.$watch('languages', function(data) {
				if (angular.isDefined(data)) {
					$scope.languagesModule = angular.copy(data);
					$scope.addLanguage();
					return;
				}
			});

			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data) {
				$scope.languagesList = data.languages;
				$scope.languageLevelsList = data.language_levels;
			});

			//删除一组数据
			$scope.removeLanguage = function(index) {
					$scope.languagesModule.splice(index, 1);
				}
				//添加一组数据
			$scope.addLanguage = function() {
				$scope.languagesModule.push(angular.copy(objInArr));
			}

			/******edit****/
			//定义language表单,用于获取正确的提交数据
			var formDataStand = ['language_id', 'language_level_id'];
			//提交基础信息表单
			$scope.submitForm = function() {
				//获取输入的值
				var formData = angular.copy($scope.languagesModule);
				var able = true;
				//判断数据是否合法，一旦填写了语言就必须填写熟练度，或添加了熟练度就必须添加语音
				angular.forEach(formData, function(data) {
					if (data.language_id && !data.language_level_id) {
						able = false;
					} else {
						if (!data.language_id && data.language_level_id) {
							able = false;
						}
					}
				});
				if (able) {
					//从对象数组中只获取需要的字段组成的数组
					var resultForm = $filter('getArrayFromObject')(formData, formDataStand);
					var resultForm = $filter('clearEmptyByFiled')(resultForm, 'language_id');
					//修改joho的工作经验
					tahoService.changeTaho('languages', resultForm).then(function(data) {
						$scope.showError = false;
						$scope.refreshTahoDetail().then(function() { //刷新数据
							$scope.openEditModuleTag(''); //关闭编辑框
							$scope.refush();
						});
					});
				}
			}
		}
	]);


	//=================================技能=================================
	candidates.controllers.register('tahoSkillsController', ['$scope', '$filter', 'tahoService', 'auxiliaryService',
		function($scope, $filter, johoService, auxiliaryService) {
			//新增数组中的对象模版
			var objInArr = {
				'skill_id': '',
			};

			//获取最原始的数据
			$scope.$watch('skills', function(data) {
				if (angular.isDefined(data)) {
					$scope.skillsModule = angular.copy(data);
					$scope.addSkill();
					return;
				}
			});

			//删除一组数据
			$scope.removeSkill = function(index) {
					$scope.skillsModule.splice(index, 1);
				}
				//添加一组数据
			$scope.addSkill = function() {
				$scope.skillsModule.push(angular.copy(objInArr));
			}

			/******edit****/
			//定义language表单,用于获取正确的提交数据
			var formDataStand = ['skill_id'];
			//提交基础信息表单
			$scope.submitForm = function() {
				//获取输入的值
				var formData = angular.copy($scope.skillsModule);
				//从对象数组中只获取需要的字段组成的数组
				var resultForm = $filter('getArrayFromObject')(formData, 'skill_id');
			 	var concatResultForm = resultForm.concat($filter('getArrayFromObjectExtended')(formData, 'skill_name','skill_id',""));
				//修改joho的工作经验
				johoService.changeTaho('skills', concatResultForm).then(function(data) {
					$scope.showError = false;
					$scope.refreshTahoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
			}
		}
	]);




	//=================================证书=================================
	candidates.controllers.register('tahoCertificationsController', ['$scope', '$filter', 'tahoService', 'auxiliaryService',
		function($scope, $filter, tahoService, auxiliaryService) {
			//新增数组中的对象模版
			var objInArr = {
				'certificate_id': '',
			};

			//获取最原始的数据
			$scope.$watch('certificates', function(data) {
				if (angular.isDefined(data)) {
					$scope.certificatesModule = angular.copy(data);
					$scope.addCertificate();
					return;
				}
			});

			//删除一组数据
			$scope.removeCertificate = function(index) {
					$scope.certificatesModule.splice(index, 1);
				}
				//添加一组数据
			$scope.addCertificate = function() {
				$scope.certificatesModule.push(angular.copy(objInArr));
			}

			/******edit****/
			//定义language表单,用于获取正确的提交数据
			var formDataStand = ['certificate_id'];
			//提交基础信息表单
			$scope.submitForm = function() {
				//获取输入的值
				var formData = angular.copy($scope.certificatesModule);
				//从对象数组中只获取需要的字段组成的数组
				var resultForm = $filter('getArrayFromObject')(formData, 'certificate_id');
				//修改joho的工作经验
				tahoService.changeTaho('certificates', resultForm).then(function(data) {
					$scope.showError = false;
					$scope.refreshTahoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
			}
		}
	]);

});