/**
 * candidates 模块定义
 */
define(['angular'], function(angular) {
	'use strict';

	var controllersMoudle = angular.module("recruiters.controllers", [])
		.config(['$controllerProvider', function($controllerProvider) {
			controllersMoudle.register = $controllerProvider.register;
		}]);

	var directivesMoudle = angular.module("recruiters.directives", [])
		.config(['$compileProvider', function($compileProvider) {
			directivesMoudle.register = $compileProvider.directive;
		}]);

	var filtersMoudle = angular.module("recruiters.filters", [])
		.config(['$filterProvider', function($filterProvider) {
			filtersMoudle.register = $filterProvider.register;
		}]);

	var servicesMoudle = angular.module("recruiters.services", [])
		.config(['$provide', function($provide) {
			servicesMoudle.register = {
				factory: $provide.factory,
				service: $provide.service
			}
		}]);

	var recruitersModule = angular.module("recruitersModule", [
		'recruiters.controllers',
		'recruiters.directives',
		'recruiters.filters',
		'recruiters.services',
	]).config(['$controllerProvider',
		function($controllerProvider) {
			recruitersModule.register = $controllerProvider.register;
		}
	]);

	var recruiters = {
		/******注册candidatesModule 相关组件模块*****/
		//控制器模块
		'controllers': controllersMoudle,
		//指令模块
		'directives': directivesMoudle,
		//过滤器模块
		'filters': filtersMoudle,
		//服务模块
		'services': servicesMoudle,
		/********声明应聘者主模块********/
		'mainModule': recruitersModule
	}
	return recruiters;
});