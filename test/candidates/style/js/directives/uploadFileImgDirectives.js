/**
 * 上传图片插件
 */
define([
	'candidatesModule',
	], function ( candidates) {
		//日期到日期
		candidates.directives.register('uploadFileImg',function(){
			return {
				scope:{
					ngModel   : '=',
					editPluagin :'&',
					avaterUrl : '=',
				},
				require:'?ngModel',
				template:function(tElement,tAttrs){
					var template = '\
								<span class="uploadFile uploadImg" ng-class="{\'hasValue\':avaterUrl}">\
									<img id="headImg" class="img_show" ng-src="{{avaterUrl}}" onerror="javascript:this.src=\'./candidates/style/img/default.png\';this.onerror=null;"/>\
									<input id="img_input" class="img_input" type="file" name="uploadInput"/>\
									<label class="img_span" for="img_input">+</label>\
								</span>';
					return template;
				},
				replace:true,
				link:function($scope,$element,$attrs,$ctr){
					var e_img_input = document.getElementById("img_input");
					var e_headImg = document.getElementById("headImg");
					
					var e_img = "";
					var e_circle = "";
					var e_div = "";
					var e_tag = "";
					var e_img_plugin ="";
					var e_close = "";
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
						//打开遮罩层
						openOrClose("openPopUpImg");
						
						var ele = e_img_input;
						//生成弹出框
						var popUp = $('<div id="upload_img_plugin">'+
											'<span class="upload_title">选择裁剪区域</span>'+
											'<div id="upload_close" class="upload_close">x</div>'+
											'<div id="img_plugin">'+
												'<img id="show_img"/>'+
												'<div id="layout"></div>'+
												'<div id="cut_circle">'+
													'<div id="cut_div"></div>'+
													'<div id="cut_tag"></div>'+
												'</div>'+
											'</div>'+
											'<div class="form_but_group">'+
												'<div id="img_plugin_submit" class="form_but form_but_submit">裁剪</div>'+
												'<div id="img_plugin_cancle" class="form_but form_but_cancel">取消</div>'+
											'</div>'+
										'</div>');
						//获取选中图片并展示
						if( !ele.value ){
							openOrClose("");
							return false;   
						}
						
						if( !ele.value.match( /.jpg|.png|.bmp/i ) ){
							alert('图片格式不对，请重新选择JPG或PNG文件！');
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
					//对选中的图片进行切图
					function test(simg){
						var iwh=Math.min(simg.height,simg.width);
						e_circle.onmousedown = function(e){
							var e = e||event;
							self.x = e.clientX-this.offsetLeft;
							self.y = e.clientY+document.documentElement.scrollTop-this.offsetTop;
							try{
								e.preventDefault();
							}catch(o){
								e.returnValue = false;
							}
							document.onmousemove = function(e){
								var e=e||event;
								var t = e.clientY+document.documentElement.scrollTop-self.y;
								var l = e.clientX-self.x;
								t = Math.max(t,0);
								l = Math.max(l,0);
								t=Math.min(t,simg.height-e_circle.offsetHeight);
								l=Math.min(l,simg.width-e_circle.offsetWidth);
								yd(t,l)
							}
						}
						e_tag.onmousedown=e_div.onmousedown=e_circle.onmouseup=function(){
							document.onmousemove='';
						}
						function yd(t,l){
							e_circle.style.top=t+'px';
							e_circle.style.left=l+'px';
							bgPosition(t,l)
						}
						function bgPosition(t,l){
							e_circle.style.backgroundPosition="-"+(l+1)+"px -"+(t+1)+"px";
						}
						e_tag.onmousedown = function(e){
							var e=e||event;
							self.x=e.clientX-this.offsetLeft;
							self.y=e.clientY+document.documentElement.scrollTop-this.offsetTop;
							try{e.preventDefault();}catch(o){e.returnValue = false;}
							try{e.stopPropagation();}catch(o){e.cancelBubble = true;}
							document.onmousemove=function(e){
								var e=e||event;
								var t=e.clientY+document.documentElement.scrollTop-self.y;
								var l=e.clientX-self.x;
								l=Math.max(t,l);
								l=l>iwh?iwh:l;
								sff(l,l);
							}
						}
						function sff(t,l){
							e_tag.style.top=t+'px';
							e_tag.style.left=l+'px';
							e_circle.style.width=(l+10)+'px';
							e_circle.style.height=(t+10)+'px';
							e_circle.style.borderRadius = (l+10)/2+"px";
							yd(e_circle.offsetTop,e_circle.offsetLeft);
						}
						//初始化
						function init(){
							var cir_width  = e_circle.offsetWidth;
							var cir_height = e_circle.offsetHeight;
							var img_width  = simg.offsetWidth;
							var img_height = simg.offsetHeight;
							e_circle.style.top = (img_height/2 - cir_height/2)+"px";
							e_circle.style.left = (img_width/2 - cir_width/2)+"px";
							yd(e_circle.offsetTop,e_circle.offsetLeft);
						}
						init();
					}
					
					//裁剪
					function getImage(){
						var img = new Image();
						img.onload = function(){
							var canvas = document.createElement("canvas");
							var ctx = canvas.getContext("2d");
							var e_circle_object = e_circle.getBoundingClientRect();
							var circleX = e_circle.offsetTop;
							var circleY = e_circle.offsetLeft;
							var circleWidth = e_circle.offsetWidth;
							var circleHieght = e_circle.offsetHeight;
							var scale = img.width/e_img_plugin.offsetWidth;
							canvas.width  = 100;
							canvas.height = 100;
							ctx.drawImage(img,circleY*scale,circleX*scale,circleWidth*scale,circleHieght*scale,0,0,100,100);
							
							ctx.save();
							ctx.fillStyle='#FF0000';
							ctx.globalCompositeOperation="destination-in";
							ctx.arc(50,50,50,0,Math.PI*2);
							ctx.fill();
							ctx.restore();
							var strDataURI = canvas.toDataURL();
							$ctr.$setViewValue( strDataURI );
							e_headImg.src = strDataURI;
							openOrClose("");
							e_all.remove();
						}
						img.src = e_img.src;
					}
				},
				
			}
		});
});