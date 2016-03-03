/**
 * 日期到日期插件
 */
define([
	'candidatesModule',
	], function ( candidates) {
		//日期到日期
		candidates.directives.register('dateToDate',['$filter',function($filter){
			return {
				scope:{
					startTime : '=',
					endTime   : '=',
				},
				require:'?ngModel',
				template:function(tElement,tAttrs){
					var template = '\
								<div class="fromYear select_module" tabindex="0" ng-blur="doOpenTab()">\
									<input type="hidden" />\
									<div class="showText" ng-click="doOpenTab(\'fromYear\')">{{result.fromYear}}</div>\
									<div class="showBut"></div>\
									<ul ng-show="openTab == \'fromYear\'">\
										<li ng-repeat="year in yearList" value="{{year}}">{{year}}</li>\
									</ul>\
								</div>\
								<label class="tag">年</label>\
								<div class="fromMonth select_module"  tabindex="0" ng-blur="doOpenTab()">\
									<input type="hidden" />\
									<div class="showText" ng-click="doOpenTab(\'fromMonth\')">{{result.fromMonth}}</div>\
									<div class="showBut"></div>\
									<ul ng-show="openTab == \'fromMonth\'">\
										<li ng-repeat="month in months" value="{{month}}">{{month}}</li>\
									</ul>\
								</div>\
								<label class="toTag">到</label>\
								<br />\
								<div class="toYear select_module cl"  tabindex="0" ng-blur="doOpenTab()">\
									<input type="hidden" />\
									<div class="showText" ng-click="doOpenTab(\'toYear\')">{{result.toYear}}</div>\
									<div class="showBut"></div>\
									<ul ng-show="openTab == \'toYear\'">\
										<li value="">至今</li>\
										<li ng-repeat="year in yearList" value="{{year}}">{{year}}</li>\
									</ul>\
								</div>\
								<label class="tag" ng-hide="result.toYear == \'至今\'">年</label>\
								<div class="toMonth select_module" tabindex="0" ng-blur="doOpenTab()" ng-hide="result.toYear == \'至今\'">\
									<input type="hidden" />\
									<div class="showText" ng-click="doOpenTab(\'toMonth\')">{{result.toMonth}}</div>\
									<div class="showBut"></div>\
									<ul ng-show="openTab == \'toMonth\'">\
										<li ng-repeat="month in months" value="{{month}}">{{month}}</li>\
									</ul>\
								</div>';
					return template;
				},
				controller:function($scope,$element,$attrs){
					/*********init*********/
					//声明年
					var nowDate = new Date();
					var endYear = nowDate.getFullYear();
					var beginYear =  endYear - 66;
					var yearList = [];
					for(var i=endYear;i>=beginYear;i--){
						yearList.push(i);
					}
					//声明月份
					var endMonth = nowDate.getMonth();
					var months = [];
					for(var i=1;i<=12;i++ ){
						var month={};
						if(i<10){
							month='0'+i;
						}else{
							month=i;
						}
						months.push(month);
					}
					
					
					$scope.beginYearList = yearList;
					$scope.beginMonthList = months;
					$scope.endYearList = yearList;
					$scope.endMonthList = months;
					
					
					$scope.months = months;
					$scope.yearList = yearList;
					
					
					$scope.result = {};
					$scope.result.fromYear = '';
					$scope.result.fromMonth = '';
					$scope.result.toYear = '';
					$scope.result.toMonth = '';
					$scope.result.toNow = "至今";
					
					//获取开始时间
					if( $scope.startTime  && $scope.startTime != 0){
						var getStartTime = new Date( parseInt($scope.startTime)*1000 );
						$scope.result.fromYear = getStartTime.getFullYear();
						$scope.result.fromMonth = showMonth( getStartTime.getMonth()+1 );
					}else{
						$scope.result.toYear = "";
						$scope.result.toMonth = "";
					}
					
					//获取结束时间
					if( $scope.endTime ){
						var getEndTime = new Date( parseInt($scope.endTime)*1000 );
						$scope.result.toYear = getEndTime.getFullYear();
						$scope.result.toMonth = showMonth( getEndTime.getMonth()+1 );
					}else if( $scope.endTime === 0 ){
						$scope.result.toYear = "至今";
						$scope.result.toMonth = "";
					}else{
						$scope.result.toYear = "";
						$scope.result.toMonth = "";
					}
					
					
					/*********main*********/
					//声明打开的选项卡
					$scope.openTab = '';
					$scope.doOpenTab = function( id ){
						if( id && $scope.openTab != id ){
							$scope.openTab = id;
						}else{
							$scope.openTab = '';
						}
					}
					//选中数据函数
					$scope.getSelectData = function( value ){
						value = value?value:'至今';
						if( $scope.openTab ){
							$scope.result[$scope.openTab] = value;
							getTrueDate();
						}
						$scope.doOpenTab('');
					}
					
					//获取处理得到的开始时间和结束时间
					function getTrueDate(){
						//form
						var formYear  = angular.copy( $scope.result.fromYear );
						var fromMonth = showMonth(angular.copy( $scope.result.fromMonth ));
						if( formYear && parseInt(fromMonth) ){
							fromMonth = (fromMonth && fromMonth!=0)?fromMonth:'01';
							var formDate = formYear+'/'+(fromMonth)+'/01';
							$scope.startTime = dateToTime(formDate);
						}else{
							$scope.startTime = "";
						}
						//to
						var toYear  = angular.copy( $scope.result.toYear );
						var toMonth = showMonth(angular.copy( $scope.result.toMonth ));
						if( toYear == "至今"){
							$scope.endTime = 0;
						}else if( toYear && parseInt(toMonth) ){
							toMonth = (toMonth && toMonth!=0)?toMonth:'01';
							var toDate = toYear+'/'+(toMonth)+'/01';
							$scope.endTime = dateToTime(toDate);
						}else{
							$scope.endTime = "";
						}
						if( ($scope.startTime=="" || $scope.endTime === "") && (formYear||fromMonth||toYear||toMonth)  ){
							$scope.startTime=0;
						}
					}
					
					//月份展示格式 
					function showMonth( month ){
						if( month.length<2 && month < 10 ){
							month = '0'+month.toString();
						}
						return month
					}
					
					//日期格式转成时间戳
					function dateToTime( date ){
						var getDate = new Date( date );
						var result = getDate.getTime()/1000;
						return result;
					}
					
				},
				link:function($scope,$element,$attrs,$ctr){
					//时间选选择事件
					$element.on('click','li',function(){
						var a = this;
						$scope.$apply(function(){
							$scope.getSelectData( $(a).attr('value') );
						});
					});
					
					
					
					
					
					
					
				},
				
			}
		}]);
});