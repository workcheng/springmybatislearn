/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'],function(candidates){
	//=================================应聘者设置对象=================================
	candidates.controllers.register('candSettingController',['$scope','$filter','userService',function($scope,$filter,userService){
		//获取用户信息
		$scope.userInfo;
		$scope.setting={};
		$scope.setting.editSetting="";
		$scope.setting.loading=false;
		$scope.update = {};
		
		//监听编辑的模块
		$scope.$watch('setting.editSetting',function(tag){
			switch(tag){
				case 'name':             $scope.update.editName = angular.copy($scope.userInfo.name);break;
				case 'speciality':       $scope.update.editSpeciality = angular.copy($scope.userInfo.speciality);break;
				case 'mobile_number':    $scope.update.mobile_number = "";$scope.update.code = "";break;
				case 'email'  :          $scope.update.email = "";$scope.update.code = "";$scope.update.mailCodeEnable = true;break;
				case 'change_password':;break;
				case 'push_mode':        $scope.update.push_mode = angular.copy($scope.userInfo.push_mode);break;
				case 'unwanted_company': unwantedCompany( angular.copy($scope.userInfo.unwanted_company) );break;
			}
		});
		
		//表单提示重置
		$scope.cancelForm = function(form){
			form.$setPristine();
			$scope.setting.editSetting = '';
		}
		
		//获取屏蔽公司的信息
		function unwantedCompany(data ){
			var info=[];
			if( $filter('isEmptyFilter')(data) ){
				var obj={};
				obj.key = 0;
				obj.content=""
				info.push(obj);
			}else{
				for(var j=0;j<data.length;j++){
					var obj={};
					obj.key = j;
					obj.content=data[j];
					info.push(obj);
				}
			}
			$scope.update.unwanted_company_info = info;
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
			$scope.update = {};
		}
		
	}]);
	

	//============================个人信息=================================
	candidates.controllers.register('candSettingUserController',['$scope','candSettingService','$q','userService',function($scope,candSettingService,$q,userService){
		//提交表单
		$scope.submitForm = function( valid ){
			if(valid){
				$scope.setting.loading=true;
				//编辑用户名
				if($scope.setting.editSetting=='name'){
					candSettingService.updateName( $scope.update.editName ).then(function(){
						$scope.setting.loading=false;
						//修改userInfo的name信息
						$scope.changeUserInfo( $scope.update.editName );
						$scope.setting.editSetting='';
					});
				}else if( $scope.setting.editSetting=='speciality' ){
					candSettingService.updateSpeciality( $scope.update.editSpeciality ).then(function(){
						$scope.setting.loading=false;
						//修改userInfo的name信息
						$scope.changeUserInfo( $scope.update.editSpeciality );
						$scope.setting.editSetting='';
					});
				}
			}
		}
		
		//上传头像
		$scope.uploadAvatar = function( data ){
			if( angular.isDefined(data)){
				//修改头像
				$scope.setting.loading=true;
				var deffer = $q.defer();
				candSettingService.updateAvatar( data ).then(function(info){
					$scope.userInfo.avatar = info.url;
					//设置缓存的数据
					userService.setUserInfo( angular.copy($scope.userInfo) );
					$scope.setting.loading=false;
					//修改userInfo的name信息
					deffer.resolve(data);
				});
				return deffer.promise;
			}
		}
		
	}]);
	
	
	//=============================账号设置================================
	candidates.controllers.register('candSettingAccoutController',['$scope','candSettingService',function($scope,candSettingService){
		//获取验证码
		$scope.codeNotice = "发送验证码";
		//能否发送验证码
		$scope.codeEnable = true;
		//发送验证吗
		$scope.sendMobile = function(){
			//判断手机好是否已经输入
			if( $scope.update.mobile_number && $scope.codeEnable  ){
				candSettingService.sendMobileCode( $scope.update.mobile_number ).then(function( data ){
					if( data && data.isError ){
						$scope.errorInfo = data;
					}else{
						alert("验证码发送成功！");
						$scope.codeEnable = false;
						//倒计时
						var count = 59;
						$scope.codeNotice = count+"s后重发";
						$scope.enable = false;
						var countdowntime = setInterval(function(){
							if( count > 0 ){
								count --;
								$scope.codeNotice = count+"s后重发";
							}else{
								$scope.codeEnable = true;
								$scope.codeNotice = "重发验证码";
								clearInterval(countdowntime);
							}
							$scope.$digest();
						},1000);
					}
				});
			}
		}
		
		//发送邮箱验证码
		$scope.sendEmail = function(){
			//判断手机好是否已经输入
			if( $scope.update.email && $scope.update.mailCodeEnable  ){
				candSettingService.sendEmailCode( $scope.update.email ).then(function( data ){
					if( data && data.isError ){
						$scope.errorInfo = data;
					}else{
						alert("验证码发送成功！");
						$scope.update.mailCodeEnable = false;
					}
				});
			}
		}
		
		//提交表单
		$scope.submitForm = function( valid ){
			if( valid ){
				$scope.setting.loading=true;
				//绑定手机
				if($scope.setting.editSetting=='mobile_number'){
					candSettingService.updateMobile( $scope.update.mobile_number, $scope.update.code ).then(function(data){
						$scope.setting.loading=false;
						if( data && data.isError ){
							$scope.errorInfo = data;
						}else{
							//修改userInfo的name信息
							$scope.changeUserInfo( $scope.update.mobile_number );
							$scope.setting.editSetting='';
						}
					});
				}else if( $scope.setting.editSetting=='change_password' && $scope.update.rePwd == $scope.update.newPwd ){
					//修改密码
					candSettingService.updatePwd($scope.update.newPwd,$scope.update.oldPwd ).then(function( data ){
						$scope.setting.loading=false;
						if( data && data.isError ){
							$scope.errorInfo = data;
						}else{
							//修改userInfo的name信息
							$scope.changeUserInfo( $scope.update.newPwd );
							$scope.setting.editSetting='';
						}
					});
				}else if( $scope.setting.editSetting=='language' ){
					//语言设置
					$scope.setting.editSetting='';
				}else if( $scope.setting.editSetting=='email' &&  $scope.update.code ){
					//修改邮箱
					candSettingService.updateEmail( $scope.update.code ).then(function(data){
						$scope.setting.loading=false;
						if( data && data.isError ){
							$scope.errorInfo = data;
						}else{
							//修改userInfo的email信息
							$scope.changeUserInfo( $scope.update.email );
							$scope.setting.editSetting='';
						}
					});
				}
			}
		}
	}]);
	
	
	//=============================推送设置=================================
	candidates.controllers.register('candSettingPushController',
	['$scope','candSettingService','$filter',function($scope,candSettingService,$filter){
		$scope.push_mode_id={};
		//监听推送模式
		$scope.$watch('update.push_mode',function( data ){
			if( data ){
				$scope.push_mode_id={};
				$scope.push_mode_id['type_1'] = $scope.inString(data,1);
				$scope.push_mode_id['type_2'] = $scope.inString(data,2);
				$scope.push_mode_id['type_3'] = $scope.inString(data,3);
			}
		});
		
		//判断是否在当前字符串中
		$scope.inString = function(data,tag){
			if(data && data.indexOf(tag)>=0 ){
				return true;
			}else{
				return false;
			}
		}
		
		//添加新的屏蔽公司
		$scope.addNewUnwanted = function(){
			var obj={};
			obj.key = $scope.update.unwanted_company_info.length;
			obj.content='';
			$scope.update.unwanted_company_info.push(obj);
		}
		
		//删除屏蔽公司
		$scope.removeNewUnwanted = function( data ){
			if( data.key > 0){
				$scope.update.unwanted_company_info.splice(data.key,1);
			}
		}
		
		
		//提交表单
		$scope.submitForm = function( valid ){
			if( valid ){
				$scope.setting.loading=true;
				if($scope.setting.editSetting=='push_mode'){
					//推送的方式
					var push_mode ="";
					if( $scope.push_mode_id.hasOwnProperty('type_1') && $scope.push_mode_id['type_1'] ){push_mode+=1;}
					if( $scope.push_mode_id.hasOwnProperty('type_2') && $scope.push_mode_id['type_2'] ){if(push_mode){push_mode+=","}push_mode+=2;}
					if( $scope.push_mode_id.hasOwnProperty('type_3') && $scope.push_mode_id['type_3'] ){if(push_mode){push_mode+=","}push_mode+=3;}
					candSettingService.updatePushMode( push_mode ).then(function(data){
						$scope.setting.loading=false;
						if( data && data.isError ){
							$scope.errorInfo = data;
						}else{
							//修改userInfo的name信息
							$scope.changeUserInfo( push_mode );
							$scope.setting.editSetting='';
						}
					});
				}else if( $scope.setting.editSetting=='unwanted_company' ){
					//屏蔽的用户
					//删除空的值
					var resultForm = $filter('clearEmptyByFiled')($scope.update.unwanted_company_info,'content');
					resultForm = $filter('getArrayFromObject')(resultForm,'content');
					candSettingService.updateUnwanted( resultForm ).then(function(data){
						$scope.setting.loading=false;
						if( data && data.isError ){
							$scope.errorInfo = data;
						}else{
							//unwanted_company_info
							$scope.changeUserInfo( resultForm );
							$scope.setting.editSetting='';
						}
					});
				}
			}
		}
	}]);
	
	//==============================邀请好友=================================
	candidates.controllers.register('candSettingInviteController',['$scope',function($scope){
		//复制到黏贴版
		$scope.copyToClipBoard=function(s) {
            //alert(s);
        	if (window.clipboardData) {
                window.clipboardData.setData("Text", s);
                alert("已经复制到剪切板！"+ "\n" + s);
            } else if (navigator.userAgent.indexOf("Opera") != -1) {
                window.location = s;
            } else if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
                }
                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                if (!clip)
                    return;
                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                if (!trans)
                    return;
                trans.addDataFlavor('text/unicode');
                var str = new Object();
                var len = new Object();
                var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                var copytext = s;
                str.data = copytext;
                trans.setTransferData("text/unicode", str, copytext.length * 2);
                var clipid = Components.interfaces.nsIClipboard;
                if (!clip)
                    return false;
                clip.setData(trans, null, clipid.kGlobalClipboard);
                alert("已经复制到剪切板！" + "\n" + s)
            }
        }
	}]);
	
	
});
