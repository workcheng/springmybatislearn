/**
 * 招聘者公共指令集合
 */
define([
	'companyModule',
//	'directives/selectPic',
	'directives/laydateDirective',
	'directives/uploadVideo',
	], function ( company ) {
		
	//解绑和绑定
	company.directives.register('teamUnbind',['$rootScope','$compile','cohoService',function($rootScope,$compile,cohoService){
		return {
			scope:{
				teamUnbindFun : '&',
			},
			restrict:'A',
			controller:function($scope,$element,$attrs){
				$scope.bind={};
				//打开弹出框
				$scope.openDialog = function(){
					$rootScope.maskLayer =true;
					$scope.status = true;
					$scope.bind.email = "";
					$scope.bind.position_id =1;
					$scope.bind.business_user_id = $attrs.teamUnbind;
				}
				
				//关闭弹出框
				$scope.closeDialog = function( ){
					$rootScope.maskLayer =false;
					angular.element( "#team_bind_style").remove();
				}
				
				//解除绑定
				$scope.releaseBind = function( ){
					var bid = $attrs.teamUnbind;
					$scope.status=false;
					cohoService.cancelBind( bid ).then(function(){
						//关闭弹出层
						$scope.closeDialog();
						//重新获取数据
						$scope.teamUnbindFun();
					});
				}
				
				//发送绑定信息
				$scope.binding = function( vaild ){
					if( vaild ){
						cohoService.bindSendEmail( $scope.bind ).then(function(){
							//关闭弹出层
							$scope.closeDialog();
						});
					}
				}
			},
			link:function($scope,$element,$attrs){
			
				$element.bind('click',function(){
					//添加遮罩层
					$scope.$apply(function(){
						$scope.openDialog();
						main();
					});
				});
				
				//mian
				function main(){
					if( $attrs.teamBindStyle == "toBind" ){
						var decHtml = $compile(createHtmlBind())($scope);
					}else{
						var decHtml = $compile(createHtml())($scope);
					}
					$('body').append($(decHtml));
				}
				
				//解除绑定的样式
				function createHtml(){
					var count = $attrs.teamUnbindCount;
					var template ='\
						<div id="team_bind_style" class="zero_dialog">\
							<div class="cancel_button no_select" ng-click="closeDialog()"></div>\
							<h1 class="text_color_redSauce ta_c">解除绑定</h1>\
							<div class="pt20 pb20 ta_c b text_color_999" ng-show="'+count+'">该用户创建过'+count+'个JOHO，您确认解绑该用户吗？</div>\
							<div class="pt20 pb20 ta_c b text_color_999" ng-hide="'+count+'">您确认解绑该用户吗？</div>\
							<div class="form_but_group mt20">\
								<input type="submit" ng-show="status" ng-click="releaseBind()" id="toho_id_basic_but_submit" class="form_but form_but_submit" value="确认">\
								<input type="submit" ng-hide="status" id="toho_id_basic_but_submit" class="form_but form_but_submit" value="解绑中..">\
								<div class="form_but form_but_cancel" ng-click="closeDialog()">取消</div>\
							</div>\
						</div>';
					return template;
				}
				
				//创建绑定的样式
				function createHtmlBind(){
					var template ='\
						<div id="team_bind_style" class="zero_dialog">\
							<form name="formData"  ng-submit="binding(formData.$valid)" autocomplete="off"  novalidate>\
							<div class="cancel_button no_select" ng-click="closeDialog()"></div>\
							<h1 class="text_color_redSauce ta_c pb10">绑定新用户</h1>\
							<div class="b mt20 mb10 text_color_666">请输入被绑定人的邮箱，我们将会发送绑定邀请？</div>\
							<div class="posrel pb20">\
								<input class="decline_style decline_input" ng-model="bind.email" name="email" type="text" placeholder="电子邮箱" ng-pattern="/^([^@\\s]+@[^@\\.\\s]+(\\.[^@\\.\\s]+)+)$/"  zero-focus required/>\
								<span class="error" ng-show="formData.email.$dirty && formData.email.$error.required && !formData.email.$focused">请输入电子邮箱</span>\
								<span class="error" ng-show="formData.email.$dirty && formData.email.$error.pattern && !formData.email.$focused">输入的邮箱不正确</span>\
							</div>\
							<div class="mt10 b mb10 text_color_666">请输入被绑定人职位</div>\
							<div class="posrel">\
								<select class="decline_style decline_select" ng-model="bind.position_id">\
									<option value="2">招聘专员</option>\
									<option value="1">招聘经理</option>\
								</select>\
								<label class="decline_select_label"></label>\
							</div>\
							<input type="submit" class="submit_button" value="发送绑定邀请"/>\
							</form>\
						</div>';
					return template;
				}
				
			}
		}
	}]);
		
		
	//推出并进入招聘入口
	company.directives.register('goToRecruiters',['$rootScope','$compile','userService',function($rootScope,$compile,userService){
		return {
			scope:{},
			restrict:'A',
			controller:function($scope,$element,$attrs){
				$scope.bind={};
				//打开弹出框
				$scope.openDialog = function(){
					$rootScope.maskLayer =true;
					$scope.status = true;
				}
				
				//关闭弹出框
				$scope.closeDialog = function( ){
					$rootScope.maskLayer =false;
					angular.element( "#team_bind_style").remove();
				}
				
				//推出招聘入口并进入b用户的入口
				$scope.goToRecruitersUser = function( ){
					$scope.status=false;
					userService.loginOut('userManagement.login',{'login_type':'recruiters'});
					$scope.closeDialog();
				}
			},
			link:function($scope,$element,$attrs){
			
				$element.bind('click',function(){
					//添加遮罩层
					$scope.$apply(function(){
						$scope.openDialog();
						main();
					});
				});
				
				//mian
				function main(){
					var decHtml = $compile(createHtml())($scope);
					$('body').append($(decHtml));
				}
				
				//解除绑定的样式
				function createHtml(){
					var template ='\
						<div id="team_bind_style" class="zero_dialog">\
							<div class="cancel_button no_select" ng-click="closeDialog()"></div>\
							<h1 class="text_color_redSauce ta_c">招聘入口</h1>\
							<div class="pt20 pb20 ta_c b text_color_999">进入招聘入口后，您将离开本页面，进入企业招聘页面</div>\
							<div class="form_but_group mt20">\
								<input type="submit" ng-click="goToRecruitersUser()" id="toho_id_basic_but_submit" class="form_but form_but_submit" value="确认">\
								<div class="form_but form_but_cancel" ng-click="closeDialog()">取消</div>\
							</div>\
						</div>';
					return template;
				}
				
			}
		}
	}]);
});