/**
 * 加载招聘这-joho展示
 */
define(['recruitersModule'],function(recruiters){
	recruiters.controllers.register('recruitersJohoDetailController',
		['$scope','$state','johoService','$stateParams','$timeout','commentsService',
		function($scope,$state,johoService,$stateParams,$timeout,commentsService){
			
			$scope.job_id = $stateParams.job_id;
			
			$scope.johoDetail = johoService.getJohoDetail({'job_id':$scope.job_id},function(data){
			 	//分别定义
			 	$scope.position     = data['position'];
			    $scope.company      = data['company'];
				$scope.skills       = data['skills'];
				$scope.education    = data['education'];
				$scope.languages    = data['languages'];
				$scope.certificates = data['certificates'];
				$scope.motivation   = data['motivation'];
				$scope.value        = data['value'];
				$scope.IQ           = data['iq'];
				$scope.thinking_pattern = data['thinking_pattern'];
				$scope.work_experience = data['work_experience'];
				$scope.behavior_style = data['behavior_style'];
				$scope.eq = data['eq'];
				//页面调整
				$timeout(function(){
					
					var tabs = document.querySelectorAll("[class^=tab-0gmi-group-2]");
					angular.forEach(tabs,function(element1){
						var thisParantHeight = element1.offsetHeight;
						var tabs = element1.querySelectorAll('.tab');
						angular.forEach(tabs,function(tab){
							tab.style.height = thisParantHeight+"px";
						})
					});
					
					var tabs = document.querySelectorAll("[class^=tab-0gmi-group-3]");
					angular.forEach(tabs,function(element1){
						var thisParantHeight = element1.offsetHeight;
						var tabs = element1.querySelectorAll('.tab');
						angular.forEach(tabs,function(tab){
							tab.style.height = thisParantHeight+"px";
						})
					});
					
				},0);
				
			});
			
			
//			$scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
//				//调整div高度
//				var tabs = document.querySelectorAll("[class^=tab-0gmi-group-]");
//				angular.forEach(tabs,function(element1){
//					var thisParantHeight = element1.style.height;
//					element1.querySelector('.tab').style.height = thisParantHeight;
//				});
//			});
			
			
			//页面状态detail_type：1:发布展示页面 2：编辑展示页面
			$scope.detailType = ($stateParams.detail_type)?$stateParams.detail_type:1;
			if( 2 == $scope.detailType ){
				//获取comment信息
				$scope.comments = commentsService.getComments( $scope.job_id );
				
				//正在编辑的评论模块
				$scope.commentsModule = '';
				$scope.showCommentsModule = function( moduleName ){
					if( moduleName == $scope.commentsModule ){
						$scope.commentsModule = '';
					}else{
						$scope.commentsModule = moduleName;
					}
				}
				
				
			}
			
			//页面跳转到编辑页面
			$scope.transformEdit = function(){
				$state.go("recruiters.joho.edit.position",{'job_id':$scope.job_id});
		 	}

		}
	]);
});
