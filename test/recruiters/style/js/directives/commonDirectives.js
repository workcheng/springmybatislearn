/**
 * 招聘者公共指令集合
 */
define([
	'recruitersModule',
	'./directives/commentsDirectives',     //comments指令
	'./directives/commentsAllDirectives',  //comments指令
	'./directives/johoNameDirective',      //joho_name指令
	'./directives/removeTalentDirective',  //拒绝并反馈
	'./directives/videoComment',           //视频评论
	'./directives/laydateTimeDirective',   //时间选择指令
	'./directives/selectLogo',           //上傳公司logo
	], function ( recruiters ) {
	recruiters.directives.register('dealBreak',function(){
		return {
			scope:{
				dbClick : "&",
				dbValue : '=',
			},
			template:function(tElement,tAttrs){
				tElement.addClass('dealBreakClass');
				var template = "<span ng-transclude></span><div class='dealBreaktag'><div class='dealBreaktagClass'><div class='db_arrow'><div class='shadow_arrow'></div></div>列为必要条件</div></div>";
				return template;
			},
			transclude:true,
			link:function(scope,element,attrs){
				angular.element( element[0].querySelector(".dealBreaktagClass") ).bind('click',function(){
					scope.dbClick();
				});
			}
		}
	});
});