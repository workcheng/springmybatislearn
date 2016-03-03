/**
 * 事件中心
 */
define([
	'candidatesModule',
	], function ( candidates ) {
	candidates.services.register.factory('candSettingService',['$resource','URL','$filter','$q',function($resource,URL,$filter,$q){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		}
    	};

    	//修改设置
    	var candSettingResource =  $resource( URL.candSetting,{}, otherStyle);
    	//发送手机验证码
    	var settingMobileBindingResource =  $resource( URL.settingMobileBinding,{}, otherStyle);
    	//发送邮箱验证码
    	var settingEmailBindingResource =  $resource( URL.settingEmailBinding,{}, otherStyle);
    	//绑定邮箱
    	var emailBindingResource =  $resource( URL.emailBinding,{}, otherStyle);
    	
    	var candSettingService={
    		//修改头像
    		updateAvatar : function( avatar ){
				var deffer = $q.defer();
				candSettingResource.put({},{'avatar_data':avatar},function(data){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改用户名
			updateName : function( name ){
				var deffer = $q.defer();
				candSettingResource.put({},{'name':name},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改个性签名
			updateSpeciality : function( speciality ){
				var deffer = $q.defer();
				candSettingResource.put({},{'speciality':speciality},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//发送手机验证码
			sendMobileCode : function(mobile){
				var deffer = $q.defer();
				settingMobileBindingResource.save({},{'mobile':mobile},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//绑定手机号
			updateMobile : function(phone,code){
				var deffer = $q.defer();
				candSettingResource.put({},{'phone':phone,'code':code},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//发送邮箱验证码
			sendEmailCode : function(email){
				var deffer = $q.defer();
				settingEmailBindingResource.save({},{'email':email},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//绑定邮箱
			updateEmail : function(code){
				var deffer = $q.defer();
				emailBindingResource.save({},{'code':code},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改密码
			updatePwd : function(newPwd,oldPwd){
				var deffer = $q.defer();
				candSettingResource.put({},{'password':newPwd,'oldPassword':oldPwd},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改推送模式
			updatePushMode : function(push_mode){
				var deffer = $q.defer();
				candSettingResource.put({},{'push_mode':push_mode},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改屏蔽公司
			updateUnwanted : function(unwanted){
				var deffer = $q.defer();
				candSettingResource.put({},{'unwanted_company_name':unwanted},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
    	}
    	return candSettingService;
	}]);
});