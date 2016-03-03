/**
 * 加载招聘这-taho展示和编辑
 */
define(['companyModule'],function(company){
	//=================================团队管理=================================
	company.controllers.register('teamManagementController',['$scope','$filter','$state','$rootScope',
	function($scope,$filter,$state,$rootScope){
		//添加相关页面
		var htmlTemplate = {
			//'search':"candidates/views/common/search.html",
			//'matchJohoRight':"candidates/views/common/rightJoho.html",
			//'matchcohoRight':"candidates/views/common/rightCoho.html",
		}
		//添加相关页面
		$scope.inculdeHtml = {}
		$scope.inculdeHtml.rightHtml = "";
		$scope.inculdeHtml.searchHtml = "";
		$scope.inculdeHtml.loading = true;
		
	}]);
	
	//=================================团队管理列表=================================
	company.controllers.register('teamManagementList',['$scope','$filter','$state','cohoService',
	function($scope,$filter,$state,cohoService){
		//初始化
		$scope.inculdeHtml = {}
		$scope.inculdeHtml.rightHtml = "";
		$scope.inculdeHtml.searchHtml = "";
		$scope.inculdeHtml.loading = true;
		$scope.loadData = function(){
			//获取团队信息
			cohoService.getTeamManagementList().then(function(data){
				$scope.tahoList = data;
				$scope.inculdeHtml.loading = false;
			});
		}
		$scope.loadData();
	}]);
	
	//=================================团队管理某个成员的信息=================================
	company.controllers.register('teamManagementDetail',['$scope','$filter','$state','cohoService',
	function($scope,$filter,$state,cohoService){
		//初始化
		$scope.inculdeHtml = {}
		$scope.inculdeHtml.rightHtml = "";
		$scope.inculdeHtml.searchHtml = "";
		$scope.inculdeHtml.loading = true;
		$scope.loadData = function(){
			//获取某个企业用户的信息
			cohoService.getTeamManagementDetail().then(function(data){
				$scope.basic = data.basic;
				$scope.johoList = data.johoList;
				$scope.inculdeHtml.loading = false;
			},function(){
				$scope.basic = "";
				$scope.johoList = [];
				$scope.inculdeHtml.loading = false;
			});
		}
		$scope.loadData();
	}]);
	
});
