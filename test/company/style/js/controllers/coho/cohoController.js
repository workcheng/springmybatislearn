/**
 * 企业 coho展示和编辑
 */
define(['companyModule'],function(company){
	//=================================coho 模块=================================
	company.controllers.register('cohoController',['$scope','$filter','cohoService','$q','$timeout',function($scope,$filter,cohoService,$q,$timeout){
		//初始化
		$scope.setting = {};
		$scope.setting.loading=true;
		$scope.setting.editModule = "";
		$scope.setting.video_show = false;
		
		//主函数
		$scope.main = function(){
			//获取coho信息
			if( $scope.userInfo.company_id ){
				$scope.setting.video_show = false;
				cohoService.getCompanyCohoDetail( $scope.userInfo.company_id ).then(function(data){
					$scope.cohoInfo = data;
					//设定分模块
					/*basic*/
					$scope.basic = {};
					$scope.basic.company_name = data.company_name;
					$scope.basic.short_company_name = data.short_company_name;
					$scope.basic.company_details = data.company_details;
					$scope.basic.company_logo = data.company_logo;
					/*introduce*/
					$scope.introduce = {};
					$scope.introduce.company_video = data.company_video;
					$scope.introduce.company_video_image = data.company_video_image;
					
					/*information*/
					$scope.information = {};
					$scope.information.company_type_name = data.company_type_name;
					$scope.information.industry_name = data.industry_name;
					$scope.information.company_address = data.company_address;
					$scope.information.company_phone = data.company_phone;
					$scope.information.company_website = data.company_website;
					$scope.information.company_email = data.company_email;
					$scope.information.company_size_type = data.company_size_type;
					$scope.information.company_create_time = data.company_create_time;
					$scope.information.company_type_id = parseInt(data .company_type_id);
					$scope.information.industry_id = parseInt(data.industry_id);
					$scope.information.company_size_type_id = parseInt(data.company_size_type_id);
					/*weiXin*/
					$scope.weiXin = {};
					$scope.weiXin.wechat_image = data.wechat_image;
					$scope.weiXin.wechat_text = data.wechat_text;
					/*weiBo*/
					$scope.weiBo = {};
					$scope.weiBo.weibo_image = data.weibo_image;
					$scope.weiBo.weibo_text = data.weibo_text;
					
					$scope.setting.loading=false;
				});
			}
		}
		$scope.main();
		//监听获取视频路径并加载load
		$scope.$watch('introduce.company_video',function(data){
			if( data ){
				$timeout(function(){
					var video_id = document.getElementById("video_id");
					//var deffer = $q.defer();
					video_id.load();
					video_id.setAttribute('controls','controls');
					$scope.setting.video_show = true;
				},1);
			}
		});
		//当模块进行改变时关闭视频
//		$scope.$watch('setting.editModule',function(data,old){
//			if( !angular.isUndefined(old) ){
//				setTimeout(function(){
//					document.getElementById("video_id").load();
//				},0);
//			}
//		});
		
		
		//更新企业信息
		$scope.updateCoho = function( data ){
			var deffer = $q.defer();
			$scope.setting.loading=true;
			cohoService.updateCohoInfo( data ).then(
				function(result){
					$scope.setting.loading=false;
					$scope.setting.editModule = "";
					$scope.main();
					deffer.resolve(result);
				}
			);
			return deffer.promise;
		}
		
		//选中图片并展示
		$scope.selectPic = function( ){
			
		}
		
	}]);
	
	//=================================coho basic的编辑=================================
	company.controllers.register('cohoEditBasicController',['$scope',function($scope){
		//初始化
		$scope.$watch('basic',function( data ){
			$scope.editBasic = angular.copy(data);
		});
		
		//用于获取正确的提交数据
		var formDataStand = {
			"company_logo": '',
			"short_company_name": '',
			"company_name": '',
			"company_details": '',
		};
		//表单提交
		$scope.submitForm = function( valid,dirty ){
			if( valid ){
				var getData = angular.copy($scope.editBasic);
				//只保存修改的值
				angular.forEach(getData,function(value,key){
					if( value == $scope.basic[key] )
						delete getData[key];
				});
				if( getData['company_logo'] ){
					getData['company_logo_data'] = getData['company_logo'];
					delete getData['company_logo'];
				}
				$scope.updateCoho( getData );
			}
		}
	}]);
	
	//=================================coho introduce的编辑=================================
	company.controllers.register('cohoEditIntroduceController',['$scope','$filter','FileUploader','openFileLayout','URL',function($scope,$filter,FileUploader,openFileLayout,URL){
		//初始化
		$scope.$watch('introduce',function( data ){
			$scope.editIntroduce = angular.copy(data);
		});
		
		$scope.closeDialog = function(){
			//关闭弹出层
			openFileLayout.closeDialog('uplpad_video');
			//清空file的value
			document.formData.reset();
		}
		//初始化文件上传插件
		var uploader = $scope.uploader = new FileUploader({
            url   : URL.updateCohoVideo,
            alias : 'company_video',
            autoUpload  : true,
            removeAfterUpload : true,
            onAfterAddingFile :function(fileItem){
            	//判断上传的文件类型
            	var typeStatus = fileItem.file.type;
            	var type = '|' + typeStatus.slice(typeStatus.lastIndexOf('/') + 1) + '|';
            	type = type.toLowerCase();
            	//if( '|mp4|avi|3gp|rmvb|wmv|flv|mov|'.indexOf(type) != -1 ){
            	if( '|mp4|'.indexOf(type) != -1 ){
            		openFileLayout.openDialog({
            			'scope':$scope,
            			'template':'video_upload_dialog.html',
            			'key':'uplpad_video'
            		});
            	}else{
            		uploader.queue[0].remove();
            		alert("暂时只支持MP4视频格式上传！");
            	}
            },
            onProgressItem:function(fileItem, progress) {
	        },
            onErrorItem : function( fileItem, response, status, headers ){
            	alert("上传失败");
            	$scope.closeDialog();
            },
            onSuccessItem : function( fileItem, response, status, headers ){
            	$scope.closeDialog();
            	//将获取的文件路径上传到服务器
				$scope.setting.editModule = "";
				$scope.main();
            }, 
            onCompleteItem : function( fileItem, response, status, headers ){
            },
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item, options) {
                return this.queue.length < 10;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
	}]);
	
	//=================================coho information的编辑=================================
	company.controllers.register('cohoEditInformationController',['$scope','$filter','auxiliaryService','CONFIG',function($scope,$filter,auxiliaryService,CONFIG){
		//初始化
		$scope.$watch('information',function( data ){
			$scope.editInformation = angular.copy(data);
		});
		//用于获取正确的提交数据
		var formDataStand = {
			"company_type_id": '',
			"industry_id": '',
			"company_address": '',
			"company_phone": '',
			"company_website": '',
			"company_email": '',
			"company_size_type_id": '',
			"company_create_time": '',
		};
		
		//定义常用变量
		auxiliaryService.getAuxiliaryInfo().then(function(data){
			$scope.industyList = data.industies;
			$scope.companyTypeList = data.company_types;
		});
		//获取企业大小
		$scope.companyTypeSizeList = CONFIG.companyTypeSize;
		
		//表单提交
		$scope.submitForm = function( valid,dirty ){
			$scope.showError = true;
			if( valid ){
				var getData = angular.copy($scope.editInformation);
				//规范化对象
				getData = $filter('standardArr')(angular.copy(formDataStand),getData);
				//只保存修改的值
				angular.forEach(getData,function(value,key){
					if( value == $scope.information[key] )
						delete getData[key];
				});
//				if( getData['company_create_time'] ){
//					getData['company_create_time'] = getData['company_create_time']/100;
//				}
				$scope.updateCoho( getData );
			}
		}
	}]);
	
	//=================================coho weiXin的编辑=================================
	company.controllers.register('cohoEditWeiXinController',['$scope',function($scope){
		//初始化
		$scope.$watch('weiXin',function( data ){
			$scope.editWeiXin = angular.copy(data);
		});
		//表单提交
		$scope.submitForm = function( valid,dirty ){
			if( valid ){
				var getData = angular.copy($scope.editWeiXin);
				if(getData.wechat_image && getData.wechat_image != $scope.weiXin.wechat_image ){
					getData.wechat_image_data = getData.wechat_image;
					delete getData.weibo_image;
					$scope.updateCoho( getData );
				}else if(getData.wechat_image){
					delete getData.wechat_image;
					$scope.updateCoho( getData );
				}
			}
		}
	}]);
	
	//=================================coho weiBo的编辑=================================
	company.controllers.register('cohoEditweiBoController',['$scope',function($scope){
		//初始化
		$scope.$watch('weiBo',function( data ){
			$scope.editWeiBo = angular.copy(data);
		});
		//表单提交
		$scope.submitForm = function( valid,dirty ){
			$scope.showError = true;
			if( valid ){
				var getData = angular.copy($scope.editWeiBo);
				if(getData.weibo_image && getData.weibo_image != $scope.weiBo.weibo_image ){
					getData.weibo_image_data = getData.weibo_image;
					delete getData.weibo_image;
					$scope.updateCoho( getData );
				}else if(getData.weibo_image){
					delete getData.weibo_image;
					$scope.updateCoho(getData);
				}
			}
		}
	}]);
	
	
	//=================================coho 右侧模块=================================
	company.controllers.register('companyCohoRightController',['$scope',function($scope){
		
	}]);
	
});
