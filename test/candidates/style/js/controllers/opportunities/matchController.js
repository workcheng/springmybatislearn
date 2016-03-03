/**
 * 加载招聘这-taho展示和编辑
 */
define(['candidatesModule'],function(candidates){
	//=================================匹配的机会对象=================================
	candidates.controllers.register('matchController',['$scope','$filter','$state','$rootScope',
	function($scope,$filter,$state,$rootScope){
		//添加相关页面
		var htmlTemplate = {
			'search':"candidates/views/common/search.html",
			'matchJohoRight':"candidates/views/common/rightJoho.html",
			'matchcohoRight':"candidates/views/common/rightCoho.html",
		}
		//添加相关页面
		$scope.inculdeHtml = {}
		$scope.inculdeHtml.htmlTemplate = htmlTemplate;
		$scope.inculdeHtml.rightHtml = "";
		$scope.inculdeHtml.searchHtml = "";
		$scope.inculdeHtml.loading = true;
		
		
		/*搜索joho*/
		$scope.root={};
		$scope.root.keywords = "";
		$scope.searchJohos = function(){
			if( !$filter('isEmptyFilter')( $scope.root.keywords ) ){
				$state.go("^.search",{search:$scope.root.keywords});
			}
		}
	}]);
	
	//============================joho对象的右侧部分=================================
	candidates.controllers.register('matchJohoRightPlugin',['$scope','matchService','$filter','userService','viewTahoService','$state','$stateParams','$rootScope',
	function($scope,matchService,$filter,userService,viewTahoService,$state,$stateParams,$rootScope){
		/*获取面试邀请*/
		matchService.internalMessageList().then(function(list){
			$scope.internalMessageList = list;
		});
		//获取访客
		var userId = userService.getUserInfo().user_id;
 		viewTahoService.getViewTaho(userId).then(function(data){
 			$scope.viewTahos = data.view_history;
 		});
	}]);
	
	//============================coho对象的右侧部分=================================
	candidates.controllers.register('matchCohoRightPlugin',['$scope','matchService','$filter','userService','viewTahoService','$state',
	function($scope,matchService,$filter,userService,viewTahoService,$state){
		/*人脉关系*/
		$scope.cohoUserList = matchService.cohoUserList();
		/*工作机会*/
		$scope.cohoJohoList = matchService.cohoJohoList();
	}]);
	
	
	//=================================匹配的列表=================================
	candidates.controllers.register('matchListController',['$scope','matchService','$filter',function($scope,matchService,$filter){
		/*************获取匹配的joho列表************/
		$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchJohoRight;
		$scope.inculdeHtml.searchHtml = $scope.inculdeHtml.htmlTemplate.search;
		$scope.inculdeHtml.loading = true;
		matchService.getTahoMatch().then(function(data){
			var list = $filter('orderBy')(data,'totalScore',true);
			$scope.matchJoHos = list.potentialJoHos;
			$scope.potentialJoHos = list.matchJoHos;
			$scope.inculdeHtml.loading = false;
		});
	}]);
	
	
	//=================================匹配的列表中joho详情=================================
	candidates.controllers.register('matchDetailController',
	['$scope','matchService','$stateParams','tahoService','viewTahoService','dealBreakerService','$timeout','$rootScope','userService',
	function($scope,matchService,$stateParams,tahoService,viewTahoService,dealBreakerService,$timeout,$rootScope,userService){
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
		
		
		$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchJohoRight;
		$scope.inculdeHtml.searchHtml = $scope.inculdeHtml.htmlTemplate.search;
		$scope.inculdeHtml.loading = true;
		$scope.tahoInfo = {};
		/*************获取比较的信息************/
		if( $stateParams.job_id ){
			matchService.compareWithJoho($stateParams.job_id).then(function(data){
				$scope.score=data;
			});
			
			//获取 taho的信息
			tahoService.getTahoCache().then(function(data){
				$scope.tahoInfo = data;
				$scope.refush();
			});
			
			//获取joho信息
			viewTahoService.getJohoDetail($stateParams.job_id).then(function(data){
				$scope.johoInfo = data;
				$scope.dealBreakers = dealBreakerService.showDealBreaker( data.dealbreak,data );
				$scope.inculdeHtml.loading = false;
				$scope.refush();
			});
		};
		
		var johoId = $stateParams.job_id;
		$scope.bool = false;
		$scope.riceCount = 0;
		$scope.johoReceiveRecommendation = 0;
		$scope.selfRecommendationFormData = {};
		$scope.selfRecommendationFormData.joho_id = johoId;
		$scope.changeRecommendationShowStatus = function(){
			if($scope.bool){
				$scope.bool=false;
			}else{
				tahoService.riceAndJohoRecommendationCount(johoId).then(function(data){
					if(data){
						$scope.riceCount = data.rice;
						$scope.johoReceiveRecommendation = data.recommedCount;
					}
				});

				$scope.bool=true;
			}
			if($rootScope.maskLayer){
				$rootScope.maskLayer = false;
			}else{
				$rootScope.maskLayer = true;
			}
			
		};
		$scope.selfRecommendation = function(){
			var Reg = /^\+?[1-9][0-9]*$/;
			if($scope.selfRecommendationFormData.reason && Reg.test($scope.selfRecommendationFormData.used_rice)){
				tahoService.selfRecommendation($scope.selfRecommendationFormData).then(
				function(result){					
					if(result.message){
						alert(result.message);
					}else{
						$scope.bool = false;
						$rootScope.maskLayer = false;
						alert("自荐成功，HR会在自荐列表中看到你!");
					}
				},function(err){
					alert(err.mesaage);
				},function(percentComplete){
					
				});
			}else if(!$scope.selfRecommendationFormData.reason){
				alert("请填写求职意向");
			}else if(!$scope.selfRecommendationFormData.used_rice || !Reg.test($scope.selfRecommendationFormData.used_rice)){
				alert("请填写正确的米粒数");
			}
		};
	}]);
	
	//=================================页面搜索结果的列表=================================
	candidates.controllers.register('matchSearchController',['$scope','matchService','$stateParams',function($scope,matchService,$stateParams){
		/*************获取搜索的joho列表************/
		if( $stateParams.search ){
			$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchJohoRight;
			$scope.inculdeHtml.searchHtml = $scope.inculdeHtml.htmlTemplate.search;
			$scope.inculdeHtml.loading = true;
			matchService.opportunitySerachJoho( $stateParams.search ).then(function( list ){
				$scope.keywords = $stateParams.search;
				$scope.searchList = list;
				$scope.inculdeHtml.loading = false;
			});
		}
	}]);
	
	//=================================获取coho详情=================================
	candidates.controllers.register('matchCohoDetailController',
	['$scope','matchService','$stateParams','viewTahoService','$timeout',
	function($scope,matchService,$stateParams,viewTahoService,$timeout){
		/*************获取比较的信息************/
		if( $stateParams.coho_id ){	
			$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchcohoRight;
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
			//获取joho信息
			viewTahoService.getCohoDetail($stateParams.coho_id).then(function(data){
				$scope.cohoInfo = data;
				$scope.inculdeHtml.loading = false;
				var video_id = document.getElementById("video_id");
				$timeout(function(){
					video_id.load();
					video_id.setAttribute('controls','controls');
				},10);
			});
		}
	}]);
	
	//=================================视频面试=================================
	candidates.controllers.register('matchInterviewController',
	['$scope','matchService','$stateParams','viewTahoService','$interval',
	function($scope,matchService,$stateParams,viewTahoService,$interval){
		$scope.inculdeHtml.searchHtml = "";
		$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchJohoRight;
		$scope.inculdeHtml.loading = true;
		//默认选中第一个
		$scope.style = 1;
		var timer = "";
		$scope.main = function(){
			timer = $interval(function(){
				if( $scope.style<4 ){
					$scope.style = $scope.style+1;
				}else{
					$scope.style = 1;
				}
			},3000);
		}
		$scope.main();
		
		$scope.showStep = function(index){
			$scope.style = index;
			$interval.cancel(timer);
			$scope.main();
		}
		
	}]);
	
	/**
	 * author:andy
	 * 2015-12-28
	 */
	//=================================自荐列表=================================
	candidates.controllers.register('selfRecommendationController',
	['$scope','$filter','selfRecommendationService',function($scope,$filter,selfRecommendationService){
		$scope.inculdeHtml.rightHtml = $scope.inculdeHtml.htmlTemplate.matchJohoRight;
		$scope.inculdeHtml.searchHtml = $scope.inculdeHtml.htmlTemplate.search;
		$scope.inculdeHtml.loading = true;
				
		var getSelfRecommendationList = function () {
			
			var postData = {
                pageIndex: $scope.paginationConf.currentPage==0?1:$scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage
        	};
        	
			selfRecommendationService.getSelfRecommendationList(postData.pageSize,postData.pageIndex).then(function(data){
				$scope.recommendJOHOs = data.recommendJOHOs;
				$scope.inculdeHtml.loading = false;
				$scope.paginationConf.totalItems = data.pageCount * postData.pageSize;
			});
			
			
		};
		//配置分页基本参数
        $scope.paginationConf = {
            currentPage: 1,
            itemsPerPage: 10,
        };

        /***************************************************************
	        当页码和页面记录数发生变化时监控后台查询
	        如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
        ***************************************************************/
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getSelfRecommendationList);
		
	}]);
	
});
