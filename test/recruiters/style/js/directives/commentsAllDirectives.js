/**
 * 招聘者公共指令集合
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		recruiters.directives.register('commentsAllDirectives',['$filter','commentsService','$stateParams','userService',
		function($filter,commentsService,$stateParams,userService){
			return {
				scope:{
					closeComments:"&",
				},
				restrict:'A',
				template:function(tElement,tAttrs){
					var title = tAttrs.commentsTitle;
					
					var template = '\
					<div class="tab-header">\
						<div class="tab-title">'+title+'的评论</div>\
					</div>\
					<div class="tab-content">\
						<div class="tab-tag tab-top" ng-click="closeComments()">X</div>\
						<div class="addCommentsTextarea">\
							<textarea></textarea>\
							<div class="comments_but" ng-click="addComments( $event.target,\'\',\'root\')">发送</div>\
						</div>\
						<div class="ta_c text_color_6A" ng-show="showRoot&&!openRoot">共有{{commentsData.count}}条评论，<a class="pointer text_color_redSauce" ng-click="openRoot=!openRoot">请点击查看</a></div>\
						<div class="ta_c pointer text_color_redSauce" ng-show="showRoot&&openRoot" ng-click="openRoot=!openRoot">关闭评论</div>\
						<ul class="comment_ul" ng-show="!showRoot || openRoot">\
							<li class="tab" ng-repeat="commentInfo in commentsData[\'list\'] | selectObjArrFromObjArr:\'reply_comment_id\':\'0\' | orderBy:\'created_time\':true">\
								<div class="tab-content">\
									<div class="tab-left">\
										<div class="tab-tag tab-top" ng-if="userInfo.user_id == commentInfo.comment_personal_user_id" ng-click="delComments(commentInfo,\'root\')"></div>\
										<div class="comment_user">\
											<div class="user_pic">\
												<img class="bradius_50" ng-hide="commentInfo.comment_user_avatar" src="./candidates/style/img/default.png"/>\
												<img class="bradius_50" ng-show="commentInfo.comment_user_avatar" ng-src="{{commentInfo.comment_user_avatar}}" onerror="javascript:this.src=\'./candidates/style/img/default.png\';this.onerror=null;">\
											</div>\
											<div class="user_info">\
												<span>{{commentInfo.comment_user_name}}<span><br/>\
												<small>{{commentInfo.role_name}}</small>\
											</div>\
										</div>\
										<div class="comment_date">{{commentInfo.created_time | date:"yyyy-MM-dd HH:mm" }}</div>\
									</div>\
									<div class="tab-right">{{commentInfo.content}}</div>\
									<div class="content_footer comments_but" ng-click="openTextarea(commentInfo.joho_comment_id)">回复</div>\
									<div class="tab-tag child-tag">\
										<small>该评论{{ 0+commentInfo.children.length }}条回复</small>\
										<div class="ico_img no_select" ng-class="{true:\'ico_img_extened_up\',false:\'ico_img_extened_down\'}[showComments==commentInfo.joho_comment_id]" ng-click = "opneShowComments(commentInfo.joho_comment_id)"></div>\
									</div>\
								</div>\
								<div class="addCommentsTextarea" ng-if="openTextareaTag == commentInfo.joho_comment_id">\
									<div>回复&nbsp;&nbsp;{{commentInfo.comment_user_name}}</div>\
									<textarea></textarea>\
									<div class="comments_but" ng-click="addComments($event.target,commentInfo)">发送</div>\
								</div>\
								<ul class="comment_ul ml20" style="clear:both" ng-show="showComments==commentInfo.joho_comment_id">\
									<li class="tab" ng-repeat="commentInfoChild in commentInfo[\'children\']  | orderBy:\'created_time\':true">\
										<div class="tab-content">\
											<div class="tab-left">\
												<div class="tab-tag tab-top"  ng-if="userInfo.user_id == commentInfoChild.comment_personal_user_id" ng-click="delComments(commentInfoChild,commentInfo)"></div>\
												<div class="comment_user">\
													<div class="user_pic">\
														<img class="bradius_50" ng-hide="commentInfoChild.comment_user_avatar" src="./candidates/style/img/default.png"/>\
														<img class="bradius_50" ng-show="commentInfoChild.comment_user_avatar" ng-src="{{commentInfoChild.comment_user_avatar}}" onerror="javascript:this.src=\'./candidates/style/img/default.png\';this.onerror=null;">\
													</div>\
													<div class="user_info">\
														<span>{{commentInfoChild.comment_user_name}}<span><br/>\
														<small>{{commentInfoChild.role_name}}</small>\
													</div>\
												</div>\
												<div class="comment_date">{{commentInfoChild.created_time | date:"yyyy-MM-dd HH:mm" }}</div>\
											</div>\
											<div class="tab-right">\
												<div>回复&nbsp;&nbsp;{{commentInfoChild.reply_user_name}}：</div>\
												<div class="mt5">{{commentInfoChild.content}}<div>\
											</div>\
										</div>\
									</li>\
								</ul>\
								<div class="clear"></div>\
							</li>\
						</ul>\
					</div>';
					return template;
				},
				controller:function($scope,$element,$attrs){
					
					//获取job_id
					$scope.job_id = $stateParams.job_id;
					
					var module = $attrs.commentsDirectives;
					
					//判断是否是joho模块
					if( module == 'joho'){
						$scope.showRoot = true;
						$scope.openRoot = false;
					}
					
					//获取评论
					commentsService.getComments( $scope.job_id,module ).then(function(data){
						$scope.commentsData = data;
					});
					
					//获取当前用户信息
					$scope.userInfo = userService.getUserInfo();
					
					//显示评论
					$scope.showComments = "";
					$scope.opneShowComments = function( id ){
						if( $scope.showComments != id ){
							$scope.showComments = id;
						}else{
							$scope.showComments = "";
						}
					};
					//打开评论的回复
					$scope.openTextareaTag = "";
					//打开评论的回复
					$scope.openTextarea = function( id ){
						if( $scope.openTextareaTag != id ){
							$scope.openTextareaTag = id;
						}else{
							$scope.openTextareaTag = "";
						}
					};
					
					//删除评论
					$scope.delComments = function( info,parent ){
						commentsService.delComments(info.joho_comment_id,function(){
							var resource = [];
							if( parent == 'root' ){
								resource = $scope.commentsData['list'];
							}else{
								resource = parent['children'];
							}
							//获取一共要删的条数
							var length = 1;
						    if( info.hasOwnProperty('children') ){
						    	length = 1 + info['children'].length;
						    }
							//添加返回值
							resource.splice( resource.indexOf(info) ,1);
							$scope.commentsData['count'] -= length;
						});
					}
					
					
					//添加评论
					$scope.addComments = function( target,info,type ){
						var text = angular.element( target ).parent().find('textarea').val();
						if( text ){
							var request = {};
							var resource = [];
							request.module = module;
							request.content = text;
							if( type == 'root' ){
								request.target_comment_id = 0;
								request.reply_comment_id = 0;
							}else{
								request.target_comment_id = info.joho_comment_id;
								request.reply_comment_id = info.joho_comment_id;
							}
							commentsService.addComments($scope.job_id,request,function(responese){
								//添加返回值
								if( type == 'root' ){
									$scope.commentsData['list'].push(responese['comment']);
								}else{
									if( !info.hasOwnProperty('children') ){
										info['children']=[];
									}
									info['children'].push(responese['comment']);
									$scope.openTextarea('');
								}
								$scope.commentsData['count']++;
								angular.element( target ).parent().find('textarea').val('');
							});
						}
					}
					
				},
				link:function(scope,element,attrs){
					
				}
			}
		}]);
		
});