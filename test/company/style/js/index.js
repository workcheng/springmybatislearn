/**
 * company 模块定义
 */
define(['angular'], function (angular) {
    'use strict';
    
    var controllersMoudle = angular.module("company.controllers",[])
    	.config(['$controllerProvider',function($controllerProvider){
    		controllersMoudle.register = $controllerProvider.register;	
 	}]);
    			
    var directivesMoudle  = angular.module("company.directives",[])
    	.config(['$compileProvider',function($compileProvider){
    		directivesMoudle.register = $compileProvider.directive;
    }]);
    
    var filtersMoudle  = angular.module("company.filters",[])
    	.config(['$filterProvider',function($filterProvider){
    		filtersMoudle.register = $filterProvider.register;
    }]);
    
    var servicesMoudle  = angular.module("company.services",[])
    	.config(['$provide',function($provide){
    		servicesMoudle.register = {
    			factory: $provide.factory,
    			service: $provide.service
    		}
    }]);
    
    var companyModule = angular.module("companyModule",[
    	'company.controllers',
    	'company.directives',
    	'company.filters',
    	'company.services',
    	]).config(['$controllerProvider',
    	function($controllerProvider){
			companyModule.register = $controllerProvider.register;
    }]);
    
    var company = {
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
    	'mainModule' : companyModule
    }
    return company;
});