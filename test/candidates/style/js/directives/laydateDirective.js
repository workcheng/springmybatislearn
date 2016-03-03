/**
 * 日期到日期插件
 */
define([
	'candidatesModule',
	], function ( candidates) {
		//日期到日期
		candidates.directives.register('layDate',function(){
			return {
				require:'?ngModel',
				restrict:'EA',
				controller:function($scope,$element,$attrs){
					
				},
				link:function($scope,$element,$attrs,$ctr){
					$element.bind('click',function(elem){
						laydate({
						    elem: elem[0],
						    format: 'YYYY年MM月DD日', // 分隔符可以任意定义，该例子表示只显示年月
						    festival: true,           //显示节日
						    max: laydate.now(),
						    issure: false,
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