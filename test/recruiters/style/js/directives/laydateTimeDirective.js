/**
 * 日期到日期插件
 */
define([
	'recruitersModule',
	], function ( candidates) {
		//日期到日期
		candidates.directives.register('layDateTime',function(){
			return {
				require:'?ngModel',
				restrict:'EA',
				controller:function($scope,$element,$attrs){
					
				},
				link:function($scope,$element,$attrs,$ctr){
					$element.bind('click',function(elem){
						laydate({
						    elem: elem[0],
						    format: 'YYYY年MM月DD日 hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月日时分秒
						    festival: true,           //显示节日
						    min: laydate.now(1),
						    issure: true,
						    istoday: false,
						    istime: true,
						    choose: function(datas){  //选择日期完毕的回调
						    	if( datas ){
						    		var str = datas; // 日期字符串
									str = str.replace(/(年|月)/g,'/');
									str = str.replace(/日/g,'');
						    		var date = new Date(str);
						    		var time =  date.getTime();
						    		$ctr.$setViewValue(time);
						    	}else{
						    		$ctr.$setViewValue(null);
						    	}
						    }
						});
					});
				},
				
			}
		});
});