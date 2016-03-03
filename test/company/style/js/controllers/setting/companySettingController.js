/**
 * 加载招聘这-taho展示和编辑
 */
define(['companyModule'],function(company){
	//=================================企业设置对象=================================
	company.controllers.register('companySettingController',['$scope','$filter','userService',function($scope,$filter,userService){
		//获取全局的userInfo
		$scope.setting={};
		$scope.setting.editSetting="";
		$scope.setting.loading=false;
		
		
		//招聘入口
		$scope.goEntry = function(){
			//推出
			userService.loginOut('userManagement.login',{'login_type':'recruiters'});
		}
		
	}]);
	
	//=============================账号设置================================
	company.controllers.register('companySettingAccountController',['$scope','cohoService','userService',function($scope,cohoService,userService){
		//初始化
		$scope.setting.editSetting="";
		$scope.setting.loading=false;
		$scope.defalutData = {};
		$scope.editData = {};
		
		//基本设置
		$scope.main = function(){
			var userInfo = $scope.userInfo;
			//获取默认的数据
			$scope.defalutData.linkname = userInfo.linkname;
			$scope.defalutData.mobile_number = userInfo.mobile_number;
			$scope.defalutData.email = userInfo.email;
			//设置编辑中的数据
			$scope.editData = angular.copy($scope.defalutData);
		}
		$scope.main();
		
		//表单提示重置
		$scope.cancelForm = function(form){
			$scope.setting.editSetting = '';
			$scope.main();
			if( form )
				form.$setPristine();
		}
		
		//监听打开的栏目并重置数据
		$scope.$watch('setting.editSetting',function(data,oldData){
			if( data && data != oldData ){
				$scope.main();
			}
		});
		
		//表单提交
		$scope.submitForm = function( valid ){
			if(valid){
				$scope.setting.loading=true;
				var updateData = {};
				var value = "";
				switch($scope.setting.editSetting){
					case 'linkname':updateData.linkname = $scope.editData.linkname;value=updateData.linkname;break;
					case 'mobile_number':updateData.mobile_number = $scope.editData.mobile_number;value = updateData.mobile_number;break;
					case 'email':updateData.email = $scope.editData.email;value = updateData.email;break;
					case 'change_password':updateData.oldPassword = $scope.editData.oldPwd;updateData.password = $scope.editData.newPwd;value = updateData.password;break;
				}
				//上传
				cohoService.setCompanySetAccount(updateData).then(function(data){
					$scope.setting.loading=false;
					if( data && data.isError ){
						$scope.errorInfo = data;
					}else{
						$scope.changeUserInfo( value );
						$scope.cancelForm();
					}
				});
			}
		}
		
		//修改全局的userInfo信息
		$scope.changeUserInfo = function( data ){
			if($scope.setting.editSetting=='change_password'){
				if( $scope.userInfo.hasOwnProperty('loginInfo') && $scope.userInfo.loginInfo.hasOwnProperty('password') ){
					$scope.userInfo.loginInfo.password = data;
					//设置缓存的数据
					userService.setUserInfo( angular.copy($scope.userInfo) );
				}
			}else{
				$scope.userInfo[$scope.setting.editSetting] = data;
				//设置缓存的数据
				userService.setUserInfo( angular.copy($scope.userInfo) );
			}
		}
		
	}]);
});
