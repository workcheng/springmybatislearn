/**
 * 用户管理用户注册
 */
define(['userManagementModule'],function(userManagement){
	userManagement.controllers.register('retrievePassword',['$scope','$state','userService','$timeout','$stateParams','$location',
		function($scope,$state,userService,$timeout,$stateParams,$location){
			
			$scope.noStatus = true;
			var obj ={};
			obj.isError = false;
			obj.message = "";
			$scope.notices = obj;
			
			$scope.retrieveData = {};
			$scope.retrieveData.username = "";
			$scope.retrieveData.code ="";
			$scope.retrieveData.pwd ="";
			
			//判断是否已经带上了邮箱和code
			if( $location.search().code && $location.search().email ){
				$scope.retrieveData.username = $location.search().email;
				$scope.retrieveData.code = $location.search().code;
				$scope.registerType = "email";
				$scope.retrieveType = "setPassword";
			}
			
			//验证码提示内容
			$scope.codeNotice = "发送验证码";
			//验证注册的方式是邮箱还在手机
			$scope.validateRegisterType = function(){
				$scope.notices = obj;
				var username = $scope.retrieveData.username;
				if( /^1[3|4|5|7|8][0-9]\d{8}$/.test(username) ){
					$scope.registerType = "mobile";
				}else if( /^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/.test(username) ){
					$scope.registerType = "email";
				}else{
					$scope.registerType = "";
				}
			}
			
			//能否发送验证码
			$scope.codeEnable = true;
			//发送验证吗
			$scope.sendMobile = function(){
				//判断手机好是否已经输入
				if( $scope.retrieveData.username && $scope.codeEnable ){
					userService.retrieveSendMobileCode( $scope.retrieveData.username ).then(function(){
						alert("验证码发送成功！");
						$scope.codeEnable = false;
						//倒计时
						var count = 59;
						$scope.codeNotice = count;
						$scope.enable = false;
						var countdowntime = setInterval(function(){
							if( count > 0 ){
								count --;
								$scope.codeNotice = count;
							}else{
								$scope.codeEnable = true;
								$scope.codeNotice = "重发验证码";
								clearInterval(countdowntime);
							}
							$scope.$digest();
						},1000);
					});
				}
			}
			
			//第一步：输入手机或邮箱
			$scope.submitStep1 = function(){
				if( $scope.retrieveData.username ){
					$scope.noStatus = false;
					if( $scope.registerType == "mobile" ){
						userService.retrieveVerifyMobile( $scope.retrieveData.username ).then(function(data){
							$scope.noStatus = true;
							if( data.hasOwnProperty('isError') && data.isError ){
								$scope.notices = data;
							}else{
								$scope.retrieveType = $scope.registerType;
							}
						});
						
					}else if( $scope.registerType == "email" ){
						userService.retrieveSendEmailCode( $scope.retrieveData.username ).then(function(data){
							$scope.noStatus = true;
							if( data.hasOwnProperty('isError') && data.isError ){
								$scope.notices = data;
							}else{
								$scope.retrieveType = $scope.registerType;
							}
						},function(a){
							$scope.noStatus = true;
						});
					}
				}
			}
			
			//第二步：手机输入验证码
			$scope.submitStep2 = function(){
				if( $scope.retrieveData.username && $scope.retrieveData.code && $scope.registerType == "mobile" ){
					$scope.noStatus = false;
					userService.checkCodeByMobile( $scope.retrieveData.username,$scope.retrieveData.code ).then(function(data){
						$scope.noStatus = true;
						if( data.hasOwnProperty('isError') && data.isError ){
							$scope.notices = data;
						}else{
							$scope.retrieveType = "setPassword";
						}
					});
				}
			}
			
			//第三步：发送找回密码表单
			$scope.submitStep3 = function(){
				$scope.dologinIn();
			}
			
			//提交表单
			$scope.dologinIn = function(){
				if( $scope.registerType == "mobile" ){
					var updata = {};
					updata.mobile = $scope.retrieveData.username;
					updata.code = $scope.retrieveData.code;
					updata.pwd = $scope.retrieveData.pwd;
					//手机注册
					userService.resetMobilePwd(updata).then(function(data){
						//登录成功，自动登录
						var loginData = {};
						loginData.username = updata.mobile;
						loginData.password = updata.pwd;
						userService.loginIn('candidates',loginData).then(function(value){
							if(value){
								//跳转到c用户页面
		     					$state.go( 'candidates' );
							}else{
								console.log("登录失败");
							}
						})
					});
				}else if( $scope.registerType == "email" ){
					var updata = {};
					updata.email = $scope.retrieveData.username;
					updata.code = $scope.retrieveData.code;
					updata.pwd = $scope.retrieveData.pwd;
					//邮箱注册
					userService.resetEmailPwd(updata).then(function(data){
						//登录成功，自动登录
						var loginData = {};
						loginData.username = updata.email;
						loginData.password = updata.pwd;
						userService.loginIn('candidates',loginData).then(function(value){
							if(value){
								//跳转到c用户页面
		     					$state.go( 'candidates' );
							}else{
								console.log("登录失败");
							}
						})
					});
				}
				
			}
			
		}
	]);
});