/**
 * 加载招聘者-joho管理
 */
define(['recruitersModule'],function(recruiters){
	/*********************事件中心管理主模块*****************************/
	recruiters.controllers.register('eventCenterController',['$scope','$state',
		function($scope,$state){
			//添加相关页面
			$scope.inculdeHtml = {}
			$scope.inculdeHtml.rightHtml = "";
			$scope.inculdeHtml.searchHtml = "";
			$scope.inculdeHtml.loading = true;
		}
	]);
	
	/*********************事件中心-事件列表*****************************/
	recruiters.controllers.register('eventCenterListController',['$scope','$state','johoService','$stateParams',
		function($scope,$state,johoService,$stateParams){
			$scope.inculdeHtml.loading = true;
			johoService.getEventCenterList().then(function(data){
				$scope.inculdeHtml.loading = false;
				$scope.eventList = data.JoHos;
				$scope.now = new Date();
				$scope.pageNumber = $stateParams.pageNumber;
		 		$scope.pageCount = data.pageCount;
			});
		}
	]);
	
	/*********************事件中心-事件详情*****************************/
	recruiters.controllers.register('eventCenterDetailController',['$scope','openFileLayout','johoService','$filter','$q','$stateParams','$timeout',
		function($scope,openFileLayout,johoService,$filter,$q,$stateParams,$timeout){
			$scope.job_id = $stateParams.job_id;
			$scope.inculdeHtml.loading = true;
			//获取指定joho的内容
			var promise1 = johoService.getJohoDetail().then(function(data){
				$scope.johoInfo = data;
			});
			//获取视频相关信息
/*			var promise2 = johoService.getInterviewList().then(function(data){
				$scope.eventList = data;
			});*/
			var promise2 = getInterviewListByPager;
			//全部加载完成后关闭加载提示
			$q.all([promise1,promise2]).then(function(){
				$scope.inculdeHtml.loading = false;
			});
			
			//监听获取视频路径并加载load
			$scope.$watch('eventList',function(data){
				$scope.video_show = false;
				if( data ){
					$timeout(function(){
						var video_id = document.getElementsByClassName("video_id");
						angular.forEach(video_id,function(element){
							element.load();
							element.setAttribute('controls','controls');
						});
						$scope.video_show = true;
					},500);
				}
			});
			
			var newScope = $scope.$new();
			//点击视频，弹出视频层进行播放
			$scope.showInterview = function( info ){
				newScope.info = info;
				//打开弹出层
				openFileLayout.openDialog({
					"template":"show_interview.html",
					"scope":newScope,
					"position":"absolute",
				});
				//修改视频的面试状态
				johoService.changeInterviewStatus(info.video_id);
				info.is_read =1;
			}
			//点开评论
			$scope.openComment = function(info){
				if( angular.isUndefined(info.showComment) ){
					info.showComment = 0;
					//加载评论
					johoService.getCommentsByInterviewId(info.video_id).then(function(data){
						$timeout(function(){
							info.showComment = true;
							info.comments = data;
						},200);
					});
				}else{
					info.showComment = !info.showComment;
				}
			}
			
			var getInterviewListByPager = function () {
				
				var postData = {
	                pageIndex: $scope.paginationConf.currentPage==0?1:$scope.paginationConf.currentPage,
	                pageSize: $scope.paginationConf.itemsPerPage
            	};
            	
            	johoService.getInterviewListByPager($scope.job_id,postData.pageSize,postData.pageIndex).then(function(data){
					$scope.eventList = data.video_list;
					$scope.paginationConf.totalItems = data.pageCount * postData.pageSize;
				}); 
				
				
			};
			//配置分页基本参数
	        $scope.paginationConf = {
	            currentPage: 1,
	            itemsPerPage: 5,
	        };
	
	        /***************************************************************
		        当页码和页面记录数发生变化时监控后台查询
		        如果把currentPage和itemsPerPage分开监控的话则会触发两次后台事件。 
	        ***************************************************************/
	        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getInterviewListByPager);
		}
	]);
	
	
	
	/*********************事件中心-面试视频播放*************************/
	recruiters.controllers.register('showInterview', ['$scope', 'openFileLayout', 'johoService', '$filter', '$q', '$stateParams', '$timeout',
		function($scope, openFileLayout, johoService, $filter, $q, $stateParams, $timeout) {
			$scope.setting = {};
			$scope.setting.showComment = false;
			var count = 1;
			$scope.main = function() {
				var video = videojs(document.getElementById('video_id'), {
					techOrder: ["html5", "flash"],
					children: {
						textTrackDisplay: false,
						posterImage: false,
						errorDisplay: false,
						controlBar: {
							captionsButton: false,
							chaptersButton: false,
							subtitlesButton: false,
							liveDisplay: false,
							playbackRateMenuButton: false
						}
					}
				}, function() {});
				video.play();
				video.on("pause", function() {
					//判断视频是否是正在播放阶段
					if (!video.scrubbing) {
						$scope.$apply(function() {
							$scope.setting.showComment = true;
						});
					}
				});

				video.on("playing", function() {
					if ($scope.setting.showComment)
						$scope.$apply(function() {
							$scope.setting.showComment = false;
						});
				});

				var h = document.getElementById('h');
				var timu = document.getElementById('timu');
				var n = document.getElementById('n');
				var p = document.getElementById('p');
				var data = JSON.parse(h.value);
				var len = data.interview_question.length;

				video.on("timeupdate", function() {
					if (!(data.time_point == undefined)) {
						var currentTime = video.currentTime();
						if (len == 2) {
							if (currentTime <= data.time_point[0]) {
								count = 1;
								var question = "题目" + count + "： " + data.interview_question[0].question;
								timu.innerText = question;
							} else if (currentTime < data.time_point[1]) {
								count = 2;
								var question = "题目" + count + "： " + data.interview_question[1].question;
								timu.innerText = question;
							}
						} else if (len == 3) {
							if (currentTime <= data.time_point[0]) {
								count = 1;
								var question = "题目" + count + "： " + data.interview_question[0].question;
								//console.log("000000");
								timu.innerText = question;
							} else if (currentTime <= data.time_point[1]) {
								count = 2;
								var question = "题目" + count + "： " + data.interview_question[1].question;
								//console.log("1111111111");
								timu.innerText = question;
							} else if (currentTime < data.time_point[2]) {
								count = 3;
								var question = "题目" + count + "： " + data.interview_question[2].question;
								//console.log("22222222");
								timu.innerText = question;
							}
						}
						if (len != 1) {
							if (count == 1) {
								p.setAttribute("disabled", "disabled");
								p.style.backgroundColor = "#CDCDCD";
								n.style.backgroundColor = "#e24f00";
								if (n.hasAttribute("disabled")) {
									n.removeAttribute("disabled");
								}
							} else if (count == len) {
								n.style.backgroundColor = "#CDCDCD";
								p.style.backgroundColor = "#e24f00";
								n.setAttribute("disabled", "disabled");
								if (p.hasAttribute("disabled")) {
									p.removeAttribute("disabled");
								}
							} else if (count == 2) {
								n.style.backgroundColor = "#e24f00";
								p.style.backgroundColor = "#e24f00";
								if (p.hasAttribute("disabled")) {
									p.removeAttribute("disabled");
								}
								if (n.hasAttribute("disabled")) {
									n.removeAttribute("disabled");
								}
							}
						} else {

						}
					}

				});

			}

			$timeout(function() {
				$scope.main();
				var timu = document.getElementById('timu');
				var h = document.getElementById('h');
				var data = JSON.parse(h.value);
				var len = data.interview_question.length
				var question = "题目" + count + "： " + data.interview_question[count - 1].question;
				timu.innerText = question;
				var n = document.getElementById('n');
				var video = videojs('video_id');
				var currentTime = video.currentTime();
				if (data.time_point == undefined) {
				    n.remove();
					p.remove();
					var con="题目:\n";
					for(var i=0;i<len;i++){
							con+="第"+(i+1)+"题:"+data.interview_question[i].question+"\n";
					}
					timu.innerText = con;
				}
				if (len == 1) {
					n.style.backgroundColor = "#CDCDCD";
					n.setAttribute("disabled", "disabled");
				}

			}, 0);

			//关闭弹出框
			$scope.closeDialog = function() {
				openFileLayout.closeDialog("show_interview.html");
			}

			$scope.previous = function() {
				var n = document.getElementById('n');
				var p = document.getElementById('p');
				var video = videojs('video_id');
				var h = document.getElementById('h');
				var timu = document.getElementById('timu');
				var data = JSON.parse(h.value);
				var question = "题目" + count + "： " + data.interview_question[count - 1].question;
				timu.innerText = question;
				count--;
				if (count == 1) {
					video.currentTime(0);
					p.setAttribute("disabled", "disabled");
					p.style.backgroundColor = "#CDCDCD";
					n.style.backgroundColor = "#e24f00";
					if (n.hasAttribute("disabled")) {
						n.removeAttribute("disabled");
					}
				} else {
					video.currentTime(data.time_point[count - 2] + 1);

					n.style.backgroundColor = "#e24f00";
					p.style.backgroundColor = "#e24f00";
					if (p.hasAttribute("disabled")) {
						p.removeAttribute("disabled");
					}
					if (n.hasAttribute("disabled")) {
						n.removeAttribute("disabled");
					}
				}

			}
			$scope.next = function() {
				var n = document.getElementById('n');
				var p = document.getElementById('p');
				var timu = document.getElementById('timu');
				var video = videojs('video_id');
				count++;
				var h = document.getElementById('h');
				var data = JSON.parse(h.value)
				var len = data.interview_question.length;
				var question = "题目" + count + "： " + data.interview_question[count - 1].question;
				timu.innerText = question;
				video.currentTime(data.time_point[count - 2] + 1);

				if (count == len) {
					n.style.backgroundColor = "#CDCDCD";
					p.style.backgroundColor = "#e24f00";
					n.setAttribute("disabled", "disabled");
					if (p.hasAttribute("disabled")) {
						p.removeAttribute("disabled");
					}
				} else {
					n.style.backgroundColor = "#e24f00";
					p.style.backgroundColor = "#e24f00";
					if (p.hasAttribute("disabled")) {
						p.removeAttribute("disabled");
					}
					if (n.hasAttribute("disabled")) {
						n.removeAttribute("disabled");
					}
				}
			}

		}
	]);
});
