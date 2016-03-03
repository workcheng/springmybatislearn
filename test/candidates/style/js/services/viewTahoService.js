/**
 * 招聘者公共过滤器集合
 */
define([
	'candidatesModule',
	], function ( candidates ) {
	candidates.services.register.factory('viewTahoService',['$resource','URL','$filter','$q',function($resource,URL,$filter,$q){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		}
    	};
		//获取访问taho的列表	
    	var viewTahoResource = $resource( URL.viewTaho+"/:user_id",{'user_id':'@id'});
    	//从taho访问joho详情
    	var viewJohoDetailResource = $resource( URL.viewJohoDetail+"/:job_id",{'job_id':'@id'});
    	//从taho访问其他coho详情
    	var viewCohoDetailResource = $resource( URL.viewCohoDetail+"/:coho_id",{'coho_id':'@id'});
    	
    	var viewTahoService={
			//获取访问记录
			getViewTaho : function( userId ){
				var deffer = $q.defer();
				viewTahoResource.get({'user_id':userId},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//从taho访问joho
   			getJohoDetail : function( jobId ){
   				var deffer = $q.defer();
   				viewJohoDetailResource.get({'job_id':jobId},function(data){
   					deffer.resolve(data);
   				});
   				return deffer.promise;
   			},
   			
   			//从taho访问coho
   			getCohoDetail : function( jobId ){
   				var deffer = $q.defer();
   				viewCohoDetailResource.get({'coho_id':jobId},function(data){
   					deffer.resolve(data);
   				});
   				return deffer.promise;
   			},
			
    	}
    	return viewTahoService;
	}]);
});