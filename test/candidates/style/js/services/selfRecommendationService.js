/**
 * author:andy
 * 2015-12-28
 */
define(['candidatesModule'],function(candidates){
	candidates.services.register.factory('selfRecommendationService',['$resource','URL','$filter','$q',function($resource,URL,$filter,$q){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		}
    	};
    	//taho的自荐列表
    	var selfRecommendationListResource = $resource( URL.selfRecommendationList+"/:pageSize"+"/:pageNumber",{'pageSize':'@pageSize','pageNumber':'@pageNumber'});
    	
    	var selfRecommendationService = {
    		//获取taho的自荐列表
    		getSelfRecommendationList : function( pageSize,pageNumber ){
    			var deffer = $q.defer();
				selfRecommendationListResource.get({'pageSize':pageSize,'pageNumber':pageNumber},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
    		},
			
    	}
    	return selfRecommendationService;
	}]);
	
});
