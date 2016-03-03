//  recruiters主入口文件
//  main.js
//  <project> 主入口文件
//  
//  Created by jeffery on 2015-05-21.
//  Copyright 2015 jeffery. All rights reserved.
//

require.config({
	baseUrl:'./userManagement/style/js',
	paths:{
		/*-----------------公共----------------*/
		//common
		"userManagementDirectives"     : "./directives/commonDirectives",     //定义模块指令
		"userManagementFilters"        : "./filters/commonFilters",           //定义模块过滤
		"userManagementServices"       : "./services/commonServices",         //定义服务模块
	},
	urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});

define([
	'userManagementModule',
	'userManagementDirectives',
	'userManagementFilters',
	'userManagementServices',
	],function(userManagement){
	//taho主控制模块run
	userManagement.mainModule.register('userManagementController',['$scope','$stateParams','$state','userService',
	function($scope,$stateParams,$state,userService){
		//判断用户是否已经登陆了 并且 不是 不包含引导页面
		var userInfo = userService.getUserInfo();
		if( userInfo && $state.current.name !="userManagement.notice" && $state.current.name !="userManagement.guide" ){
			userInfo.userStatus = (userInfo.userStatus == 'companyAdmin')?"company":userInfo.userStatus;
			$state.go(userInfo.userStatus);
		}
	}]);
});

	
	
	


