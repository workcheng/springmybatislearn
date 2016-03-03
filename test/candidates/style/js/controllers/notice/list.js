/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'],function(candidates){
	//=================================创建编辑joho  的controller对象=================================
	candidates.controllers.register('candNoticeListController',['$scope','eventCenterService','$filter','openFileLayout',
	function($scope,eventCenterService,$filter,openFileLayout){
		
		/*事件中心获取得分*/
		eventCenterService.getEventList().then(function(list){
			$scope.noticeList = list;
		});
		
		/*拒绝的人才*/
		eventCenterService.getEventDeclineList().then(function(list){
			$scope.eventDeclineList = list;
		});
		
		/*事件中心的消息*/
		$scope.main = function(){
			eventCenterService.getEventMessageList().then(function(list){
				$scope.messageList =list;
			});
		};
		$scope.main();
		
		$scope.reject_invite = function(id,type){
			 var r = confirm("确定拒绝邀请吗？");
		     if (r == true){
				var resultFrom = {
					"business_invite_user_id":id,
					"invite_type":type,
					"is_accept":4
				};
				resultFrom.business_invite_user_id = id;
				resultFrom.invite_type = type;
				eventCenterService.rejectInvite(resultFrom).then(function(data){
					if(data&&data.message){
						alert(data.message);
					}else{
						$scope.main();
						alert("拒绝成功！");
					}
				})
		     }
		},
		
		$scope.openQrDialog = function(){
			//打开弹出层
			openFileLayout.openDialog({
				"template": "qrcode.html",
				"scope": $scope.$parent.$new(),
				"position": "absolute",
			});
		},
		$scope.closeQrDialog = function(){
			openFileLayout.closeDialog('qrcode.html');
		}
	}]);
});
