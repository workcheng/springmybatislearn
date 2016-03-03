/**
 * candidates 模块定义
 */
define(['angular'], function (angular) {
    'use strict';
    
    var controllersMoudle = angular.module("candidates.controllers",[])
    	.config(['$controllerProvider',function($controllerProvider){
    		controllersMoudle.register = $controllerProvider.register;	
 	}]);
    			
    var directivesMoudle  = angular.module("candidates.directives",[])
    	.config(['$compileProvider',function($compileProvider){
    		directivesMoudle.register = $compileProvider.directive;
    }]);
    
    var filtersMoudle  = angular.module("candidates.filters",[])
    	.config(['$filterProvider',function($filterProvider){
    		filtersMoudle.register = $filterProvider.register;
    }]);
    
    var servicesMoudle  = angular.module("candidates.services",[])
    	.config(['$provide',function($provide){
    		servicesMoudle.register = {
    			factory: $provide.factory,
    			service: $provide.service
    		}
    }]);
    
    var candidatesModule = angular.module("candidatesModule",[
    	'candidates.controllers',
    	'candidates.directives',
    	'candidates.filters',
    	'candidates.services',
    	]).config(['$controllerProvider',
    	function($controllerProvider){
			candidatesModule.register = $controllerProvider.register;
    }]);
    
    var candidates = {
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
    	'mainModule' : candidatesModule
    }

    return candidates;
});