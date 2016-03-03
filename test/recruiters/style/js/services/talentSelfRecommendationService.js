/**
 * 人才自荐
 * andy
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		
	recruiters.services.register.factory('talentSelfRecommendationService',['$resource','URL','$filter','$q','$stateParams',function($resource,URL,$filter,$q,$stateParams){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		},
    		getArray:{
				method:"GET",
				isArray:true,
    		},
    	};
    	
    	//翻页数
//  	var pageSize = "";
    	
    	//人才自荐
    	var getSelfRecommendationTalentListResource = $resource( URL.talentRecommendation+"/:type"+"/:johoId"+"/"+":pageSize"+"/:pageNumber",{'pageSize':'@pageSize','type':'@type','johoId':'@johoId','pageNumber':'@pageNumber'},otherStyle);

		//定义变量
		var params = {};
		params.jobId = "";               //选中的job_id
		params.pushTalentList = "";      //params.jobId下对应的人才列表
		params.type = "";
		params.pageSize = "";
		params.pageNumber = "";
		
		params.selfRecommendationTalentList = "";
		
		var talentSelfRecommendationService = {
//			selfRecommendationTalentList : function(type,jobId,pageNumber){
//				jobId = jobId?jobId:$stateParams.job_id;
//				if( jobId ){
//					if( jobId == params.jobId && params.selfRecommendationTalentList){
//						var deffer = $q.defer();
//						deffer.resolve(params.selfRecommendationTalentList);
//						return deffer.promise;
//					}else{
//						var deffer = $q.defer();
//						getSelfRecommendationTalentListResource.get({'type':type,'johoId':jobId,'pageNumber':pageNumber},function(data){
//							//定义缓存
//							params.jobId = jobId;
//							params.type = type;
//							params.pageNumber = pageNumber;
//							params.selfRecommendationTalentList = data;
//							deffer.resolve(data);
//						});
//						return deffer.promise;
//					}
//				}
//			},
			selfRecommendationTalentList : function(type,jobId,pageSize,pageNumber){
				jobId = jobId?jobId:$stateParams.job_id;
				var deffer = $q.defer();
				getSelfRecommendationTalentListResource.get({'type':type,'johoId':jobId,'pageSize':pageSize,'pageNumber':pageNumber},function(data){
					//定义缓存
					params.jobId = jobId;
					params.type = type;
					params.pageSize = pageSize;
					params.pageNumber = pageNumber;
					params.selfRecommendationTalentList = data;
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			//缓存-获取人才推送的joho下人才列表      用于taho与taho的比较
			getCacheSelfRecommendationTalentList : function( type,jobId,pageSize,pageNumber){
				type = type?type:$stateParams.type;
				jobId = jobId?jobId:$stateParams.job_id;
				pageNumber = pageNumber?pageNumber:$stateParams.pageNumber;
				pageSize = pageSize?pageSize:$stateParams.pageSize;
				if( jobId ){
					if( jobId == params.jobId && params.selfRecommendationTalentList){
						return params.selfRecommendationTalentList;
					}else{
						return getSelfRecommendationTalentListResource.get({'type':type,'johoId':jobId,'pageSize':pageSize,'pageNumber':pageNumber},function(data){
							//定义缓存
							params.jobId = jobId;
							params.type = type;
							params.pageSize = pageSize;
							params.pageNumber = pageNumber;
							params.selfRecommendationTalentList = data;
						});
					}
				}
			},
		}
			return talentSelfRecommendationService;
	}]);
});