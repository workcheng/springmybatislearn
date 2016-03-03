/**
 * 加载招聘者-joho管理
 */
define(['recruitersModule'],function(recruiters){
	/*********************joho管理主模块*****************************/
	recruiters.controllers.register('recruitersJohoController',['$scope','$state',
		function($scope,$state){
			//添加相关页面
			$scope.inculdeHtml = {}
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
			
			//转播信息
			$scope.$on('editModuleTag', function(e,newLocation) {
		        $scope.$broadcast('editModuleTag1',newLocation);
		    });
		    $scope.$on('position', function(e,newLocation) {
		        $scope.$broadcast('position1',newLocation);
		    });
		    $scope.$on('colSelectTag', function(e,newLocation) {
		        $scope.$broadcast('colSelectTag1',newLocation);
		    });
		     $scope.$on('johoStatus', function(e,newLocation) {
		        $scope.$broadcast('johoStatusToEdit',newLocation);
		    });
		    
		    //当前编辑的joho模块
		    $scope.johoModule = {};
		    $scope.johoModule.johoInfo="";
		    
		}
	]);
	
	/*********************joho管理-joho列表*****************************/
	recruiters.controllers.register('recruitersJohoListController',['$scope','$state','johoService','$filter','$stateParams',
		function($scope,$state,johoService,$filter,$stateParams){
			//添加搜索框
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.loading = true;
			//主函数
			$scope.main = function(){
				//获取johos列表集合
			 	johoService.getJohoList().then(function(data){
			 		$scope.inculdeHtml.loading = false;
			 		if( !$filter('isEmptyFilter')(data.JoHos.closeTaHo) || !$filter('isEmptyFilter')(data.JoHos.inprogressTaHo) || !$filter('isEmptyFilter')(data.JoHos.publicTaHo) ){	
			 			$scope.hasJoho = true;
			 		}
			 		$scope.closeJohos = data.JoHos.closeTaHo;
			 		$scope.editJohos = data.JoHos.inprogressTaHo;
			 		$scope.releaseJohos = data.JoHos.publicTaHo;
			 		$scope.pageNumber = $stateParams.pageNumber;
			 		$scope.pageCount = data.pageCount;
			 	});
			}
			
		 	$scope.main();
			
			//页面跳转到发布详情页面或者编辑详情页面
			$scope.transformDetail = function(job_id){
				$state.go("recruiters.joho.detail",{'job_id':job_id});
			}
			
			//页面跳转到创建页面
			$scope.transformCreation = function(){
				//$state.go("recruiters.joho.edit.position");
				//创建joho
				//获取johoname
				var resultForm = {};
				resultForm.joho_name="";
			 	johoService.createJoho(resultForm).then(function(data){
			 	 	$state.go("recruiters.joho.edit",{'job_id':data['job_id']});
			 	 });
			}
		}
	]);
	
	/*********************joho管理-joho历史*****************************/
	recruiters.controllers.register('recruitersJohoHistoryController',['$scope','$state','johoService','$filter',
		function($scope,$state,johoService,$filter){
			//添加搜索框
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.rightHtml = "";
		}
	]);
	
	
	/*********************************joho管理-右侧栏*********************************/
	//=================================右侧编辑状态框==================================
	recruiters.controllers.register('johoRightColumnController',['$scope','$filter','johoService','openFileLayout', 'recrSettingService', 
		function($scope,$filter,johoService,openFileLayout,recrSettingService){
			//转播信息
			$scope.$on('editModuleTag1', function(e,newLocation) {
		        $scope.editModuleTag=newLocation;
		    });
		    $scope.$on('position1', function(e,data) {
		        $scope.basicInfo=data;
		    });
			
			recrSettingService.getCompanyInfo().then(function(data) {
				$scope.comInfo = data;
			});
			
		    //广播修改的模块
			$scope.changeEditModuleTag = function( tag ){
				var obj={};
				obj.tag = tag;
				obj.value = true;
				$scope.$emit('colSelectTag',obj);
			}
			
			//修改joho的状态
			$scope.changeJohoStatus = function(status){
				//发布时判断心理学数据是否填写
				if( status == 2 && !($scope.basicInfo.EQ.eq_value && $scope.basicInfo.IQ.iq_value && $scope.basicInfo.behavior_style.behavior_style_id && $scope.basicInfo.thinking_pattern.thinking_pattern_id && $scope.basicInfo.motivation.motivation_id && $scope.basicInfo.value.value_id) ){
					alert("JOHO必须完成全部心理学编辑，才能发布！")
					//判断是否已经完成全部心理学数据
				}else if( status == 2 && !$scope.basicInfo.position.joho_name ){
					alert("JOHO必须基本信息中的“职位名称”，才能发布！")
				}else if (status == 2 && !($scope.comInfo.company_name && $scope.comInfo.short_company_name 
				&& $scope.comInfo.industry_id && $scope.comInfo.location_id 
				&& $scope.comInfo.company_size_type_id && $scope.comInfo.company_type_id)) {
					alert("JOHO必须完成公司信息，才能发布！")
				} else{
					johoService.changeJohoStatus(status).then(function(){
						$scope.basicInfo.johoStatus = status;
						//广播新状态
						$scope.$emit('johoStatus',status);
					});
				}
				
			}
		    
		    //=================================右侧编辑状态框==================================
		    //joho 模块组合
			$scope.johoModules = [
 				{'name':'职位信息','tag':'position'},
 				{'name':'教育信息','tag':'education'},
 				{'name':'工作经验','tag':'work_experience'},
 				{'name':'语言','tag':'languages'},
 				{'name':'技能','tag':'skills'},
 				{'name':'证书','tag':'certificates'},
 				{'name':'动机',   'tag':'motivation'},
 				{'name':'价值观',  'tag':'value'},
 				{'name':'IQ',    'tag':'IQ'},
 				{'name':'思维模式','tag':'thinking_pattern'},
 				{'name':'行为模式','tag':'behavior_style'},
 				{'name':'EQ',    'tag':'EQ'},
 				{'name':'面试问题','tag':'interview_questions'},
 				{'name':'类别重要性','tag':'category_importance'},
 			];
			//判断是否编辑完成
			$scope.isEdited = function(tag){
				if( $filter('isEmptyFilter')( $scope.basicInfo) || $filter('isEmptyFilter')( $scope.basicInfo[tag] ) ){
					return false;
				}else{
					return true;
				}
			};
			//邀请用户
			$scope.inviteUser = function() {
				//打开弹出层
				openFileLayout.openDialog({
					"template": "invite_user.html",
					"scope": $scope.$parent.$new(),
					"position": "absolute",
				});
			}

	}]);

	
	//=================================dealbreak控制器=================================
	recruiters.controllers.register('johoDealBreakController',['$scope','$filter','dealBreakerService','$stateParams',
		function($scope,$filter,dealBreakerService,$stateParams){
			//获取最原始的数据
//			$scope.$watch('dealBreakerInfo',function(data){
//				if( data ){
//					//获取编码后的全部dealbreak
//					$scope.dealBreaker = dealBreakerService.showDealBreaker( $scope.dealBreakerInfo,$scope.pageData );
//					//原声的dealbreaker
//					$scope.dealBreakerInfo['languages_db'] = $filter('getArrayFromObjectExtended')($scope.dealBreaker,'tag','status',1);
//					//选中的dealbreaker
//					//$scope.showDealBreaker = $filter('dealbreakerFilter')(data,1);
//				}
//			});
			//获取最原始的数据
			$scope.$on('position1', function(e,data) {
		        if(angular.isDefined(data.dealBreakerInfo)){
					$scope.dealBreakerInfo = data.dealBreakerInfo;
					//获取编码后的全部dealbreak
					$scope.dealBreaker = dealBreakerService.showDealBreaker( data.dealBreakerInfo,data.pageData );
					//原声的dealbreaker
					$scope.dealBreakerInfo['languages_db'] = $filter('getArrayFromObjectExtended')($scope.dealBreaker,'tag','status',1);
					//选中的dealbreaker
					//$scope.showDealBreaker = $filter('dealbreakerFilter')(data,1);
				}
		    });
			
			
			//添加dealbreaker
			$scope.addDealbreaker = function( db ){
				//修改dealbraker
				if( db && angular.isObject( db ) ){
					db['status'] = 1;
					var name = db.name;
					//判断是否是语言
					var filter = /^(language_db_)[0-9]+$/;
					if( filter.test( name ) ){
						$scope.dealBreakerInfo['languages_db'] = $filter('getArrayFromObjectExtended')($scope.dealBreaker,'tag','status',1);
					}else{
						$scope.dealBreakerInfo[name] = 1;
					}
					
				}else if( angular.isString( db ) ){
					db = $filter('selectObjFromObjArr')($scope.dealBreaker,'name',db);
					$scope.$apply(function(){
						db['status'] = 1;
					});
					var name = db.name;
					//判断是否是语言
					var filter = /^(language_db_)[0-9]+$/;
					if( filter.test( name ) ){
						$scope.dealBreakerInfo['languages_db'] = $filter('getArrayFromObjectExtended')($scope.dealBreaker,'tag','status',1);
					}else{
						$scope.dealBreakerInfo[name] = 1;
					}
				}
			}
			//删除dealbraker
			$scope.removeDealbreaker = function( db ){
				if( db && angular.isObject( db ) ){
					db['status'] = 0;
					var name = db.name;
					//判断是否是语言
					var filter = /^(language_db_)[0-9]+$/;
					if( filter.test( name ) ){
						$scope.dealBreakerInfo['languages_db'] = $filter('getArrayFromObjectExtended')($scope.dealBreaker,'tag','status',1);
					}else{
						$scope.dealBreakerInfo[name] = 0;
					}
					//$scope.dealBreaker[name] = 0;
				}
			}
			//保存dealbreaker
			$scope.saveDealbreaker = function(){
				var value = angular.copy($scope.dealBreakerInfo);
				dealBreakerService.saveDealBreaker( {'job_id':$stateParams.job_id},value );
				$scope.dealBreakerEditStatus = false;
			}
	}]);
	
	//=================================添加team_member模版=================================
	recruiters.controllers.register('johoTeamMemberController',['$scope','$filter','$state','teamMemberService',
		function($scope,$filter,$state,teamMemberService){
			//获取最原始的数据
			$scope.$on('position1', function(e,data) {
		        if(angular.isDefined(data.teamMembers)){
		        	$scope.teamMembers = data.teamMembers;
					//获取b用户集合
					teamMemberService.getBUsers().then(function(info){
						$scope.businessUsersResource = info;
						//去除已经存在的用户
						$scope.businessUsers = $filter('filterSelect')($scope.businessUsersResource,'business_user_id',data.teamMembers);
					});
				}
		        
		    });
			
			//添加teammenber
			$scope.addToTeamMember = function(info){
				teamMemberService.addTeamMember('"'+info.business_user_id+'"').then(function(joho_team_member_id){
					var infoData = angular.copy(info);
					infoData.joho_team_member_id = joho_team_member_id;
					$scope.teamMembers.push( infoData );
					$scope.businessUsers = $filter('filterSelect')($scope.businessUsersResource,'business_user_id',$scope.teamMembers);
				});
			}
			
			//删除teammember
			$scope.delaFromTeamMember = function(info){
				teamMemberService.delTeamMember(info.joho_team_member_id).then(function(){
					var index = $scope.teamMembers.indexOf(info);
					$scope.teamMembers.splice(index,1);
					$scope.businessUsers = $filter('filterSelect')($scope.businessUsersResource,'business_user_id',$scope.teamMembers);
				});
			}
	}]);
		
});
