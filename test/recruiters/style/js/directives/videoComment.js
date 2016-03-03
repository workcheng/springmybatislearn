/**
 * 招聘者面试视频的评论插件
 */
define(['recruitersModule'], function ( recruiters ) {
	recruiters.directives.register('videoComment',['johoService',function(johoService){
		return {
			scope:{
				videoInfo:"=videoComment",
			},
			restrict: 'A',
			templateUrl: 'video_comment.html',
			controller:function($scope,$element,$attrs){
				//初始化
				$scope.root ={};
				$scope.root.showNumber = false;
				$scope.root.showInfo = [];
				$scope.root.loading = false;
				
				//设置编辑框内容
				$scope.info = {};
				$scope.info.content = "";
				$scope.info.time_point ="";
				$scope.info.video_id =$scope.videoInfo.video_id;
				//跳转到对评论的回复
				$scope.goToComment = function(id,info){
					$scope.root.showNumber = id;
					if( angular.isUndefined(info.reply)){
						info.reply = [];
					}
					$scope.root.showInfo = info.reply;
					$scope.info.content = "回复"+info.username+"：";
				}
				//发表评论
				$scope.comment = function(){
					$scope.root.loading = true;
					if( $scope.root.showNumber && $scope.root.showInfo ){
						var obj ={};
						obj.joho_taho_video_comment = $scope.root.showNumber;
						obj.content = $scope.info.content;
						johoService.interviewSaveReplyComment(obj).then(function(data){
							$scope.root.loading = false;
							$scope.root.showInfo.push(data);
							$scope.cancel();
						});
					}else{
						johoService.interviewSaveComment($scope.info).then(function(data){
							$scope.root.loading = false;
							$scope.videoInfo.comments.push(data);
							$scope.cancel();
						});
					}
					
				}
				//取消回复的评论
				$scope.cancel = function(){
					$scope.root.showNumber=false;
					$scope.root.showInfo = [];
					$scope.info.content = "";
				}
			},
			link:function(scope,element,attrs){
				
				
			}
		}
	}]);
});