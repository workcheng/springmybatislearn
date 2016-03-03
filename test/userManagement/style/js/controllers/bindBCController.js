/**
 * 绑定b用户和c用户
 */
define(['userManagementModule'],function(userManagement){
	userManagement.controllers.register('bindBCController',['$scope','$state','$stateParams','userService','$interval','tahoService',
		function($scope,$state,$stateParams,userService,$interval,tahoService){
			
			//立即跳转结束
			$scope.goEnd = function(){
				$scope.loading = "begin";
				//发送邮箱验证吗
				tahoService.bBindC($stateParams.code).then(function(info){
					if(info.isError){
						$scope.loading ="error";
						$scope.errorInfo = info.message;
						userService.removeBindCode();
					}else{
						$scope.loading = "end";
						$scope.countDown( $scope.goB );
					}
					
				},function(info){console.log(info);});
			}
			
			//设置跳转时间
			$scope.countDown = function( fun ){
				$scope.time = 3;
				var stop = $interval(function(){
					if($scope.time>0){
						$scope.time--;
					}else{
						$interval.cancel(stop);
						fun();
					}
				},1000);
			}
			
			//跳转到个人页面
			$scope.goC = function(){
				userService.setBindCode( $stateParams.code );
				userService.loginOut("userManagement.login",{'login_type':'candidates'});
			}
			//跳转到企业页面
			$scope.goB = function(){
				userService.removeBindCode();
				userService.loginOut("userManagement.login",{'login_type':'recruiters'});
			}
			
			//立即跳转开始
			$scope.gobegin = function(){
				$scope.countDown( $scope.goC );
			}
			
			//判断是否是绑定功能
			if($stateParams.code){
				//判断是否已经登陆
				var userInfo = userService.getUserInfo();
				if( userInfo ){
					if( userInfo.userStatus == "candidates" ){
						$scope.type="end";
						$scope.goEnd();
					}else{
						$scope.type="begin";
						$scope.gobegin();
					}
				}else{
					$scope.type="begin";
					$scope.gobegin();
				}
			}else{
				$state.go("userManagement.login",{'login_type':'candidates'});
			}
			
		}
	]);
});