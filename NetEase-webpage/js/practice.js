!function(){
	var cookie = cookieUtil.getck();
	var $ = function(id){
		return document.getElementById(id);
	}
	var node = {
		setText:function(clazz,text){
			 var clazzs = Object.prototype.getElementsByClassName.call(this,clazz);
			 for(var key in clazzs){
			 	if (!Object.prototype.hasOwnProperty.call(clazzs,key)){continue;}
			 	clazzs[key].innerHTML = text;
			 }
		},
		setSrc:function(url){
			 var imgs = this.getElementsByTagName('img');
			 for(var key in imgs){
			 	if (!Object.prototype.hasOwnProperty.call(imgs,key)){continue;}
			 	imgs[key].src = url;
			 }
		}
	}
	//获得指定元素集合中当前项下标
	var getIndex = function(list,className){
		var index;
		for (var i = 0; i <list .length; i++) {
		 	if(list[i].className.indexOf(className)>=0){
		 		index = i;
		 		return index;
		 	}
		}
	}
	//切换到指定项
	var changeTo = function(list, tag ,clazz, flag){
		var index;
		if (flag==null) {
			flag = true;
		}
		for (var i = 0; i < list.length; i++) {
			classUtil.delClass(list[i],clazz);
			if (list[i]==tag) {index = i;}
		}
		classUtil.addClass(tag,clazz);
		if (flag) {
			fadein(tag);
		}
		return index;
	}
	//淡入效果
	var fadein = function(elem){
	    var value = 0;  
	    var step = function() {
	    	setOpacity(elem, value);
	    	value += 0.1;
	    	if(value>1){
	    		value = 1;
	    		clearInterval(fadeID);
	    	}
	    }
	    var fadeID = setInterval(step, 50); //50毫秒*10次=500ms
		//设置opacity 
		function setOpacity(element,value){
			element.filters ? element.style.filter = "alpha(opacity='+100*value+')": element.style.opacity =value;
		}
	}
		 
	// 轮播头图的实现
	var slide = (function(){
		var imgbox = $('imgbox'),
			ointbox= $('pointbox'),
			imgs = imgbox.getElementsByTagName('li'),
			points = pointbox.getElementsByTagName('i');

		// 实现圆点的点击切换
		eventUtil.addEvent(pointbox,
			'click', function(event){
				event = event||window.event;
				var target = event.target||event.srcElement;
				var i;
				if (target.nodeName!='I') {return}
				changeTo(points,target,'active');
				i = getIndex(points,'active');
				changeTo(imgs,imgs[i],'active');
			}
		);
		//切换至下一张图片
		var slideNext = function(){
			var index = getIndex(imgs,'active')+1;
			if (index>=3) {index=0};
			changeTo(imgs,imgs[index],'active');
			changeTo(points,points[index],'active');
		}
		changeTo(imgs,imgs[0],'active');//初始化
		var slideID = setInterval(slideNext,5000);

		eventUtil.addEvent(imgbox.parentNode,
			'mouseenter',function(){
				 clearInterval(slideID);
			});
		eventUtil.addEvent(imgbox.parentNode,
			'mouseleave',function(){
				slideID = setInterval(slideNext,5000);
			});
	})();

	// 实现课程切换
	var course = (function(){

		// 不同tab切换的实现
		var cbox = $('cbox'),
			rank = $('topbox'),
			tops = rank.getElementsByTagName('li'),
			clist = cbox.getElementsByTagName('li'),
			tabs = Object.prototype.getElementsByClassName.call(document,'c-tab');
		tabs[0].type = 10;
		tabs[1].type = 20;
		var width = document.body.clientWidth;
		var options = {
				 	pageNo:1,
				 	psize:width>1371?20:15,
				 	type:tabs[0].type,
				 };
		var temp = 
		'<div class="c-dt">\
			<img src="" alt="CoursePicture">\
			<div>\
				<h3 class="name"></h3>\
				<span class="dtnum"></span>\
				<span class="dtprovider"></span>\
				<span class="dtcategoryName"></span>\
			</div>\
			<p class="description"></p>\
		</div>';
		function html2node(str){
			var container = document.createElement('div');
			container.innerHTML = str;
			return container.children[0];
		}
		/**
		 * [setCdetail description]
		 * @description 在每个课程中添加详细信息的节点
		 */
		function setCdetail(){
			for (var i = 0; i < clist.length; i++) {
				if ('c-dt'.indexOf(clist[i].className)==-1) {
					clist[i].insertBefore(html2node(temp),clist[i].firstChild);
				}
			}
		}
		/**
		 * [getPsize description]
		 * @description 根据当前页面宽度实现布局的变化
		 */
		function getPsize(){
			width = document.body.clientWidth;
			if (width<=1371) {
				for (var i = clist.length - 1; i >= clist.length - 5; i--) {
					clist[i].style.display = 'none';
				}
			}else{
				for (var i = clist.length - 1; i >= clist.length - 5; i--) {
					clist[i].style.display = 'inline-block';
				}
			}
		}
		/**
		 * [getRank description]
		 * @description 利用ajax异步获取当前最热排行
		 */
		function getRank () {
			xhrUtil.getxhr('http://study.163.com/webDev/hotcouresByCategory.htm',
			 	'',function(data){
			 		 data = JSON.parse(data);
			 		 for (var i = 0; i < data.length; i++) {
			 		 	extend(tops[i], node);
			 		 	tops[i].setText('name',data[i].name);
			 		 	tops[i].setText('provider',data[i].provider);
			 		 	tops[i].setText('dtprovider','发布者 : '+data[i].provider);
			 		 	tops[i].setText('num',data[i].learnerCount);
			 		 	tops[i].setText('price',data[i].price?'￥'+data[i].price:'免费');
			 		 	tops[i].setText('categoryName',data[i].categoryName);
			 		 	tops[i].setText('description',data[i].description);
			 		 	tops[i].setSrc(data[i].smallPhotoUrl);
			 		 }
			 	}
			);
		}
		// 实现当页面重新加载或改变浏览器宽度时课程布局的变化
		eventUtil.addEvent(window,
			'load',function(){
				 setCdetail();
				 getPsize();
				 getRank();
				 getCourse(options);
			});
		eventUtil.addEvent(window,
			'resize',function(){
				 var oldwidth = width;
				 var newwidth;
				 getPsize();
				 newwidth = width;
				 // 只当布局发生改变时重新获取课程内容
				 if (newwidth!=oldwidth) {
					 options.psize = width>1371?20:15;
					 getCourse(options); 	
				 }
				 return;				 
			});
		function getCourse(parm){
			 xhrUtil.getxhr('http://study.163.com/webDev/couresByCategory.htm',
			 	parm,function(data){
			 		 data = JSON.parse(data);
			 		 if (data.pagination.totlePageCount<options.pageNo) {return;}
			 		 for (var i = 0; i < data.list.length; i++) {
			 		 	extend(clist[i],node);
			 		 	clist[i].setText('name',data.list[i].name);
			 		 	clist[i].setText('provider',data.list[i].provider);
			 		 	clist[i].setText('dtprovider','发布者 : '+data.list[i].provider);
			 		 	clist[i].setText('num',data.list[i].learnerCount);
			 		 	clist[i].setText('dtnum',data.list[i].learnerCount+'人在学');
			 		 	clist[i].setText('price',data.list[i].price?'￥'+data.list[i].price:'免费');
			 		 	clist[i].setText('categoryName',data.list[i].categoryName);
			 		 	clist[i].setText('dtcategoryName',data.list[i].categoryName?'分类 : '+data.list[i].categoryName:'分类 : 无');
			 		 	clist[i].setText('description',data.list[i].description);
			 		 	clist[i].setSrc(data.list[i].bigPhotoUrl);
			 		 }
			 	}
			);
		}
		eventUtil.addEvent(tabs[0].parentNode,
			'click',function(event){
				 event = event||window.event;
				 var target = event.target||event.srcElement;
				 options = {
				 	pageNo:1,
				 	psize:width>1371?20:15,
				 	type:target.type,
				 };
				 changeTo(tabs,target,'active',false);
				 getCourse(options);
			}
		);

		// 实现课程hover的弹出框
		// 函数获得指定事件的有效操作节点
		var getTarget = function(ev,clazz){
			clazz = clazz||'';
			var node = ev.target||ev.srcElement;
			while(!!node&&(node.className||'').indexOf(clazz)<0){
				node = node.parentNode;
			}
			return node;
		}
		eventUtil.addEvent(cbox,
			'mouseover',function(event){
				 event = event||window.event;
				 var target = getTarget(event,'c-item');
				 if (target == null) {return;}
				 target.getElementsByClassName('name')[1].style.color = '#39a030';
				 classUtil.addClass(target,'active');
			});
		eventUtil.addEvent(cbox,
			'mouseout',function(event){
				 event = event||window.event;
				 var target = getTarget(event,'c-item');
				 if (target == null) {return;}
				 target.getElementsByClassName('name')[1].style.color = '#333';
				 classUtil.delClass(target,'active');
			});

		// 实现页码及前后一页切换
		var pagebox = $('pagebox'),
			pages = pagebox.getElementsByTagName('li'),
			prepage = $('c-pre'),
			nextpage = $('c-next');
		eventUtil.addEvent(pagebox,
			'click',function(event){
				 event = event||window.event;
				 var target = event.target||event.srcElement;
				 if (target.nodeName!='LI') {return}
				 var index;
				 index = changeTo(pages,target,'active',false);
				 if(options.pageNo != index+1){
				 	options.pageNo = index+1;
					getCourse(options);
				 }
			}
		);
		var oneStepPage = function(num){
			 var index = getIndex(pages,'active')+num;
			 if (index>7) {
			 	index = 0;
			 }else if(index<0){
			 	index = 7;
			 }
			 changeTo(pages,pages[index],'active',false);
			 options.pageNo = index+1;
			 getCourse(options);
			 return index;
		}
		eventUtil.addEvent(prepage,
			'click',function(){
				oneStepPage(-1);
			});
		eventUtil.addEvent(nextpage,
			'click',function(){
				oneStepPage(1);
			});
		// 实现右侧最热排行的刷新
		var refresh = function(){
			var s = 1;
			var step = function(){
				 setMarginTop(rank,s);
				 s += 1;
				 if (s>70) {
					var rchild;
				 	clearInterval(stepID);
			 		rchild = rank.removeChild(tops[0]);
			 		rank.appendChild(rchild);
					setMarginTop(rank,0);
				 }
			}
			var stepID = setInterval(step,100/7);
		}
		// 设置margin-top
		function setMarginTop(elem,val){
			elem.style.marginTop = -val-20+'px';
		}
		var freshID = setInterval(refresh,5000);
	})();
	
	// 实现点击'不再提醒'设置本地cookie
	var tipoff = (function(){	 
		var tclose = $('tip-cs'),
			remind = $('remind');
		(function(){
			if (cookie) {
				for(var i in cookie){
					if (cookie.hasOwnProperty(i)){
						if (i=='closetip'&&cookie[i]=='true') {
							return;
						}
					}
				}
				remind.style.display = 'block';
			}
		})(cookie);
		eventUtil.addEvent(tclose,
			'click',function(){
				 cookieUtil.setck('closetip','true',30000);
				 remind.style.display = 'none';
			});
	})();

	// 关注按钮及登录框表单处理
	var login = (function(){
		// 实现登录框的弹出和关闭
		var lgoff = $('lgoff'),
			lgForm = $('lgForm'),
			fan = Object.prototype.getElementsByClassName.call(document,'h-fan');
		// 实现关注与未关注样式变化
		var addFan = function(flag){
			 if (flag) {
				fan[0].style.display = 'none';
				fan[1].style.display = 'inline-block';		 	
			}else{
				fan[0].style.display = 'inline-block';	
				fan[1].style.display = 'none';
			}
		};
		(function(){
			if (cookie) {
				for(var i in cookie){
					if (cookie.hasOwnProperty(i)){
						if (i=='followSuc'&&cookie[i]=='true') {
							addFan(true);
							return;
						}
					}
				}
				addFan(false);
			}
		})();
		eventUtil.addEvent(lgoff,
			'click',function(event){
				lgForm.parentNode.style.display = 'none';
				lgForm.user.value = '';
				lgForm.pwd.value = '';
				classUtil.delClass(lgForm.user,'error');
				classUtil.delClass(lgForm.pwd,'error');
				disabledBtn(false);
			});

		eventUtil.addEvent(fan[0],
			'click',function(){
				if (cookie) {
					for(var i in cookie){
						if (cookie.hasOwnProperty(i)){
							if (i=='loginSuc'&&cookie[i]=='true') {
								cookieUtil.setck('followSuc','true',30000);
								console.log('关注成功！');
								addFan(true);
								return;
							}
						}
					}
				}
				lgForm.parentNode.style.display = 'block';
			});
		var cancel = fan[1].lastChild;
		eventUtil.addEvent(cancel,
			'click',function(){
				 addFan(false);
				 cookieUtil.removeck('followSuc');
				 console.log('关注取消！');
			});
		function disabledBtn(flag){
			lgForm.btn.disabled = !!flag;
			!flag?classUtil.delClass(lgForm.btn,'disabled')
				 :classUtil.addClass(lgForm.btn,'disabled');
		}
		// 表单验证及相应样式处理
		eventUtil.addEvent(lgForm.user,
			'blur',function(event){
				 event = event||window.event;
				 var target = event.target||event.srcElement;
				 if (lgForm.user.value==='') {
				 	classUtil.addClass(target,'error');
				 	classUtil.addClass(lgForm.pwd,'error');
				 }
			});
		eventUtil.addEvent(lgForm.user,
			'input',function(event){
				 classUtil.delClass(lgForm.user,'error');
				 classUtil.delClass(lgForm.pwd,'error');
				 disabledBtn(false);
			});
		eventUtil.addEvent(lgForm.pwd,
			'input',function(event){
				 classUtil.delClass(lgForm.user,'error');
				 classUtil.delClass(lgForm.pwd,'error');
				 disabledBtn(false);
			});
		eventUtil.addEvent(lgForm,
		 	'submit',function(){
		 		var user = {};
				disabledBtn(true);
		 		user.userName = hex_md5(lgForm.user.value);
		 		user.password = hex_md5(lgForm.pwd.value);

				xhrUtil.getxhr('http://study.163.com/webDev/login.htm',
					user,function(lgtext){
						if (lgtext==1) {
							cookieUtil.setck('loginSuc',true,30000);
							console.log('登录成功！');
							xhrUtil.getxhr('http://study.163.com/webDev/attention.htm',
								'',function(attext){
								 if (attext==1) {
									lgForm.parentNode.style.display = 'none';
									disabledBtn(false);
								 	addFan(true);
									cookieUtil.setck('followSuc',true,30000);
									console.log('关注成功！');
								 }
							})
						}else{
							classUtil.addClass(lgForm.user,'error');
				 			classUtil.addClass(lgForm.pwd,'error');
							disabledBtn(false);
						}
					});
		 	});
	})();

	// 视频弹窗
	var popvideo = (function(){
		 var vlink = $('vlink'),
		 	 vbox = $('vbox'),
		 	 voff = $('voff'),
		 	 vstop = $('vstop'),
		 	 vd = $('vd');
		 eventUtil.addEvent(vstop,
		 	'click',function(event){
		 		 event = event||window.event;
		 		 var target = event.target||event.srcElement;
		 		 if (vd.paused) {
			 		 vd.play();
			 		}
		 	});
		 eventUtil.addEvent(vd,
		 	'play',function(event){
			 	 vstop.style.display = 'none';
		 	});
		 eventUtil.addEvent(vd,
		 	'pause',function(event){
			 	 vstop.style.display = 'inline-block';
		 	});
		 eventUtil.addEvent(vd,
		 	'click',function(){
		 		 if (vd.paused) {
		 			vd.play();
		 		 }else{
		 		 	vd.pause();
		 		 }
		 	});
		 eventUtil.addEvent(voff,
		 	'click',function(){
		 		 vbox.parentNode.style.display = 'none';
		 		 vd.load();
		 	});
		 eventUtil.addEvent(vlink,
		 	'click',function(event){
		 		 vbox.parentNode.style.display = 'block';
		 	});
	})();
}();
