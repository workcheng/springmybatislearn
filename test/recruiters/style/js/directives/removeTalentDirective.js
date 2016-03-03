/**
 * 招聘者公共指令集合
 */
define([
	'recruitersModule',
	], function ( recruiters ) {
		recruiters.directives.register('removeTalent',['$rootScope','$stateParams',
		function($rootScope,$stateParams){
			return {
				scope:{
					removeTalent:"&",
				},
				restrict:'A',
				controller:function($scope,$element,$attrs){},
				link:function($scope,$element,$attrs){
					$element.bind('click',function(){
						//添加遮罩层
						$scope.$apply(function(){
							$rootScope.maskLayer =true;
						});
						//showHtml
						main();
					});
					
					var decline_taho = "";
					//mian
					function main(){
						var decHtml = createHtml();
						$('body').append($(decHtml));
						decline_taho = $("#decline_taho");
						var del = $('#decline_taho .cancel_button');
						var select_label = $('#decline_taho .decline_select_label');
						var decline_select = $('#decline_taho .decline_select');
						var decline_input = $('#decline_taho .decline_input');
						var posrel = $('#decline_taho .posrel');
						var submit_button = $('#decline_taho .submit_button');
						//取消按钮触发事件
						del.bind('click',function(){
							closeHtml();
						});
						//选择输入框的央视
						select_label.bind('click',function(){
							posrel.hide();
							decline_input.show().focus();
						});
						
						//用户提交
						submit_button.bind("click",function(){
							var value="";
							if(decline_input.is(":hidden")){
								value = decline_select.val();
							}else{
								value = decline_input.val();
							}
							
							if(value){
								var obj ={};
								obj.text = value;
								$scope.$apply(function(){
									$scope.removeTalent(obj);
								});
								closeHtml();
							}else{
								alert("请选择或填写拒绝理由");
							}
						});
						
					}
					
					//关闭或提交
					function closeHtml(){
						decline_taho.remove();
						$scope.$apply(function(){
							$rootScope.maskLayer =false;
						});
					}
					
					//创建样式
					function createHtml(){
						var template ='\
							<div id="decline_taho" class="zero_dialog">\
								<div class="cancel_button no_select"></div>\
								<h1 class="text_color_redSauce ta_c">人才拒绝并反馈</h1>\
								<div class="mb20">请选择拒绝该人才的理由:</div>\
								<div class="posrel">\
									<select class="decline_style decline_select">\
										<option value="">请选择拒绝理由</option>\
										<option value="工作经验并不符合我的期望">工作经验并不符合我的期望</option>\
										<option value="专业背景并不符合我的期望">专业背景并不符合我的期望</option>\
										<option value="候选人求职意愿不高">候选人求职意愿不高</option>\
									</select>\
									<label class="decline_select_label"></label>\
								</div>\
								<input class="decline_style decline_input" type="text" style="display:none;"/>\
								<div class="submit_button">提交</div>\
							</div>\
						';
						return template;
					}
				}
			}
		}]);
		
});