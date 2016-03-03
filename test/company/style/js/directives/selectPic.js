/**
 * 招聘者公共指令集合
 */
define([
	'companyModule',
	], function ( company ) {

	//选中图片
	company.directives.register('selectPic',['$rootScope','showImage','userService',function($rootScope,showImage,userService){
		return {
			scope:{
				selectPic : '=',
			},
			restrict:'A',
			template:function(tElement,tAttrs){
				var templeate = '<div class="uploadBorder" ng-class="{\'noborder\':hasPic}">\
									<div class="uploadBorder_show" ng-if="hasPic" style="background-image:url({{selectPic}})"></div>\
									<div class="uploadBorder_input" ng-class="{\'hasPic\':hasPic}">\
										<input type="file"/>\
										<a>上传图片</a>\
									</div>\
								</div>';
				return templeate;
			},
			replace:true,
			controller:function($scope,$element,$attrs){
				$scope.$watch('selectPic',function(data){
					if(data){
						//判断是否现在已经有图片展示了
						if( $scope.selectPic ){
							$scope.hasPic = true;
							var img=new Image();
							img.src= $scope.selectPic;
							if(img.width==0){
								$scope.selectPic = './company/style/img/error.png';
							}
						}else{
							$scope.hasPic = false;
						}
						$scope.hasPic = true;
					}
				});
			},
			link:function($scope,$element,$attrs){
				//选择图片
				$element.find("input[type='file']").bind('change',function(){
					var ele = this;
					if( !ele.value ){
						return false;
					}
					if( !ele.value.match( /.jpg|.png|.bmp/i ) ){
						alert('图片格式不对，请重新选择JPG或PNG文件！');
						return false;   
					}
					//获取编码
					showImage.value(this).then(function(data){
						$scope.selectPic = data;
					});
				});
			}
		}
	}]);
});