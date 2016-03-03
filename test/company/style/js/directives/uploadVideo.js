/**
 * 招聘者公共指令集合
 */
define([
	'companyModule',
	], function ( company ) {
	//选中图片
	company.directives.register('uploadVideoProgress',['$rootScope','$compile',function($rootScope,$compile){
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