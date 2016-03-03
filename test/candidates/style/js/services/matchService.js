/**
 * 匹配服务
 */
define([
	'candidatesModule',
	], function ( candidates ) {
	candidates.services.register.factory('matchService',
		['$resource','URL','$filter','$q','$stateParams',
			function($resource,URL,$filter,$q,$stateParams){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		},
    		getArray:{
    			method:"GET",
    			isArray:true,
    		}
    	};
		//根据TaHo的信息推送JoHo
    	var tahoMatchResource = $resource( URL.tahoMatch,{}, otherStyle);
    	//计算当前TaHo与指定的JoHo
    	var compareWithJohoResource =  $resource( URL.compareWithJoho+"/:job_id",{'job_id':'@id'}, otherStyle);
    	//在taho中搜索joho
    	var opportunitySerachJohoResource =  $resource( URL.opportunitySerachJoho+"/:keywords",{'keywords':'@keywords'}, otherStyle);
    	
    	//获取面试邀请
    	var internalMessageListResource =  $resource( URL.internalMessageList,{}, otherStyle);
    	//获取coho下的所有user列表
    	var cohoUserListResource = $resource( URL.cohoUserList+"/:coho_id",{'coho_id':'@id'},otherStyle);
    	//获取coho下的所有joho列表
    	var cohoJohoListResource = $resource( URL.cohoJohoList+"/:coho_id",{'coho_id':'@id'},otherStyle);
    	
    	var matchService={
			//根据TaHo的信息推送JoHo
			getTahoMatch : function(){
				var deffer = $q.defer();
				tahoMatchResource.get({},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//计算当前TaHo与指定的JoHo
			compareWithJoho : function(jobId){
				var deffer = $q.defer();
				compareWithJohoResource.get({'job_id':jobId},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//计算当前TaHo与指定的JoHo
			opportunitySerachJoho : function(keywords){
				var deffer = $q.defer();
				opportunitySerachJohoResource.getArray({'keywords':keywords},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//获取面试邀请列表
			internalMessageList : function(){
				var deffer = $q.defer();
				internalMessageListResource.getArray({},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//获取coho下的user列表
			cohoUserList : function(){
				return cohoUserListResource.get({'coho_id':$stateParams.coho_id});
			},
			//获取coho下的joho列表
			cohoJohoList : function(){
				return cohoJohoListResource.getArray({'coho_id':$stateParams.coho_id});
			},
    	}
    	return matchService;
	}]);
});