/**
 * 获取joho的相关评论
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		
	recruiters.services.register.factory('commentsService',['$resource','URL','$filter','$q',function($resource,URL,$filter,$q){
		//==========声明服务=============
    	var otherStyle = {
    		put:{
				method:"PUT",
    		}
    	};
		//comments数据
		var commentsData = "";
    	var commentsResource = $resource( URL.commentsUrl+"/:tag_id",{'tag_id':'@id'}, otherStyle);
    	
    	var job_id = "";
    	
    	var commentsService={
			//设置comments数据
			setComments : function( data , id ){
				commentsData = data;
				job_id = id;
			},
			//获取comments数据
			getComments : function( jobId,style ){
				var deffer = $q.defer();
				if( job_id == jobId && commentsData ){
					if(style){
						if( commentsData[style] ){
							deffer.resolve(commentsData[style]);
						}else{
							var obj={};
							obj.count=0;
							obj.list=[];
							deffer.resolve(obj);
						}
					}else{
						deffer.resolve(commentsData);
					}
				}else{
					commentsResource.get({'tag_id':jobId},function( data ){
						commentsService.setComments( data, jobId );
						if(style){
							if( data[style] ){
								deffer.resolve(data[style]);
							}else{
								var obj={};
								obj.count=0;
								obj.list=[];
								deffer.resolve(obj);
							}
						}else{
							deffer.resolve(data);
						}
					});
				}
				return deffer.promise;
			},
			//添加comments数据
			addComments : function( jobId , data ,fn){
				return commentsResource.save({'tag_id':jobId},data,function( info ){
					if( angular.isFunction(fn) ){
						fn(info);
					}
				});
			},
			//删除comments数据
			delComments : function( comment_id ,fn ){
				return commentsResource.remove({'tag_id':comment_id},{},function( info ){
					if( angular.isFunction(fn) ){
						fn(info);
					}
				});
			}
    	}
    	return commentsService;
	}]);
});