/**
 * 加载招聘这-joho编辑
 */
define(['recruitersModule'],function(recruiters){
	//=================================创建编辑joho  的controller对象=================================
	recruiters.controllers.register('recruitersJohoEditController',
		['$scope','$stateParams','$filter','johoService','dealBreakerService','$q','commentsService','$timeout','$location','$anchorScroll',
		function($scope,$stateParams,$filter,johoService,dealBreakerService,$q,commentsService,	$timeout,$location,	$anchorScroll){
		/*************定义参数***********/
		$scope.job_id = $stateParams.job_id; //joho的id
		$scope.inculdeHtml.searchHtml = "";	
		$scope.inculdeHtml.rightHtml = "recruiters/views/common/johoRight.html";
		$scope.transformTag_iq = 0;
		$scope.transformTag_thinking_pattern = 0;
		$scope.transformTag_behavior_style = 0;
		$scope.transformTag_EQ = 0;
		$scope.transformTag_motivation = 0;
		$scope.transformTag_value = 0;
		
	 	//获取joho详细信息
		$scope.refreshJohoDetail = function(){
			var deffer = $q.defer();
			johoService.getJohoDetail({'job_id': $scope.job_id}).then(function(data){
				//赋值传递给B邀请C的使用
				$scope.johoModule.johoInfo = data;
				$scope.johoStatus = data['position']['job_status'];
				/*********显示coho数据*********/
				$scope.company = data['company'];
				/*******显示postition数据******/
				$scope.position = data['position'];
				if(  $filter('isEmptyFilter')(data['position'].position_id) ){
					//打开position的编辑状态
					$scope.editModuleTag = 'position';
				}
				/*******显示education数据******/
				$scope.education = data['education'];
				/******显示work_experience数据******/
				$scope.work_experience = data['work_experience'];
				/*****显示language数据******/
				$scope.languages = data['languages'];
				/*****显示 skill 数据******/
				$scope.skills = data['skills'];
				/*****显示certifications数据******/
				$scope.certificates = data['certificates'];
				/******显示motivation 数据******/
				$scope.motivation = data['motivation'];
				/******显示 value数据******/
				$scope.value = data['value'];
				/******显示iq数据******/
				$scope.IQ = data['iq'];
				/******显示thinking_pattern数据*******/
				$scope.thinking_pattern = data['thinking_pattern'];
				/**********显示eq数据***********/
				$scope.EQ = data['eq']
					/**********显示behaviur数据***********/
				$scope.behavior_style = data['behavior_style'];
				/**********显示面试问题***********/
				$scope.interview_questions = data['interview_questions'];
				/**********显示类别重要性***********/
				$scope.category_importance = data['category_importance'];
		   		/**********dealbreaker***********/
		   		$scope.dealBreakerInfo = data['dealbreak'];
			   	$scope.pageData = data;
			   	/**********团队成员***********/
			   	$scope.teamMembers = data['team_members'];
			   	
			   	//广播给兄弟节点基本信息
	 			var obj = {}
	 			obj.johoName = $scope.position.joho_name;
	 			obj.johoStatus = $scope.position.job_status;
	 			obj.johoId = $scope.position.job_id;
	 			obj.position = $scope.position;
	 			obj.education = $scope.education;
	 			obj.work_experience = $scope.work_experience;
	 			obj.languages = $scope.languages;
	 			obj.skills = $scope.skills;
	 			obj.certificates = $scope.certificates;
	 			obj.motivation = $scope.motivation;
	 			obj.value = $scope.value;
	 			obj.IQ = $scope.IQ;
	 			obj.thinking_pattern = $scope.thinking_pattern;
	 			obj.behavior_style = $scope.behavior_style;
	 			obj.EQ = $scope.EQ;
	 			obj.interview_questions = $scope.interview_questions;
	 			obj.category_importance = $scope.category_importance;
	 			obj.teamMembers = $scope.teamMembers
	 			obj.dealBreakerInfo = $scope.dealBreakerInfo;
			   	obj.pageData = $scope.pageData;
	 			$scope.$emit('position',obj);
			   	deffer.resolve();
		 	});
		 	return deffer.promise;
	 	}
		
		//通过js调整模块高度
		$scope.refush = function(){
			//生成状态信息
			$timeout(function(){
				var tabsGroup = $("[class^=tab-0gmi-group-]");
				angular.forEach(tabsGroup,function(tabs){
					
					$(tabs).find('.tab').css('height','');
					$(tabs).find('.filp').css('height','');
					var thisHeight = [];
					
					var tabClass = $(tabs).find('.tab');
					angular.forEach(tabClass,function(item){
						thisHeight.push( $(item).height() );
					});
					
					var filps = $(tabs).find('.front');
					angular.forEach(filps,function(filp){
						thisHeight.push( $(filp).height() );
					});
					
					var maxHeight = Math.max.apply(Math, thisHeight);//最大值
					$(tabs).find('.tab').height(maxHeight);
					$(tabs).find('.filp').height(maxHeight);
				});
			},10);
		}
		 	
		 	
	 	//判断是否存在job_id 如果存在则获取job信息,否则获取company的信息
	 	if( $scope.job_id ){
	 		$scope.refreshJohoDetail().then(function(){
	 			$scope.refush();
	 			$scope.inculdeHtml.loading = false;
	 		});
	 	}
		
		/********获取公共评论信息*********/
		commentsService.getComments( $scope.job_id ).then(function(data){
			$scope.comments = data;
		});
		//正在编辑的评论模块
		$scope.showCommentsModule = function( moduleName ){
			if( moduleName == $scope.commentsModule ){
				$scope.commentsModule = '';
			}else{
				$scope.commentsModule = moduleName;
			}
		}
		
		/********其他*********/
		//设定打开的编辑模块
		$scope.openEditModuleTag = function( tag , boolen){
		 	//页面跳转到某个位置
		 	
		 	var gotoAnhor = function(tag){
		 		$("html,body").animate({scrollTop:$("#"+tag).offset().top-100},200);
		 	}
		 	
		 	if( $filter("isEmptyFilter")(tag) ){
		 		$scope.editModuleTag ="";
		 	}else{
		 		$scope.editModuleTag =tag;
    			$timeout(function(){
    				gotoAnhor(tag);
    			},0);
		 	}
		 	
		 	//判断是否广播
		 	if(!boolen){
		 		$scope.$emit('editModuleTag',tag);
		 	}
		 	
		 	//加锁解锁功能组件
//		 	if( $filter("isEmptyFilter")(tag) ){
//		 		if( !$filter("isEmptyFilter")($scope.editModuleTag) ){
//		 			//请求解锁
//		 			johoService.getJohoUnLock({'job_id': $stateParams.job_id});
//		 		}
//		 		$scope.editModuleTag ="";
//		 	}else{
//		 		if( $filter("isEmptyFilter")($scope.editModuleTag) ){
//		 			//请求解锁
//		 			johoService.getJohoLock({'job_id': $stateParams.job_id}).then(function(data){
//		 				$scope.editModuleTag =tag;
//		    			$timeout(function(){
//		    				gotoAnhor(tag);
//		    			},0);
//		 			});
//		 		}else{
//		 			$scope.editModuleTag =tag;
//	    			$timeout(function(){
//	    				gotoAnhor(tag);
//	    			},0);
//		 		}
//		 	}
		}
		
		
		//选中弹出框类型
		$scope.editPluagin = function(id){
			$scope.editPluaginName = id;
		}
		
		//监听右侧栏选中
		$scope.$on('colSelectTag1', function(e,obj) {
	        $scope.openEditModuleTag(obj.tag,obj.value);
	    });
	    //监测joho状态改变
		$scope.$on('johoStatusToEdit', function(e,obj) {
	        $scope.johoStatus = obj;
	    });
		
	}]);
	
	
	
	
	//=================================添加position_basic模版=================================
	recruiters.controllers.register('johoPositionController',['$scope','$filter','$state','johoService',
		function($scope,$filter,$state,johoService){
			//获取最原始的数据
			$scope.$watch('position',function(data){
				if( angular.isDefined(data) ){
					if ( $filter('isEmptyFilter')(data['gender']) ) {
						data['gender'] = 3;
					}
					$scope.positionModule = angular.copy(data);
				}
			});
			
		  	//获取岁数展示
		  	var ageList = [];
		  	for(var i = 16;i<=65;i++){
		  		ageList.push(i);
		  	}
		  	$scope.ageList = ageList;
		 	//定义position表单,用于获取正确的提交数据
		 	var positionformDataStand = {                       
		 	   	"position_id": '',
		 	   	"location_id": '',
			   	"job_description": '',
			   	"salary": '',
			   	"gender": '',
			   	"age": '',
			   	"joho_name":"",
			   	"travel_type_id": '',
			   	"employment_type_id": '',
			 };
			 
		 	//是否显示提示，用于未修改表单就点击提交，检测是否通过
		 	$scope.showError = false;
		 	
		 	//提交position表单  valid：是否通过验证；dirty：是否修改过
		 	$scope.submitForm = function( valid,dirty ){     
			if (!valid) {
				$scope.showError = true;
			} else {
				//对提交结果进行处理
				var resultForm = $filter('standardArr')(angular.copy(positionformDataStand), $scope.positionModule);
				resultForm.salary = parseInt(resultForm.salary);
				//添加position-basic ajax提交数据
				if ($scope.job_id) {
					if (dirty) { //判断position是否修改过
						//修改joho
						johoService.changeJoho('position', {
							'job_id': $scope.job_id
						}, resultForm).then(function(data) {
							$scope.showError = false;
							$scope.refreshJohoDetail().then(function() { //刷新数据
								$scope.openEditModuleTag(''); //关闭编辑框
								$scope.refush();
							});
						});
					} else {
						//关闭编辑框
						$scope.openEditModuleTag('');
					}
				}
			}
		 }
		 	
	}]);
	
	//=================================教育模块编辑=================================
	recruiters.controllers.register('johoEducationController',['$scope','$filter','$state','johoService',
		function($scope,$filter,$state,johoService){
			//获取最原始的数据
			$scope.$watch('education',function(data){
				if( angular.isDefined(data) ){
					//处理大学多选问题
					if (data.hasOwnProperty('university_types')) {
						//通过对象获取数组
						//data['university_type_id'] = $filter('getArrayFromObject')(data['university_types'], "university_type_id");
						//将数组转换成angualrjs checkbox 对象
						//data['university_type_id'] = $filter('checkTranforms')(data['university_type_id'], 4);
						data['university_type_id'] = data['university_types'][0]['university_type_id'];
					}
					$scope.educationModule = angular.copy(data);
				}
			});
			
			//定义education experience,用于获取正确的提交数据
			var formDataStand = {                       
			    "university_type_id": [],
			    "edu_level_id": '',
			    "pref_edu_level_id": '',
			    "major":'',
			    "major2":'',
			    "major3":'',
			};
			//提交表单
			$scope.submitForm = function(){
				//克隆表单对象
				var pureData = angular.copy( $scope.educationModule );
				//修改大学的获取值
				
				
				//pureData.university_type_id = $filter('clearEmpty')(pureData.university_type_id);
				var obj = [];
				obj.push(pureData.university_type_id)
				pureData.university_type_id = obj;
				//获取科目id

				if( pureData.major != null && pureData.major.major2_id){
					pureData.major2 = pureData.major.major2_id;
				}
				if( pureData.major != null && pureData.major.major3_id){
					pureData.major3 = pureData.major.major3_id;
				}
				if( pureData.major != null ){
					pureData.major = pureData.major.major_id;
				}
				//规范化对象
				var resultForm = $filter('standardArr')(angular.copy(formDataStand),pureData);
				//修改joho的教育信息
		 		johoService.changeJoho('education',{'job_id':$scope.job_id},resultForm).then(function(data){
			 	 	$scope.showError = false;
			 	 	$scope.refreshJohoDetail().then(function(){//刷新数据
			 	 		$scope.openEditModuleTag('');//关闭编辑框
			 	 		$scope.refush();
			 	 	});
			 	});
			}
	}]);
	
	//=================================工作经验模块=================================
	recruiters.controllers.register('johoWorkExperienceController', ['$scope', '$filter', 'johoService','auxiliaryService',
		function($scope, $filter, johoService,auxiliaryService) {
			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data){
				$scope.industyList = data.industies;
				$scope.companyTypeList = data.company_types;
			});
			
			//获取最原始的数据
			$scope.$watch('work_experience',function(data){
				if( angular.isDefined(data) ){
					$scope.workExperienceModule = angular.copy(data);
				}
			});
			
			//定义education experience,用于获取正确的提交数据
			var formDataStand = {
				"industry_id": '',
				"company_type_id": '',
				"duration": '',
				"position_id": ''
			};
			
			//提交表单
			$scope.submitForm = function() {
				//克隆表单对象
				var pureData = angular.copy($scope.workExperienceModule);
				//规范化对象
				resultForm = $filter('standardArr')(angular.copy(formDataStand), pureData);
				//修改joho的工作经验
				johoService.changeJoho('work_experience', {
					'job_id': $scope.job_id
				}, resultForm).then(function(data) {
					$scope.showError = false;
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
					});
				});
			}
	
		}
	]);
	
	
	//=================================语言=================================
	recruiters.controllers.register('johoLanguagesController',['$scope','$filter','$state','johoService','auxiliaryService',
		function($scope,$filter,$state,johoService,auxiliaryService){
			//语言数组中的对象模版
			var objInArr = {
				'language_id':'',
				'language_level_id':"",
			};
			
			//获取最原始的数据
			$scope.$watch('languages',function(data){
				$scope.languagesModule = angular.copy(data);
				$scope.addLanguage();
			});
			
			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data){
				$scope.languagesList = data.languages;
				$scope.languageLevelsList = data.language_levels;
			});
			
			//删除一组数据
	       	$scope.removeLanguage = function( index ){
	       		$scope.languagesModule.splice( index,1 );
	       	}
	        //添加一组数据
	       	$scope.addLanguage = function(){
	       		$scope.languagesModule.push(angular.copy(objInArr));
	       	}
			
			/******edit****/
	        //定义language表单,用于获取正确的提交数据
		    var formDataStand = ['language_id','language_level_id'];
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.languagesModule);
			 	 
			 	 var able = true;
			 	 //判断数据是否合法，一旦填写了语言就必须填写熟练度，或添加了熟练度就必须添加语音
			 	 angular.forEach(formData,function(data){
			 	 	if( data.language_id && !data.language_level_id ){
			 	 		able = false;
			 	 	}else{
			 	 		if( !data.language_id && data.language_level_id ){
			 	 			able = false;
			 	 		}
			 	 	}
			 	 });
			 	 
			 	 if( able ){
			 	 	 //从对象数组中只获取需要的字段组成的数组
				 	 var resultForm = $filter('getArrayFromObject')(formData,formDataStand);
				 	 var resultForm = $filter('clearEmptyByFiled')(resultForm,'language_id');
			 	 	 //修改joho的工作经验
					 johoService.changeJoho('languages', {
						'job_id': $scope.job_id
					 }, resultForm).then(function(data) {
						$scope.showError = false;
						$scope.refreshJohoDetail().then(function() { //刷新数据
							$scope.openEditModuleTag(''); //关闭编辑框
							$scope.refush();
						});
					});
			 	 }
		 	}
	}]);
	
	
	//=================================技能=================================
	recruiters.controllers.register('johoSkillsController',['$scope','$filter','johoService','auxiliaryService',
		function($scope,$filter,johoService,auxiliaryService){
			//获取最原始的数据
			$scope.$watch('skills',function(data){
				$scope.skillsModule = angular.copy(data);
			});
			
			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data){
				$scope.skillsList = data.skills;
			});
			
	       	//添加技能选项卡
		 	$scope.addSkill = function(){
		 		$scope.showErrorRepeat = false;
		 		$scope.showErrorNone = false;
			 	if( $scope.select_value_skill||$scope.skill.skill_name){
			 		//判断是否已经存在
//		 			var hasValue = $filter('preSearchNameFilter')($scope.skillsModule,'skill_id',$scope.select_value_skill);
					var hasValue = $filter('preSearchNameFilter')($scope.skillsModule,'skill_name',$scope.skill.skill_name);

			 		var getValue = $filter('preSearchNameFilter')($scope.skillsList,'skill_id',$scope.select_value_skill);
		 			if( hasValue && !$scope.select_value_skill){
		 				$scope.showErrorRepeat = true;
		 			}else{
				 		if( ((!getValue)||!$scope.select_value_skill)||(getValue && $scope.skill.skill_name.length > getValue.skill_name.length)){
					 		var valueObject = {
					 			"skill_id" : 0,
					 			"skill_name" : $scope.skill.skill_name,
					 		};
					 		getValue = valueObject;
				 		}
		 				$scope.skillsModule.push(getValue);
		 				$scope.select_value_skill="";
		 			}
			 	}else{
			 		$scope.showErrorNone = true;
			 	}
			 }
		 	
		 	//删除一组数据
	       	$scope.removeSkill = function( index ){
	       		$scope.skillsModule.splice( index,1 );
	       	}
	       	
	       	/******edit****/
	        //定义language表单,用于获取正确的提交数据
		    var formDataStand = ['skill_id'];
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.skillsModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
			 	 var resultForm = $filter('getArrayFromObject')(formData,'skill_id');
			 	 var concatResultForm = resultForm.concat($filter('getArrayFromObjectExtended')(formData, 'skill_name','skill_id',""));
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('skills', {
					'job_id': $scope.job_id
				 }, concatResultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	}]);
	
	
	
	
	//=================================证书=================================
	recruiters.controllers.register('johoCertificationsController',['$scope','$filter','johoService','auxiliaryService',
		function($scope,$filter,johoService,auxiliaryService){
			//获取最原始的数据
			$scope.$watch('certificates',function(data){
				$scope.certificatesModule = angular.copy(data);
			});
			
			//定义常用变量
			auxiliaryService.getAuxiliaryInfo().then(function(data){
				$scope.certificatesList = data.certificates;
			});
			
	       	//添加技能选项卡
		 	$scope.addItem = function(){
		 		$scope.showErrorRepeat = false;
		 		$scope.showErrorNone = false;
			 	if( $scope.select_value_certificate ){
			 		//判断是否已经存在
		 			var hasValue = $filter('preSearchNameFilter')($scope.certificatesModule,'certificate_id',$scope.select_value_certificate);

			 		var getValue = $filter('preSearchNameFilter')($scope.certificatesList,'certificate_id',$scope.select_value_certificate);
			 		if( hasValue ){
		 				$scope.showErrorRepeat = true;
		 			}else{
		 				$scope.certificatesModule.push(getValue);
		 				$scope.select_value_certificate="";
		 			}
			 	}else{
			 		$scope.showErrorNone = true;
			 	}
			 }
		 	
		 	//删除一组数据
	       	$scope.removeItem = function( index ){
	       		$scope.certificatesModule.splice( index,1 );
	       	}
	       	
	       	/******edit****/
	        //定义language表单,用于获取正确的提交数据
		    var formDataStand = ['certificate_id'];
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.certificatesModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
			 	 var resultForm = $filter('getArrayFromObject')(formData,'certificate_id');
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('certificates', {
					'job_id': $scope.job_id
				 }, resultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	}]);
	
	//=================================动机==================================
	recruiters.controllers.register('johoMotivationController',['$scope','$filter','johoService','psychologyService',
		function($scope,$filter,johoService,psychologyService){
			//获取最原始的数据
			$scope.$watch('motivation',function(data){
				$scope.motivationModule = angular.copy(data);
			});
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.motivationsList = data.motivations;
				$scope.motivationItmesList = data.motivation_itmes;
				$scope.motivationModule = $filter('selectObjFromObjArr')($scope.motivationsList,'motivation_id',$scope.motivationModule.motivation_id);
			});
			
			/******edit****/
	        //数据规范化
		    var formDataStand = {
		    	'motivation_id':null,
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.motivationModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
		 	 	 var resultForm = {};
		 	 	 if( formData ){
		 	 	 	 resultForm = $filter('standardArr')(angular.copy(formDataStand),formData);
		 	 	 }else{
		 	 	 	resultForm.motivation_id = null;
		 	 	 }
			 	
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('motivation', {
					'job_id': $scope.job_id
				 }, resultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
			
	}]);
	
	//=================================价值观==================================
	recruiters.controllers.register('johoValueController',['$scope','$filter','johoService','psychologyService',
		function($scope,$filter,johoService,psychologyService){
			
			//获取最原始的数据
			$scope.$watch('value',function(data){
				$scope.valueModule = angular.copy(data);
				$scope.value_id = data.value_id;
			});
			
			$scope.selectValue = function(){
				if( $scope.value_id ){
					$scope.valueModule = $filter('selectObjFromObjArr')(angular.copy($scope.valuesList), 'value_id', $scope.value_id );
				}else{
					$scope.valueModule = null;
				}
			}
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.valuesList = data.values;
			});
			
			//将价值观的拖动值和标准值合并
			var createTrueValue = function(value_name) {
				var valueStand = $filter('selectObjFromObjArr')(angular.copy($scope.valuesList), 'value_id', value_name);
				if (valueStand) {
					valueStand.flexible_value = Math.round($scope.valueModule.flexible_value);
					valueStand.structure_value = Math.round($scope.valueModule.structure_value);
					valueStand.performance_value = Math.round($scope.valueModule.performance_value);
					valueStand.relationship_value =Math.round( $scope.valueModule.relationship_value);
				}
				$scope.valueModule = valueStand;
				$scope.value_id = valueStand.value_id;
			}
			
			//根据拖动的值获取价值观的值
			$scope.getMotivationValue = function() {
				//灵活 - 结构 
				var x = $scope.valueModule.flexible_value - $scope.valueModule.structure_value;
				//绩效 - 关系 
				var y = $scope.valueModule.performance_value - $scope.valueModule.relationship_value;
				if (x > 1 && y > 1) {
					//creater
					createTrueValue(1);
				} else if (x > 1 && y < -1) {
					//Family Member
					createTrueValue(2);
				} else if (x < -1 && y > 1) {
					//performance pursuit
					createTrueValue(3);
				} else if (x < -1 && y < -1) {
					//contoller
					createTrueValue(4);
				} else {
					//uncertainty
					createTrueValue(5);
				}
			}
			
		    /******edit****/
	        //数据规范化
		    var formDataStand = {
		    	"value_id":0,
			   	"flexible_value": 0,
			   	"performance_value": 0,
			   	"relationship_value": 0,
			   	"structure_value": 0
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.valueModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
		 	 	 var resultForm = {};
		 	 	 if( formData ){
		 	 	 	 resultForm.value = $filter('standardArr')(angular.copy(formDataStand),formData);
		 	 	 }else{
		 	 	 	 resultForm.value = null;
		 	 	 }
			 	
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('value', {
					'job_id': $scope.job_id
				 }, resultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
			
	}]);
	
	//=================================iq==================================
	recruiters.controllers.register('johoIQController',['$scope','$filter','johoService','psychologyService',
		function($scope,$filter,johoService,psychologyService){
			
			//获取最原始的数据
			$scope.$watch('IQ',function(data){
				$scope.IQModule = angular.copy(data);
				if( !$scope.IQModule.iq_value ){
					$scope.IQModule.iq_value = null;
				}
			});
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.iqsList = data.iqs;
			});
			
			//设定iq
			$scope.setIqValue = function(valid){
				if(valid&&$scope.IQModule.iq_value){
					var iqValue = $scope.IQModule.iq_value;
				 	if( iqValue < 100  ){
				 		var i = 1;
				 	}else if( iqValue >= 100 && iqValue < 110 ){
				 		var i = 2;
				 	}else if( iqValue >= 110 && iqValue < 120 ){
				 		var i = 3;
				 	}else if( iqValue >= 120 && iqValue < 130 ){
				 		var i = 4;
				 	}else if( iqValue >= 130 ){
				 		var i = 5;
				 	}
				 	var getIqValue = $filter('selectObjFromObjArr')( angular.copy($scope.iqsList ),'iq_id',i);
				 	getIqValue.iq_value = iqValue;
				 	$scope.IQModule = getIqValue;
				}
			 }
			
			/******edit****/
	        //数据规范化
		    var formDataStand = {
		    	"iq_value": null,
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(valid){
	       		//通过验证
	       		if( valid ){
				 	 //获取输入的值
				 	 var formData = angular.copy($scope.IQModule);
			 	 	 //从对象数组中只获取需要的字段组成的数组
			 	 	 var resultForm = $filter('standardArr')(angular.copy(formDataStand),formData);
			 	 	 //修改joho的工作经验
					 johoService.changeJoho('iq', {
						'job_id': $scope.job_id
					 }, resultForm).then(function(data) {
						$scope.refreshJohoDetail().then(function() { //刷新数据
							$scope.openEditModuleTag(''); //关闭编辑框
							$scope.refush(); //更新页面展示
						});
					});
				}
		 	}
	}]);
	
	//=================================思维模式==================================
	recruiters.controllers.register('johoThinkingPatternController',['$scope','$filter','johoService','psychologyService',
		function($scope,$filter,johoService,psychologyService){
			
			//获取最原始的数据
			$scope.$watch('thinking_pattern',function(data){
				$scope.thinkingPatternModule = angular.copy(data);
				$scope.thinking_pattern_id = data.thinking_pattern_id;
			});
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.thinkingPatternsList = data.thinking_patterns;
			});
			
			$scope.selectItem = function(){
				if( $scope.thinking_pattern_id ){
					$scope.thinkingPatternModule = $filter('selectObjFromObjArr')(angular.copy($scope.thinkingPatternsList), 'thinking_pattern_id', $scope.thinking_pattern_id );
				}else{
					$scope.thinkingPatternModule = null;
				}
			}
			
			/******edit****/
	        //数据规范化
		    var formDataStand = {
		    	"thinking_pattern_id":null,
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.thinkingPatternModule);
			 	 //从对象数组中只获取需要的字段组成的数组
		 	 	 var resultForm = {};
		 	 	 if( formData ){
		 	 	 	 resultForm.thinking_pattern = $filter('standardArr')(angular.copy(formDataStand),formData);
		 	 	 }else{
		 	 	 	 resultForm.thinking_pattern = null;
		 	 	 }
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('thinking_pattern', {
					'job_id': $scope.job_id
				 }, resultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	}]);
	
	
	//==========================行为倾向==================================
	recruiters.controllers.register('johoBehaviourStyleController', ['$scope','$filter','johoService','psychologyService',
		function($scope,$filter,johoService,psychologyService){
			//获取最原始的数据
			$scope.$watch('behavior_style',function(data){
				$scope.behaviourStyleModule = angular.copy(data);
				$scope.select_id = data.behavior_style_id;
			});
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.behaviorStylesList = data.behavior_styles;
			});
			
			//选中不同的内容
			$scope.selectItem = function(){
				if( $scope.select_id ){
					$scope.behaviourStyleModule = $filter('selectObjFromObjArr')(angular.copy($scope.behaviorStylesList), 'behavior_style_id', $scope.select_id );
				}else{
					$scope.behaviourStyleModule = null;
				}
			}
			
			//根据维度获取行为模式
		 	var changeBehaviorStyle = function( t ){
			 	var switchBehaviorStyle = function( index ){
			 		var valueStand = $filter('selectObjFromObjArr')( angular.copy($scope.behaviorStylesList ),'behavior_style_id',index);
			 		if( valueStand ){
				 		valueStand.roles_in_a_team      = $scope.behaviourStyleModule.roles_in_a_team;
				 		valueStand.mind_distance        = $scope.behaviourStyleModule.mind_distance;
				 		valueStand.working_orientation  = $scope.behaviourStyleModule.working_orientation;
				 		valueStand.working_result       = $scope.behaviourStyleModule.working_result;
		 			}
			 		$scope.behaviourStyleModule = valueStand;
			 	}
			 	switch( t.toString() ){
			 		case [1,0,0,0].toString():switchBehaviorStyle(1);break;
			 		case [1,0,1,1].toString():switchBehaviorStyle(2);break;
			 		case [1,0,0,1].toString():switchBehaviorStyle(3);break;
			 		case [1,0,1,0].toString():switchBehaviorStyle(4);break;
			 		case [0,1,0,0].toString():switchBehaviorStyle(5);break;
			 		case [0,1,1,1].toString():switchBehaviorStyle(6);break;
			 		case [0,1,0,1].toString():switchBehaviorStyle(7);break;
			 		case [0,1,1,0].toString():switchBehaviorStyle(8);break;
			 		case [1,1,0,0].toString():switchBehaviorStyle(9);break;
			 		case [1,1,1,1].toString():switchBehaviorStyle(10);break;
			 		case [1,1,0,1].toString():switchBehaviorStyle(11);break;
			 		case [1,1,1,0].toString():switchBehaviorStyle(12);break;
			 		case [0,0,0,0].toString():switchBehaviorStyle(13);break;
			 		case [0,0,1,1].toString():switchBehaviorStyle(14);break;
			 		case [0,0,0,1].toString():switchBehaviorStyle(15);break;
			 		case [0,0,1,0].toString():switchBehaviorStyle(16);break;
			 	}
			 }
			 
			 $scope.getBehaviorStyleValue = function(){
			 	//获取主要行为模式
			 	var t =[];
			 	//对外界评估
			 	if( ($scope.behaviourStyleModule.roles_in_a_team == 5.5) 
			 		&& ($scope.behaviourStyleModule.mind_distance == 5.5)
			 		&& ($scope.behaviourStyleModule.working_orientation == 5.5) 
			 		&& ($scope.behaviourStyleModule.working_result == 5.5) ){
			 		$scope.behaviourStyleModule.behavior_style_name = "";
			 		$scope.behaviourStyleModule.behavior_style_id = "";
			 		$scope.behaviourStyleModule.behavior_style_picture = "";
			 	}else{
			 		//团队角色
			 		if( $scope.behaviourStyleModule.roles_in_a_team >= 5.5 ){
			 			t1 = 1; 
			 		}else{
			 			t1 = 0;
			 		}
			 		t.push(t1);
			 		//人纪距离
			 		if( $scope.behaviourStyleModule.mind_distance >= 5.5 ){
			 			t2 = 1; 
			 		}else{
			 			t2 = 0;
			 		}
			 		t.push(t2);
			 		//工作导向
			 		if( $scope.behaviourStyleModule.working_orientation >= 5.5 ){
			 			t3 = 1; 
			 		}else{
			 			t3 = 0;
			 		}
			 		t.push(t3);
			 		//工作结果
			 		if( $scope.behaviourStyleModule.working_result >= 5.5 ){
			 			t4 = 1; 
			 		}else{
			 			t4 = 0;
			 		}
			 		t.push(t4);
			 		//改变值
			 		changeBehaviorStyle( t );
			 	}
			 }
			
			
		    /******edit****/
	        //数据规范化
		    var formDataStand = {
		    	"behavior_style_id":null,
		   		"roles_in_a_team": 5,
		   		"mind_distance": 5,
		   		"working_orientation": 5,
		   		"working_result": 5,
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.behaviourStyleModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
		 	 	 var resultForm = {};
		 	 	 if( formData ){
		 	 	 	 resultForm.behavior_style = $filter('standardArr')(angular.copy(formDataStand),formData);
		 	 	 }else{
		 	 	 	 resultForm.behavior_style = null;
		 	 	 }
			 	
		 	 	 //修改joho的工作经验
				 johoService.changeJoho('behavior_style', {
					'job_id': $scope.job_id
				 }, resultForm).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	
	}]);
	
	
	//==========================eq==================================
	recruiters.controllers.register('johoEQController', ['$scope','$filter','$state','johoService','psychologyService',
		function($scope,$filter,$state,johoService,psychologyService){
			//获取最原始的数据	
			$scope.$watch('EQ', function(data) {
				$scope.EQModule = angular.copy(data);
				if (!$scope.EQModule.eq_value) {
					$scope.EQModule.eq_value = null;
				}
			});
			
			//定义常用变量
			psychologyService.getPsychologyInfo().then(function(data){
				$scope.eqsList = data.eqs;
			});
		 
			//设定eq
			$scope.setEqValue = function(valid) {
				if( valid && $scope.EQModule.eq_value ){
					var iqValue = $scope.EQModule.eq_value;
					if (iqValue < 100) {
						var i = 1;
					} else if (iqValue >= 100 && iqValue < 110) {
						var i = 2;
					} else if (iqValue >= 110 && iqValue < 120) {
						var i = 3;
					} else if (iqValue >= 120 && iqValue < 130) {
						var i = 4;
					} else if (iqValue >= 130) {
						var i = 5;
					}
					var getEqValue = $filter('selectObjFromObjArr')(angular.copy($scope.eqsList), 'eq_id', i);
					getEqValue.eq_value = iqValue;
					$scope.EQModule = getEqValue;
				}
			}
		 
			
			/******edit****/
	        //数据规范化
		    var formDataStand = {
		    	"eq_value": null,
		    }
			//提交基础信息表单
	       	$scope.submitForm = function(valid){
	       		//通过验证
	       		if( valid ){
				 	 //获取输入的值
				 	 var formData = angular.copy($scope.EQModule);
			 	 	 //从对象数组中只获取需要的字段组成的数组
			 	 	 var resultForm = $filter('standardArr')(angular.copy(formDataStand),formData);
			 	 	 //修改joho的工作经验
					 johoService.changeJoho('eq', {
						'job_id': $scope.job_id
					 }, resultForm).then(function(data) {
						$scope.refreshJohoDetail().then(function() { //刷新数据
							$scope.openEditModuleTag(''); //关闭编辑框
							$scope.refush(); //更新页面展示
						});
					});
				}
		 	}
		 
		 
		 
		 
		 
	}]);
	
	
	//============================面试问题===============================
	recruiters.controllers.register('johoInterviewQuestionsController',['$scope','$filter','$state','johoService',
		function($scope,$filter,$state,johoService){
			
			//获取最原始的数据
			$scope.$watch('interview_questions',function(data){
				$scope.interviewQuestionsModule = [];
				//补全默认的三道面试问题
				if( data.length>3 ){
					for( var i=0;i<data.length;i++ ){
						var obj={};
						obj.key=i;
						obj.question = data[i]['joho_interviewer_question'];
						obj.duration = data[i]['duration'];
						$scope.interviewQuestionsModule.push(obj);
					}
				}else{
					for( var i=0;i<3;i++ ){
						var obj={};
						obj.key=i;
						if( $filter('isEmptyFilter')(data[i]) ){
							obj.question = "";
							obj.duration = 1;
						}else{
							obj.question = data[i]['joho_interviewer_question'];
							obj.duration = data[i]['duration'];
						}
						$scope.interviewQuestionsModule.push(obj);
					}
				}
			});
			
			//添加新问题
	   		$scope.addNewQuestion =function(){
	   			var length = $scope.interviewQuestionsModule.length;
				if( length<10 ){
					var obj={};
					obj.key=length;
					obj.question = "";
					obj.duration = 1;
					$scope.interviewQuestionsModule.push(obj);
		        }else{
		        	alert("最大输入10个问题");
		        }
	   		};
	   		
	   		/******edit****/
	        //数据规范化
		    var formDataStand = ["question","duration"];
			//提交基础信息表单
	       	$scope.submitForm = function(){
			 	//获取输入的值
			 	var formData = angular.copy($scope.interviewQuestionsModule);
			 	 
			 	var resultForm = $filter('getArrayFromObject')(formData,formDataStand);
				resultForm = $filter('clearEmptyByFiled')(resultForm,'question');
		 	 	//从对象数组中只获取需要的字段组成的数组
		 	 	var getData = {};
				getData.questions = resultForm;
				johoService.changeJoho('interview_question', {
					'job_id': $scope.job_id
				}, getData).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	   		
	}]);
	
	
	//==========================类别重要性================================
	recruiters.controllers.register('johoCategoryImportanceController',['$scope','$filter','$state','johoService','$timeout',
		function($scope,$filter,$state,johoService,$timeout){
			//获取最原始的数据
			$scope.$watch('category_importance',function(data){
				$scope.categoryImportanceModule = angular.copy(data);
			});
			
			//类别重要性选中按钮
	     	$scope.SelectImportant = function(data){
	     		var getSelectNumber = function(){
	     			var num=0;
	     			for( var key in $scope.categoryImportanceModule ){
	     				if( $scope.categoryImportanceModule[key] == 2 ){
	     					num++;
	     				}
	     			}
	     			return num;
	     		}
				if( $scope.categoryImportanceModule[data] != 2 ){
					//判断是否已经大于3个了
					if( getSelectNumber()>=3 ){
						$scope.categoryImportanceModule_notice = true;
						$timeout(function(){
							$scope.categoryImportanceModule_notice = false;
						},1000);
					}else{
						$scope.categoryImportanceModule[data] = 2;
					}
				}else{
					$scope.categoryImportanceModule[data] = 1;
				}
	     	}
	     	
	     	/******edit****/
	        //数据规范化
		    var formDataStand = {
   				    "basic_information": 1,
       				"education_work_experience": 1,
       				"languages_certificates_skills": 1,
       				"motivation_value": 1,
       				"thinking_pattern_iq": 1,
       				"behavior_pattern_eq": 1
		    }
	     	//提交基础信息表单
	       	$scope.submitForm = function(){
			 	 //获取输入的值
			 	 var formData = angular.copy($scope.categoryImportanceModule);
		 	 	 //从对象数组中只获取需要的字段组成的数组
		 	 	 var pureData ={};
				 pureData.category_importance = $filter('standardArr')(angular.copy(formDataStand),formData);
			 	
				 johoService.changeJoho('category_importance', {
					'job_id': $scope.job_id
				 }, pureData).then(function(data) {
					$scope.refreshJohoDetail().then(function() { //刷新数据
						$scope.openEditModuleTag(''); //关闭编辑框
						$scope.refush(); //更新页面展示
					});
				});
		 	}
	     	
	}]);
	
	<!--andy-->
	//==========================邀请用户================================
	recruiters.controllers.register('recrInviteUserController',['$scope', '$filter', '$rootScope', '$stateParams', 'johoService', 'openFileLayout',
	function($scope,$filter,$rootScope,$stateParams,johoService,openFileLayout){
		//是否验证
		$scope.proving = false;

		$scope.timeList = [{
			"key": 3
		}, {
			"key": 2
		}, {
			"key": 1
		}, ];

		//生成所需要的scope 通过router里面定义的主controller定义全局变量
		$scope.inviteUser = {};
		$scope.inviteUser.recName = $scope.userInfo.business_user_name;
		$scope.inviteUser.recPosition = $scope.userInfo.business_user_position;
		$scope.inviteUser.johoName = $scope.johoModule.johoInfo.position.joho_name;
		$scope.inviteUser.questionsBank = $scope.johoModule.johoInfo.interview_questions;
		$scope.inviteUser.company = $scope.johoModule.johoInfo.company.company_name;

		$scope.inviteUser.message = "";
		$scope.inviteUser.questions = [];
		//设置默认值
		$scope.inviteUser.interviewMessage = "您好，" + $scope.inviteUser.company + $scope.inviteUser.recName + "就“" + $scope.inviteUser.johoName + "”一职。邀请您完成视频面试。";
		$scope.inviteUser.userTestMessage = "您好，" + $scope.inviteUser.company + $scope.inviteUser.recName + "就“" + $scope.inviteUser.johoName + "”一职。邀请您完成心理学测试。";
		$scope.inviteUser.bothMessage = "您好，" + $scope.inviteUser.company + $scope.inviteUser.recName + "就“" + $scope.inviteUser.johoName + "”一职。邀请您完成视频面试和心理学测试。";
		
		$scope.inviteUser.message = $scope.inviteUser.userTestMessage;
		var obj = {};
		obj.value = "";
		obj.type = "select";
		$scope.inviteUser.questions.push(angular.copy(obj));
		$scope.inviteUser.duration = 3
			//设定公共方法
			//添加
		$scope.add = function() {
				if ($scope.inviteUser.questions.length >= 3) {
					alert("问题最多能输入3个！");
				} else {
					$scope.inviteUser.questions.push(angular.copy(obj));
				}
			}
			//删除
		$scope.del = function(index) {
				if ($scope.inviteUser.questions.length <= 1) {
					alert("至少保留一个问题！");
				} else {
					$scope.inviteUser.questions.splice(index, 1);
				}
			}
			//自定义输入
		$scope.pen = function(index) {
				$scope.inviteUser.questions[index].value = "";
				$scope.inviteUser.questions[index].type = "pen";
			}
			//选择输入
		$scope.select = function(index) {
				$scope.inviteUser.questions[index].value = "";
				$scope.inviteUser.questions[index].type = "select";
			}
			//表单上传
		$scope.submitForm = function(valid) {
				$scope.proving = true;
				//对问题进行处理
				var questions = angular.copy($scope.inviteUser.questions);
				questions = $filter('clearEmptyByFiled')(questions, 'value');
				questions = $filter('getArrayFromObject')(questions, 'value');
				
				//通过验证
				if (valid) {
					if(!$scope.inviteUser.userName || $scope.inviteUser.userName.length <= 0){
						alert("请填写邀请候选人的邮箱或者手机号！");
						return;
					}
					if(!$scope.inviteUser.last_time){
						alert("邀请有效时间不能为空！");
						return;
					}
					if(!$scope.inviteUser.message && $scope.inviteUser.message.length <= 0){
						alert("邀请信息不能为空");
						return;
					}
					if($scope.showInteview == true){
						if (questions.length <= 0) {
							alert("至少添加一个问题！")
						} else {
							var resultForm = {};
							resultForm.message = $scope.inviteUser.message;
							resultForm.questions = questions;
							resultForm.duration = $scope.inviteUser.duration;
							resultForm.job_id = $stateParams.job_id;
							if($scope.showTest == true){
								resultForm.invite_type = 1000;
							}else{
								resultForm.invite_type = 1001;
							}
							resultForm.mobile_email = $scope.inviteUser.userName;
							resultForm.last_time = $scope.inviteUser.last_time;
							
							//修改joho的工作经验
							johoService.businessInviteUser(resultForm).then(function(data) {
								if(data && data.isError == "true"){
									alert(data.message);
								}else{
									openFileLayout.closeDialog('invite_user.html');
									//展示提示
									openFileLayout.openDialog({
										"template": "notice_dialog.html",
										"maskLayer": false,
										"content": "发送成功！",
									});
								}
							});
						}
					}else if($scope.showTest == true){
						if(!$scope.inviteUser.userName || $scope.inviteUser.userName.length <= 0){
							alert("请填写邀请候选人的邮箱或者手机号！");
						}else if(!$scope.inviteUser.last_time){
							alert("邀请时间不能为空！");
						}else{
							var resultForm = {};
							resultForm.mobile_email = $scope.inviteUser.userName;
							resultForm.job_id = $stateParams.job_id;
							resultForm.last_time =  $scope.inviteUser.last_time;
							resultForm.message = $scope.inviteUser.message;
							resultForm.invite_type = 1002;
//							$scope.inculdeHtml.loading = true;
							johoService.businessInviteUser(resultForm).then(function(data){
//								$scope.inculdeHtml.loading = false;
								if(data && data.isError == "true"){
									alert(data.message);
								}else{
									openFileLayout.closeDialog('invite_user.html');
									//展示提示
									openFileLayout.openDialog({
										"template": "notice_dialog.html",
										"maskLayer": false,
										"content": "发送成功！",
									});
								}
							})
						}
					}
				}
			}
			//关闭弹出框
		$scope.closeDialog = function() {
			openFileLayout.closeDialog('invite_user.html');
		}
		
		$scope.showTest = false;
		$scope.showInteview = false;
		$scope.changeTestStatus = function(){
			$scope.showTest = !$scope.showTest;
			if($scope.showInteview){
				$scope.inviteUser.message = $scope.inviteUser.interviewMessage;
				if($scope.showTest){
					$scope.inviteUser.message = $scope.inviteUser.bothMessage;
				}
			}else{
				$scope.inviteUser.message = $scope.inviteUser.userTestMessage;
			}
		}
		$scope.changeShowStatus = function(){
			$scope.showInteview = !$scope.showInteview;
			if($scope.showInteview){
				$scope.inviteUser.message = $scope.inviteUser.interviewMessage;
				if($scope.showTest){
					$scope.inviteUser.message = $scope.inviteUser.bothMessage;
				}
			}else{
				$scope.inviteUser.message = $scope.inviteUser.userTestMessage;
			}
		}
		$scope.usernameError = "";
		$scope.$watch("inviteUser.userName",function(){
			var reg=new RegExp("；","g"); //创建正则RegExp对象
			var regUserName = /^(1[3|4|5|7|8][0-9]\d{8})$|^(1[3|4|5|7|8][0-9]\d{8};)+$|^([^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+;)+$|^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)$/;
//			var regUserNameNext =/^((1[3|4|5|7|8][0-9]\d{8})|[^@\s]+@[^@\.\s]+(\.[^@\.\s]+))(;((1[3|4|5|7|8][0-9]\d{8})|[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)))*$/;
			var oldString = $scope.inviteUser.userName;
			if(oldString){
				$scope.inviteUser.userName = oldString.replace(reg,";");
				if(!$scope.inviteUser.userName){
					$scope.usernameError = "请填写正确的邀请人的邮箱或者手机号";
				}else if(!regUserName.test($scope.inviteUser.userName)){
					$scope.usernameError = "请用分号分隔！";
				}else{
					$scope.usernameError = "";
				}
			}
		})
	}
	]);
	
});
