//  taho主入口文件
//  main.js
//  <project> 主入口文件
//  
//  Created by jeffery on 2015-05-21.
//  Copyright 2015 jeffery. All rights reserved.
//

require.config({
	baseUrl:'./candidates/style/js',
	paths:{
		/*-----------------公共----------------*/
		//common
		"candidatesDirectives"     : "./directives/commonDirectives",     //定义模块指令
		"candidatesFilters"        : "./filters/commonFilters",           //定义模块过滤
		"candidatesServices"       : "./services/commonServices",         //定义服务模块
	},
	urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});

define([
	'candidatesModule',
	'candidatesDirectives',
	'candidatesFilters',
	'candidatesServices',
	],function(candidates){
	//taho主控制模块run
	candidates.mainModule.register('candidatesController',
		['$scope','userService',
			function($scope,userService){
			$scope.navs = [
				{ 'URL':'.opportunities','title' : '机会' },
				{ 'URL':'.taho','title' : 'TAHO' },
				{ 'URL':'.notice','title' : '事件中心' },
				{ 'URL':'.challenge','title' : '挑战' },
			];
			$scope.userInfo = userService.getUserInfo();
			//登出
			$scope.loginOut = function( url ){
				userService.loginOut( url );
			}
	}]);
});

	
	
	


