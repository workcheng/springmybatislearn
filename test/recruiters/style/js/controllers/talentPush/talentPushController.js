/**
 * 加载招聘这-人才推送
 */
define(['recruitersModule'], function(recruiters) {
	/**********************************人才推送主模块*************************************/
	recruiters.controllers.register('talentPushController', ['$scope', '$state', 'johoService',
		function($scope, $state, johoService) {
			//添加相关页面
			$scope.inculdeHtml = {}
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;

			//页面跳转到创建页面
			$scope.transformCreation = function() {
				//创建joho
				//获取johoname
				var resultForm = {};
				resultForm.joho_name = "";
				johoService.createJoho(resultForm).then(function(data) {
					$state.go("recruiters.joho.edit", {
						'job_id': data['job_id']
					});
				});
			}

			//全局 设定选中的taho
			$scope.gobel = {};
		}
	]);

	/**********************************人才推送-joholist模块*************************************/
	recruiters.controllers.register('talentPushJohoListController', ['$scope', '$state', 'talentPushService', '$stateParams',
		function($scope, $state, talentPushService, $stateParams, $timeout) {
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = false;

			$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				//如果用户不存在并且不再白名单中,跳转到登录页面
				if ($scope.inculdeHtml.loading && toState.controller == "talentPushController") {
					event.preventDefault();
				}
			});

			$scope.main = function() {
				$scope.inculdeHtml.loading = true;
				talentPushService.getPushJohoList().then(function(data) {
					$scope.johoList = data.JoHos;
					$scope.pageNumber = $stateParams.pageNumber;
					$scope.pageCount = data.pageCount;
					$scope.inculdeHtml.loading = false;
				});
			}
			$scope.main();

			//显示某个joho下的具体信息
			$scope.goToTalentList = function(name, jobId) {
				$state.go("^.talentList", {
					'job_id': jobId,
					"joho_name": name
				});
			}

		}
	]);

	/**********************************人才推送-talentlist模块*************************************/
	recruiters.controllers.register('talentPushTalentListController', ['$scope', '$state', 'talentPushService', '$stateParams',
		function($scope, $state, talentPushService, $stateParams) {
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
			$scope.joho_id = $stateParams.job_id;
			$scope.joho_name = $stateParams.joho_name;

			talentPushService.getPushTalentList().then(function(data) {
				$scope.inculdeHtml.loading = false;
				$scope.talentListNew = data.matchingTaHos;
				$scope.talentListOld = data.recommendeTaHos;
			})
		}
	]);

	/**********************************人才推送-talentdetail模块*************************************/
	recruiters.controllers.register('talentPushTalentDetailController', ['$scope', '$state', 'talentPushService', 'johoService', 'dealBreakerService', '$timeout', '$stateParams',
		function($scope, $state, talentPushService, johoService, dealBreakerService, $timeout, $stateParams) {
			//右侧导航条
			$scope.inculdeHtml.rightHtml = "recruiters/views/common/talentPushDetail.html";

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
				}, 50);
			}
			$scope.refush();

			/*************获取比较的信息************/
			if ($stateParams.job_id) {
				//获取joho
				johoService.getJohoDetail().then(function(data) {
					$scope.johoInfo = data;
					$scope.dealBreakers = dealBreakerService.showDealBreaker(data.dealbreak, data);
					$scope.refush();
					$scope.inculdeHtml.loading = false;
					//保存joho信息
					$scope.gobel.johoInfo = data;
				});
				//获取匹配分数和taho
				talentPushService.getPushTalentMatchScore().then(function(data) {
					$scope.score = data[0].score;
					$scope.tahoInfo = data[0].basic;
					$scope.tahoInfo.basic = data[0].basic;
					/*用于教育与工作经验的显示*/
					$scope.canvasData = {};
					$scope.canvasData.work_experiences = data[0].basic['work_experiences'];
					$scope.canvasData.educations = data[0].basic['educations'];
					$scope.inculdeHtml.loading = false;
					/*提取用户信息 */
					$scope.gobel.tahoInfo = {};
					$scope.gobel.tahoInfo.name = $scope.tahoInfo.basic.name;
					$scope.gobel.tahoInfo.avatar = data[0].basic.avatar_url;
					$scope.gobel.tahoInfo.position = data[0].basic.positions[0].position_name;
					$scope.gobel.tahoInfo.userId = data[0].basic.user_id;
					$scope.gobel.tahoInfo.jobId = $stateParams.job_id;
					$scope.refush();
				});
			}
			//taho展示和taho与joho比较之间的切换
			$scope.selectShowInfo = 'taho';
			//查看联系方式
			$scope.showLink = false;
		}
	]);

	/**********************************人才推送-taho比较模块*************************************/
	recruiters.controllers.register('talentPushCompareController', ['$scope', '$state', 'talentPushService', '$stateParams',
		function($scope, $state, talentPushService, $stateParams) {
			$scope.inculdeHtml.rightHtml = "recruiters/views/common/compare.html";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
			$scope.joho_id = $stateParams.job_id;
			$scope.joho_name = $stateParams.joho_name;
			var taho1 = $stateParams.taho_id1;
			var taho2 = $stateParams.taho_id2;
			var taho_ids = taho1 + "," + taho2;
			talentPushService.getPushTalentMatchScore('', taho_ids).then(function(data) {
				$scope.inculdeHtml.loading = false;
				$scope.tahoInfo1 = data[0];
				$scope.tahoInfo2 = data[1];
			});
		}
	]);


	/**********************************人才推送-详情的右侧信息*************************************/
	recruiters.controllers.register('talentPushDetailRight', ['$scope', '$filter', '$rootScope', '$stateParams', 'talentPushService', '$state', 'openFileLayout',
		function($scope, $filter, $rootScope, $stateParams, talentPushService, $state, openFileLayout) {
			//隐藏拒绝反馈
			if ($stateParams.selfRecommendation == "selfRecommendation") {
				$scope.selfRecommendation = true;
			}
			$scope.sendIM = function() {
					if (!$filter('isEmptyFilter')($scope.gobel.tahoInfo)) {
						$rootScope.toUserInfo = $scope.gobel.tahoInfo;
					}
				}
				//拒绝并反馈
			$scope.removeTalent = function(text) {
					var job_id = $stateParams.job_id;
					var taho_id = $stateParams.taho_id;
					if (job_id && taho_id) {
						var obj = {};
						obj.job_id = job_id;
						obj.taho_id = taho_id;
						obj.reason = text;
						talentPushService.removeTalent(obj).then(function() {
							$state.go("^");
						});
					}
				}
				//发送面试邀请
			$scope.sendInterview = function() {
				//打开弹出层
				openFileLayout.openDialog({
					"template": "send_Interview.html",
					"scope": $scope.$parent.$new(),
					"position": "absolute",
				});
			}
		}
	]);


	/**********************************人才推送-详情的右侧信息*************************************/
	recruiters.controllers.register('sendInterview', ['$scope', '$filter', '$rootScope', '$stateParams', 'johoService', 'openFileLayout',
		function($scope, $filter, $rootScope, $stateParams, johoService, openFileLayout) {
			//是否验证
			$scope.proving = false;

			$scope.timeList = [{
				"key": 3
			}, {
				"key": 2
			}, {
				"key": 1
			}, ];

			//生成所需要的scope
			$scope.sendInterview = {};
			$scope.sendInterview.name = $scope.gobel.tahoInfo.name;
			$scope.sendInterview.position = $scope.gobel.tahoInfo.position;
			$scope.sendInterview.recName = $scope.userInfo.business_user_name;
			$scope.sendInterview.recPosition = $scope.userInfo.business_user_position;
			$scope.sendInterview.questionsBank = $scope.gobel.johoInfo.interview_questions;
			$scope.sendInterview.company = $scope.gobel.johoInfo.company.company_name;
			$scope.sendInterview.message = "";
			$scope.sendInterview.questions = [];
			//设置默认值
			$scope.sendInterview.message = $scope.sendInterview.name + "，您好！我是" + $scope.sendInterview.company + "的" + $scope.sendInterview.recPosition + $scope.sendInterview.recName + "。看了您的Taho，觉得您很符合我们公司" + $scope.sendInterview.position + "的职位。请您在三天内完成视频面试，谢谢！"
			var obj = {};
			obj.value = "";
			obj.type = "select";
			$scope.sendInterview.questions.push(angular.copy(obj));
			$scope.sendInterview.duration = 3
				//设定公共方法
				//添加
			$scope.add = function() {
					if ($scope.sendInterview.questions.length >= 3) {
						alert("问题最多能输入3个！");
					} else {
						$scope.sendInterview.questions.push(angular.copy(obj));
					}
				}
				//删除
			$scope.del = function(index) {
					if ($scope.sendInterview.questions.length <= 1) {
						alert("至少保留一个问题！");
					} else {
						$scope.sendInterview.questions.splice(index, 1);
					}
				}
				//自定义输入
			$scope.pen = function(index) {
					$scope.sendInterview.questions[index].value = "";
					$scope.sendInterview.questions[index].type = "pen";
				}
				//选择输入
			$scope.select = function(index) {
					$scope.sendInterview.questions[index].value = "";
					$scope.sendInterview.questions[index].type = "select";
				}
				//表单上传
			$scope.submitForm = function(valid) {
					$scope.proving = true;
					//对问题进行处理
					var questions = angular.copy($scope.sendInterview.questions);
					questions = $filter('clearEmptyByFiled')(questions, 'value');
					questions = $filter('getArrayFromObject')(questions, 'value');

					//通过验证
					if (valid) {
						if (questions.length <= 0) {
							alert("至少添加一个问题！")
						} else {
							var resultForm = {};
							resultForm.message = $scope.sendInterview.message;
							resultForm.questions = questions;
							resultForm.duration = $scope.sendInterview.duration;
							resultForm.joho_id = $stateParams.job_id;
							resultForm.taho_id = $stateParams.taho_id;
							$scope.inculdeHtml.loading = true;
							//修改joho的工作经验
							johoService.interviewInvite(resultForm).then(function() {
								$scope.inculdeHtml.loading = false;
								openFileLayout.closeDialog('send_Interview.html');
								//展示提示
								openFileLayout.openDialog({
									"template": "notice_dialog.html",
									"maskLayer": false,
									"content": "发送成功！",
								});
							});
						}
					}
				}
				//关闭弹出框
			$scope.closeDialog = function() {
				openFileLayout.closeDialog('send_Interview.html');
			}
		}
	]);

	/**********************************人才自荐*************************************/
	recruiters.controllers.register('talentSelfRecommendationController', ['$scope', '$state', 'talentSelfRecommendationService', '$stateParams',
		function($scope, $state, talentSelfRecommendationService, $stateParams) {
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
			$scope.joho_id = $stateParams.job_id;
			$scope.joho_name = $stateParams.joho_name;
			$scope.pageNumber = $stateParams.pageNumber;
			$scope.pageSize = $stateParams.pageSize;
			$scope.type = $stateParams.type;
			
			
			var getSelfRecommendation = function () {
				
				var postData = {
	                pageIndex: $scope.paginationConf.currentPage==0?1:$scope.paginationConf.currentPage,
	                pageSize: $scope.paginationConf.itemsPerPage
            	};
            	
				talentSelfRecommendationService.selfRecommendationTalentList($scope.type,$scope.joho_id,postData.pageSize,postData.pageIndex).then(function(data){
					$scope.inculdeHtml.loading = false;
					$scope.selfRecommendationtalentList = data.selfRecommendTaHos;
					$scope.paginationConf.totalItems = data.pageCount * postData.pageSize;
				}); 
				
				
			};
			//配置分页基本参数
	        $scope.paginationConf = {
	            currentPage: 1,
	            itemsPerPage: 10,
	        };
	
	        /***************************************************************
		        当页码和页面记录数发生变化时监控后台查询
		        如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
	        ***************************************************************/
	        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getSelfRecommendation);
		}
	]);
});