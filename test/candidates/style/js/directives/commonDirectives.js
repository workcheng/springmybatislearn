/**
 * 招聘者公共指令集合
 */
define([
	'candidatesModule',
	'./directives/dateToDateDirectives',         //日期到日期指令
	'./directives/uploadFileImgDirectives',      //上传图片
	'./directives/uploadFileVideoDirectives',    //上传视频
	'./directives/laydateDirective',      		 //选择日期插件
	], function ( candidates ) {
		//通用指令 案例
//		candidates.directives.register('dealBreak',function(){
//			return {
//				scope:{
//					dbClick : "&",
//					dbValue : '=',
//				},
//				template:function(tElement,tAttrs){
//					tElement.addClass('dealBreakClass');
//					var template = "<span ng-transclude></span><div class='dealBreaktag'><div class='dealBreaktagClass'><div class='db_arrow'><div class='shadow_arrow'></div></div>列为必要条件</div></div>";
//					return template;
//				},
//				transclude:true,
//				link:function(scope,element,attrs){
//					angular.element( element[0].querySelector(".dealBreaktagClass") ).bind('click',function(){
//						scope.dbClick();
//					});
//				}
//			}
//		});


		candidates.directives.register('goCenter',function(){
			return {
				restrict:'EA',
				link:function($scope,$element,$attrs){
					var delayTime = $attrs.goCenter;
					setTimeout(function(){
						$element.addClass('special');
					},delayTime);
				}
			}
		});

});