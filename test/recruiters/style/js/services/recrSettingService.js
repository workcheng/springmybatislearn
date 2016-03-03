/**
 * 设置中心
 */
define([
	'recruitersModule',
], function(recruiters) {
	recruiters.services.register.factory('recrSettingService', ['$resource', 'URL', '$filter', '$q', function($resource, URL, $filter, $q) {
		//==========声明服务=============
		var otherStyle = {
			put: {
				method: "PUT",
			}
		};
		//修改设置
		var recrSettingResource = $resource(URL.recrSetting, {}, otherStyle);
		//发送手机验证码
		var settingMobileBindingResource = $resource(URL.settingMobileBinding, {}, otherStyle);
		//发送邮箱验证码
		var settingEmailBindingResource = $resource(URL.settingEmailBindingJoho, {}, otherStyle);
		//绑定邮箱
		var emailBindingResource = $resource(URL.emailBinding, {}, otherStyle);
		//B用户解除绑定C用户 
		var cancelBindResource = $resource(URL.cancelBind, {}, otherStyle);
		//B用户获取公司信息
		var companyInfoResource = $resource(URL.companyInfo, {}, otherStyle);
		//B用户保存公司信息
		var updateComInfoResource = $resource(URL.updateComInfo, {}, otherStyle);

		var recrSettingService = {
			//修改头像
			updateAvatar: function(avatar) {
				var deffer = $q.defer();
				recrSettingResource.put({}, {
					'avatar_data': avatar
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改用户名
			updateName: function(name) {
				var deffer = $q.defer();
				recrSettingResource.put({}, {
					'name': name
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//发送手机验证码
			sendMobileCode: function(mobile) {
				var deffer = $q.defer();
				settingMobileBindingResource.save({}, {
					'mobile': mobile
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//绑定手机号
			updateMobile: function(phone, code) {
				var deffer = $q.defer();
				recrSettingResource.put({}, {
					'phone': phone,
					'code': code
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//发送邮箱验证码
			sendEmailCode: function(email) {
				var deffer = $q.defer();
				settingEmailBindingResource.save({}, {
					'email': email
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//绑定邮箱
			updateEmail: function(code) {
				var deffer = $q.defer();
				emailBindingResource.save({}, {
					'code': code
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改密码
			updatePwd: function(newPwd, oldPwd) {
				var deffer = $q.defer();
				recrSettingResource.put({}, {
					'password': newPwd,
					'oldPassword': oldPwd
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//修改隐私设置
			updatePrivacy: function(privacy) {
				var deffer = $q.defer();
				recrSettingResource.put({}, {
					'privacy_setting': privacy
				}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//B用户解除绑定C用户 
			cancelBind: function(privacy) {
				var deffer = $q.defer();
				cancelBindResource.put({}, {}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//B用户获取公司信息
			getCompanyInfo: function(privacy) {
				var deffer = $q.defer();
				companyInfoResource.get({}, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//保存公司信息
			updateCompanyInfo: function(comInfo) {
				var deffer = $q.defer();
				updateComInfoResource.put({}, comInfo, function(data) {
					deffer.resolve(data);
				});
				return deffer.promise;
			},



		}
		return recrSettingService;
	}]);
});