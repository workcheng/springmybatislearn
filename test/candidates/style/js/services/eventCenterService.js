/**
 * 事件中心
 */
define([
	'candidatesModule',
	], function ( candidates ) {
	candidates.services.register.factory('eventCenterService',['$resource','URL','$filter','$q',function($resource,URL,$filter,$q){
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

    	//获取事件中心
    	var eventCenterListResource =  $resource( URL.eventCenterList,{}, otherStyle);
    	
    	//获取事件中心中的拒绝joho
    	var eventCenterDeclineListResource =  $resource( URL.eventCenterDecline,{}, otherStyle);
    	
    	//事件中心的消息
    	var eventCenterMessageListResource =  $resource( URL.eventCenterMessageList,{}, otherStyle);
    	
    	//拒绝B的邀请
    	var rejectInviteResource = $resource( URL.rejectInvite,{},otherStyle);
    	
    	var eventCenterService={
			
			//获取事件中心
			getEventList : function(){
				var deffer = $q.defer();
				eventCenterListResource.query({},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//获取事件中心中的拒绝joho
			getEventDeclineList : function(){
				var deffer = $q.defer();
				eventCenterDeclineListResource.query({},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//获取事件中心的消息通知
			getEventMessageList : function(){
				var deffer = $q.defer();
				eventCenterMessageListResource.query({},function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			},
			
			//拒绝B的邀请
			rejectInvite : function(info){
				var deffer = $q.defer();
				rejectInviteResource.put({},info,function( data ){
					deffer.resolve(data);
				});
				return deffer.promise;
			}
			
    	}
    	return eventCenterService;
	}]);
});