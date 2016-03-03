//  taho主入口文件
//  main.js
//  <project> 主入口文件
//  
//  Created by jeffery on 2015-05-21.
//  Copyright 2015 jeffery. All rights reserved.
//

require.config({
	baseUrl:'./company/style/js',
	paths:{
		/*-----------------公共----------------*/
		//common
		"companyDirectives"     : "./directives/commonDirectives",     //定义模块指令
		"companyFilters"        : "./filters/commonFilters",           //定义模块过滤
		"companyServices"       : "./services/commonServices",         //定义服务模块
	},
	urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});

define([
	'companyModule',
	'companyDirectives',
	'companyFilters',
	'companyServices',
	],function(company){
	//taho主控制模块run
	company.mainModule.register('companyController',
		['$scope','userService',
			function($scope,userService){
			$scope.navs = [
				{ 'URL':'.coho','title' : 'COHO' },
				{ 'URL':'.teamManagement','title' : '团队管理' },
				{ 'URL':'.setMeal','title' : '套餐' },
			];
			$scope.userInfo = userService.getUserInfo();
			//登出
			$scope.loginOut = function(){
				userService.loginOut('userManagement.loginCompany');
			}
	}]);
});

	
	
	


