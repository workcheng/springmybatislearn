/**
 * teammember
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		
	recruiters.services.register.factory('teamMemberService',['$resource','URL','$filter','$q','$stateParams',function($resource,URL,$filter,$q,$stateParams){
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
    	
		//获取所有b用户
    	var getBUsersResource = $resource( URL.getBUsers,{},otherStyle);
    	//单独保存某个teammember
    	var addTeamMemberResource = $resource( URL.addTeamMember+'/:job_id',{'job_id':'@id'},otherStyle);
    	//删除teammember
    	var delTeamMemberResource = $resource( URL.deleteTeamMember+'/:team_member_id',{'team_member_id':'@id'},otherStyle);
    	
    	var businessUsersData = "";
    	
    	var teamMemberService={
			//保存所有b用户
			setBusinessUsers : function( data ){
				businessUsersData = data;
			},
			//获取所有b用户
			getBUsers : function( ){
				var deffer = $q.defer();
				if( businessUsersData ){
					deffer.resolve(businessUsersData);
				}else{
					getBUsersResource.getArray({},function( data ){
						teamMemberService.setBusinessUsers( data);
						deffer.resolve(data);
					});
				}
				return deffer.promise;
			},
			
			//添加团队成员
			addTeamMember : function( business_user_id ){
				var jobId = $stateParams.job_id;
				if( jobId ){
					var deffer = $q.defer();
					addTeamMemberResource.save({'job_id':jobId},business_user_id,function( info ){
						deffer.resolve(info.joho_team_member_id);
					});
					return deffer.promise;
				}
			},
			
			//删除团队成员
			delTeamMember : function( teamMemberId ){
				var deffer = $q.defer();
				if( teamMemberId ){
					delTeamMemberResource.remove({'team_member_id':teamMemberId},function( info ){
						deffer.resolve();
					});
				}else{
					deffer.reject();
				}
				return deffer.promise;
			}
    	}
    	return teamMemberService;
	}]);
});