/**
 * 招聘者公共过滤器集合
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		
	/**
	 * dealbreak状态过滤
	 * @param {int}
	 */
	recruiters.filters.register("dealbreakerFilter",function(){
		
		var dealbreakerFilter = function( data , tag ){
			var info = data;
			var tag = tag?tag:0;
			var result=[];
			//status
			if( info && info.length>0 ){
				for(var i =0;i<info.length;i++){
					if( info[i]['status'] == tag ){
						result.push(info[i]);
					}
				}
			}
			return result;
		}
		
		return dealbreakerFilter;
	});
	
	
	
	/**
	 * commants 显示评论条数,若无为+
	 */
	recruiters.filters.register("commentsCountFilter",function(){
		
		var commentsCountFilter = function( data , tag  ){
			var result ="+";
			if( data && data.hasOwnProperty(tag) && data[tag].hasOwnProperty('count') ){
				if( data[tag]['count'] > 0 ){
					result = data[tag]['count'];
				}
			}
			return result;
		}
		
		return commentsCountFilter;
	});
	
	
	

});