/**
 * 上传图片插件
 */
define([
	'candidatesModule',
	], function ( candidates) {
		//日期到日期
		candidates.directives.register('uploadFileVideo',function(){
			return {
				scope:{
					avaterUrl : '=',
				},
				require:'?ngModel',
				template:function(tElement,tAttrs){
					var template = '\
								<span class="uploadFile uploadImg" ng-class="{\'hasValue\':avaterUrl}">\
									<img id="headImg" class="img_show" src="{{avaterUrl}}"/>\
									<input id="img_input" class="img_input" type="file" name="uploadInput"/>\
									<label class="img_span" for="img_input">+</label>\
								</span>';
					return template;
				},
				replace:true,
				link:function($scope,$element,$attrs,$ctr){
					var e_img_input = document.getElementById("img_input");
					var e_headImg = document.getElementById("headImg");

					e_img_input.addEventListener("change",uploadFile);
					
					function openOrClose( tag ){
						var obj = {};
						obj.tag = tag;
						$scope.editPluagin(obj);
					}
					
					//重新定义文件选择框
					function fileSelect(){
						//关闭层
						if( e_img_input.outerHTML ){
							e_img_input.outerHTML = e_img_input.outerHTML;
						}else{
							e_img_input.outerHTML.value="";
						}
						e_img_input = document.getElementById("img_input");
						e_img_input.addEventListener("change",uploadFile);
					}
					
					function uploadFile(){
						var ele = e_img_input;
						//获取选中图片并展示
						if( !ele.value ){
							openOrClose("");
							return false;   
						}
						
						if( !ele.value.match( /.jpg|.gif|.png|.bmp/i ) ){
							alert('图片格式不对，请重新选择GIF，JPG或PNG文件！');
							openOrClose("");
							return false;   
						}
						$("body").append(popUp);
						e_all = document.getElementById('upload_img_plugin');
						e_img = document.getElementById('show_img');
						e_circle = document.getElementById('cut_circle');
						e_div = document.getElementById('cut_div');
						e_tag = document.getElementById('cut_tag');
						e_img_plugin = document.getElementById('img_plugin');
						e_close = document.getElementById('upload_close');
						
						e_cancle = document.getElementById('img_plugin_cancle');
						e_submit = document.getElementById('img_plugin_submit');
						
						e_close.onclick = e_cancle.onclick = function(){
							fileSelect();
							openOrClose("");
							e_all.remove();
						}
						
						e_submit.onclick = function(){
							getImage();
						}
						
						if( ele.files && ele.files[0] ){
					        var img = document.getElementById("show_img");
					        var reader = new FileReader();
					        reader.onload = function(evt){
					        	img.src = evt.target.result;
					        	e_circle.style.backgroundImage = "url("+img.src+")";
					        	test(img);
					        }
					        reader.readAsDataURL(ele.files[0]);
					    }else{
					        ele.select();
					        var src = document.selection.createRange().text;
					        var img = document.getElementById("show_img");
					        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
					        e_circle.style.backgroundImage = "url("+img.src+")";
					        test(img);
					    }
					    e_circle.style.backgroundSize= e_img_plugin.offsetWidth+"px";
					}
					
					
					
					
				},
				
			}
		});
});