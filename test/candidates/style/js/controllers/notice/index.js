/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'],function(candidates){
	//=================================创建编辑joho  的controller对象=================================
	candidates.controllers.register('candNoticeController',['$scope','matchService','$filter','userService','viewTahoService',
	function($scope,matchService,$filter,userService,viewTahoService){

		/*获取面试邀请*/
//		matchService.internalMessageList().then(function(list){
//			$scope.internalMessageList = list;
//		});
		
		//获取访客
		var userId = userService.getUserInfo().user_id;
 		viewTahoService.getViewTaho(userId).then(function(data){
 			$scope.viewTahos = data.view_history;
 		});
 		
	}]);
});
