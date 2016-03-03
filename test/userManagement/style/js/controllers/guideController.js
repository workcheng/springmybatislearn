/**
 * 用户管理用户注册
 */
define(['userManagementModule'],function(userManagement){
	userManagement.controllers.register('guideController',['$cookieStore','$scope','$state','auxiliaryService','tahoService','$filter','userService',
		function($cookieStore,$scope,$state,auxiliaryService,tahoService,$filter,userService){
			
			$scope.userInfo = $cookieStore.get("userInfo");
			//选中弹出框类型
			$scope.editPluagin = function(id){
				$scope.editPluaginName = id;
			}
			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data){
				$scope.industyList = data.industies;
			});
			//获取tahobasic信息
			tahoService.getTaho().then(function(data) {
				var getData = angular.copy( data['basic']);
				if( getData.industries.length>0 && getData.industries[0].hasOwnProperty('industry_id') ){
					getData.industry_id = getData.industries[0]['industry_id'];
				}
				if( getData.positions.length>0 && getData.positions[0].hasOwnProperty('position_id') ){
					getData.pref_position_id = getData.positions[0]['position_id'];
				}
				if( getData.locations.length>0 && getData.locations[0].hasOwnProperty('location_id') ){
					getData.location_id = getData.locations[0]['location_id'];
				}
				
				$scope.basic =getData;
			});
			
			
		 	//定义form表单,用于获取正确的提交数据
		 	var formDataStand = {
			   "name": "",
			   "avatar": "",
			   "avatar_data": "",
			   "mobile_number": "",
			   "email": "",
			   "address_id":"",
			   "marriage": "",
			   "children": "",
			   "description": "",
			   "birth_year": "",
			   "birth":null,
			   "gender": "",
			   "pref_salary": "",
			   "pref_travel_id": "",
			   "pref_travel_value": "",
			   "industry_id": "",
			   "position_id": "",
			   "location_id": "",
			   "employment_type_id": "",
			   "pref_position_id": "",
			};
			 
		 	//是否显示提示，用于未修改表单就点击提交，检测是否通过
		 	$scope.showError = false;
		 	//提交position表单  valid：是否通过验证；dirty：是否修改过
		 	$scope.submitForm = function( valid ){   
				if (!valid) {
					$scope.showError = true;
				} else {
					//对提交结果进行处理
			 		var formData = angular.copy($scope.basic);
					var resultForm = $filter('standardArr')(angular.copy(formDataStand), formData);
					tahoService.changeTaho('basic',resultForm).then(function(data) {
						var userInfo = userService.getUserInfo();
						//修改userInfo信息
						if( userInfo && resultForm.name != userInfo.name ){
							userInfo.name = resultForm.name;
							userService.setUserInfo(userInfo);
						}
						if(userInfo.login_type == "1000"){
							$state.go('candidates.taho');
						}else if(userInfo.login_type == "1001"){
							$state.go('candidates.notice');
						}
					});
				}
			}
			
			
			
			
		}
	]);
});