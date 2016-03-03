//  recruiters主入口文件
//  main.js
//  <project> 主入口文件
//  
//  Created by jeffery on 2015-05-21.
//  Copyright 2015 jeffery. All rights reserved.
//

require.config({
	baseUrl: './recruiters/style/js',
	paths: {
		/*-----------------公共----------------*/
		//common
		"recruitersDirectives": "./directives/commonDirectives", //定义模块指令
		"recruitersFilters": "./filters/commonFilters", //定义模块过滤
		"recruitersServices": "./services/commonServices", //定义服务模块
	},
	urlArgs: "bust=" + (new Date()).getTime() //防止读取缓存，调试用
});

define([
	'recruitersModule',
	'recruitersDirectives',
	'recruitersFilters',
	'recruitersServices',
], function(recruiters) {
	//taho主控制模块run
	recruiters.mainModule.register('recruitersController', ['$scope', 'userService',
		function($scope, userService) {
			$scope.navs = [{
				'URL': '.talentPush',
				'title': '人才推送'
			}, {
				'URL': '.eventCenter',
				'title': '事件中心'
			}, {
				'URL': '.joho',
				'title': 'JOHO管理'
			}];
			$scope.userInfo = userService.getUserInfo();
			//登出
			$scope.loginOut = function(url) {
				userService.loginOut(url);
			}
		}
	]);
});