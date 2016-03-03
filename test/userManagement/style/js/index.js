/**
 * candidates 模块定义
 */
define(['angular'], function (angular) {
    'use strict';
    
    var controllersMoudle = angular.module("userManagement.controllers",[])
    	.config(['$controllerProvider',function($controllerProvider){
    		controllersMoudle.register = $controllerProvider.register;	
 	}]);
    			
    var directivesMoudle  = angular.module("userManagement.directives",[])
    	.config(['$compileProvider',function($compileProvider){
    		directivesMoudle.register = $compileProvider.directive;
    }]);
    
    var filtersMoudle  = angular.module("userManagement.filters",[])
    	.config(['$filterProvider',function($filterProvider){
    		filtersMoudle.register = $filterProvider.register;
    }]);
    
    var servicesMoudle  = angular.module("userManagement.services",[])
    	.config(['$provide',function($provide){
    		servicesMoudle.register = {
    			factory: $provide.factory,
    			service: $provide.service
    		}
    }]);
    
    var userManagementModule = angular.module("userManagementModule",[
    	'userManagement.controllers',
    	'userManagement.directives',
    	'userManagement.filters',
    	'userManagement.services',
    	]).config(['$controllerProvider',
    	function($controllerProvider){
			userManagementModule.register = $controllerProvider.register;
    }]);
    
    var userManagement = {
    	/******注册candidatesModule 相关组件模块*****/
    	//控制器模块
    	'controllers': controllersMoudle,
    	//指令模块
    	'directives' : directivesMoudle,
    	//过滤器模块
    	'filters'    : filtersMoudle,
    	//服务模块
    	'services'   : servicesMoudle,
    	/********声明应聘者主模块********/
    	'mainModule' : userManagementModule
    }
    return userManagement;
});

