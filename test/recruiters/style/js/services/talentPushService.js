/**
 * 人才推送
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		
	recruiters.services.register.factory('talentPushService',['$resource','URL','$filter','$q','$stateParams',function($resource,URL,$filter,$q,$stateParams){
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
    	
    	//翻页书
    	var pageSize=100;
    	
		//获取人才推送的joho列表资源
		var getPushJohoListResurce = $resource( URL.talentPushJohoList+"/"+pageSize+"/:pageNumber",{'pageNumber':'@pageNumber'},otherStyle);
		//获取人才推送的joho下人才列表资源
		var getPushTalentListResurce = $resource( URL.talentPushTalentList+"/:job_id/:joho_name",{'job_id':"@jobId",'joho_name':"@johoName"},otherStyle);
		//访问taho详情
    	var viewTahoResource = $resource( URL.viewTaho+"/:taho_id",{'taho_id':'@id'});
    	//给指定的joho和tahos打分
    	var viewMatchResource = $resource( URL.johoMatchTahoScore+"/:job_id/:taho_ids",{'job_id':"@jobId",'taho_ids':'@id'},otherStyle);
    	
    	//拒绝并反馈
    	var removeTalentResource = $resource( URL.removeTalent,{},otherStyle);

		//定义变量
		var params = {};
		params.jobId = "";               //选中的job_id
		params.tahoId = "";              //选中的taho_id
		params.pushTalentList = "";      //params.jobId下对应的人才列表
		
    	var talentPushService={
			//获取人才推送的joho列表
			getPushJohoList : function( num ){
				num = num?num:$stateParams.pageNumber;
				var deffer = $q.defer();
				getPushJohoListResurce.get({'pageNumber':num},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//获取人才推送的joho下人才列表
//			getPushTalentList : function( jobId ){
//				jobId = jobId?jobId:$stateParams.job_id;
//				if( jobId ){
//					if(jobId == params.jobId && params.pushTalentList){
//						var deffer = $q.defer();
//						deffer.resolve(params.pushTalentList);
//						return deffer.promise;
//					}else{
//						var deffer = $q.defer();
//						getPushTalentListResurce.get({'job_id':jobId},function( data ){
//							//定义缓存
//							params.jobId = jobId;
//							params.pushTalentList = data;
//							deffer.resolve(data);
//						});
//						return deffer.promise;
//					}
//				}
//			},
			getPushTalentList : function( jobId ){
				jobId = jobId?jobId:$stateParams.job_id;
				var deffer = $q.defer();
				getPushTalentListResurce.get({'job_id':jobId},function( data ){
					//定义缓存
					params.jobId = jobId;
					params.pushTalentList = data;
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//缓存-获取人才推送的joho下人才列表      用于taho与taho的比较
			getCachePushTalentList : function( jobId ){
				jobId = jobId?jobId:$stateParams.job_id;
				if( jobId ){
					if( jobId == params.jobId ){
						return params.pushTalentList;
					}else{
						return getPushTalentListResurce.get({'job_id':jobId},function( data ){
							//定义缓存
							params.jobId = jobId;
							params.pushTalentList = data;
						});
					}
				}
			},
			
			//获取人才推送的taho详情
			getPushTalentDetail : function(tahoId){
				tahoId = tahoId?tahoId:$stateParams.taho_id;
				var deffer = $q.defer();
				viewTahoResource.get({'taho_id':tahoId},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//给joho和tahos进行打分
			getPushTalentMatchScore : function(jobId,tahoId){
				jobId = jobId?jobId:$stateParams.job_id;
				tahoId = tahoId?tahoId:$stateParams.taho_id;
				var deffer = $q.defer();
				viewMatchResource.getArray({'taho_ids':tahoId,'job_id':jobId},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//人才拒绝并反馈
			removeTalent:function(info){
				var deffer = $q.defer();
				removeTalentResource.put({},info,function(data){
					deffer.resolve(data);
				});
				return deffer.promise;
			}
			
    	}
    	return talentPushService;
	}]);
});