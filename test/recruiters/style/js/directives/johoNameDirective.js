/**
 * 招聘者公共指令集合
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		recruiters.directives.register('johoNameDirective',['johoService','$stateParams',
		function(johoService,$stateParams){
			return {
				scope:{
					johoName:"=",
				},
				restrict:'A',
				template:function(tElement,tAttrs){
					var template = '<div id="joho_name">\
										<div class="status show" ng-hide="edit_joho_name" ng-click="edit_joho_name=true" title="{{johoName}}">\
											{{johoName}}\
										</div>\
										<div class="status edit" ng-show="edit_joho_name">\
											<input name="joho_name" type="text" ng-model="name" ng-blur="closeInput()" maxlength=30/>\
										</div>\
									</div>';
					return template;
				},
				replace:true,
				controller:function($scope,$element,$attrs){
					//失去焦点时触发
					$scope.closeInput = function(){
						$scope.edit_joho_name = false;
						if( $scope.name && !angular.equals($scope.johoName,$scope.name) ){
							$scope.johoName = angular.copy($scope.name);
							//提交表单
							var johoData ={};
							johoData.joho_name = $scope.johoName;
							johoData.joho_id = $stateParams.job_id;
							johoService.editJohoName(johoData);
						}else{
							$scope.name = angular.copy($scope.johoName);
						}
					}
					
				},
				link:function($scope,$element,$attrs){
					//选中输入框
					$scope.$watch('edit_joho_name',function(value){
						if(value){
							$element.find('input').focus();
							$scope.name = angular.copy($scope.johoName);
						}
					});
					
					
				}
			}
		}]);
		
});