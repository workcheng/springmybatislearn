/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'],function(candidates){
	//=================================创建编辑joho  的controller对象=================================
	candidates.controllers.register('simpleTahoController',
		['$scope',
		'$stateParams',
		'$filter',
		'$q',
		'$timeout',
		'viewTahoService',
		'userService',
		function(
			$scope,
			$stateParams,
			$filter,
			$q,
			$timeout,
			viewTahoService,
			userService){
		/*************定义参数***********/
	 	//获取joho详细信息
		$scope.refreshTahoDetail = function( userId ){
			var deffer = $q.defer();
			viewTahoService.getViewTaho(userId).then(function(data) {
				/*******basic******/
				$scope.company = data['coho'];
				/*******basic******/
				$scope.basic = data['basic'];
				/*******显示education数据******/
				$scope.educations = data['educations'];
				/******work_experiences******/
				$scope.work_experiences = data['work_experiences'];
				/*****显示language数据******/
				$scope.languages = data['languages'];
				/*****显示 skill 数据******/
				$scope.skills = data['skills'];
				/*****显示certifications数据******/
				$scope.certificates = data['certificates'];
				/**********隐私设置******/
				$scope.privacySetting = data['privacy_setting'];
				
				/*用于教育与工作经验的显示*/
				$scope.canvasData = {};
				$scope.canvasData.work_experiences = data['work_experiences'];
				$scope.canvasData.educations = data['educations'];
			   	deffer.resolve($scope.basic.taho_id);
		 	});
		 	return deffer.promise;
	 	}
		
		//通过js调整模块高度
		$scope.refush = function(){
			//生成状态信息
			$timeout(function(){
				var tabsGroup = $("[class^=tab-0gmi-group-2],[class^=tab-0gmi-group-3]");
				angular.forEach(tabsGroup,function(tabs){
					
					$(tabs).find('.tab').css('height','');
					$(tabs).find('.filp').css('height','');
					var thisHeight = [];
					
					var tabClass = $(tabs).find('.tab');
					angular.forEach(tabClass,function(item){
						thisHeight.push( $(item).height() );
					});
					
					var filps = $(tabs).find('.front');
					angular.forEach(filps,function(filp){
						thisHeight.push( $(filp).height() );
					});
					
					var maxHeight = Math.max.apply(Math, thisHeight);//最大值
					$(tabs).find('.tab').height(maxHeight);
					$(tabs).find('.filp').height(maxHeight);
				});
			},10);
		}
		
	 	//获取simpleTaho信息
	 	if( $stateParams.user_id ){
	 		$scope.user_id = $stateParams.user_id;
 			$scope.refreshTahoDetail($scope.user_id).then(function(){
 				$scope.refush();
 			});
	 	}
	}]);
	
	//=================================右侧编辑状态框==================================
	candidates.controllers.register('simpleTahoEditStautsController',['$scope','$filter',
		function($scope,$filter){
			
	}]);
	
	
	
});
