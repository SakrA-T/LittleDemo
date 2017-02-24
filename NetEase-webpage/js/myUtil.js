/**
 * [extend description]
 * @description 复制属性
 */
function extend(o1,o2){
	// console.log(typeof(o1));
	for(var i in o2){
		for(var j in o1){
			if (i === j) {
				continue;
			}
		}
	o1[i] = o2[i];
	}
	return o1;
}
/**
 * [eventUtil description]
 * @type {Object}
 * @description 兼容IE8-的事件函数封装
 */
var eventUtil = {
	//添加事件
	addEvent:function(elem, type, listener){
		if (elem.addEventListener) {
			return elem.addEventListener(type,listener,false);
		}else{
			return elem.attachEvent('on'+type,listener);
		}
	},
	//取消事件
	removeEvent:function(elem, type, listener){
		if (elem.removeEventListener) {
			return elem.removeEventListener(type,listener,false);
		}else{
			return elem.datachEvent('on'+type,listener);
		}
	},
	//获得触发事件的元素
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	//阻止时间冒泡（向上传播）
	stopPropagation:function(event){
		if (event.stopPropagation) {
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	//取消事件默认行为
	preventDefault:function(event){
		if (event.preventDefault) {
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	}
}
/**
 * [getElementByClassName description]
 * @param  classname
 * @return 符合要求的元素数组
 * @description 兼容IE8-
 */
!function(){
	if (!Object.prototype.getElementsByClassName){
		Object.prototype.getElementsByClassName = function(classname){
		var childelems = this.getElementsByTagName('*');
		var classarr = [];
		var elem,cnamestr,flag;
		classname = classname.split(' ');
		for (var i = 0; elem = childelems[i]; i++) {
			cnamestr = ' '+elem.className+' ';
			flag = true;
			for (var j = 0,cname; cname = classname[j]; j++) {
				if(cnamestr.indexOf(' '+cname+' ') == -1){
					flag = false;
					break;
				}
			}
			if(flag){
				classarr.push(elem);
			}
		}
		return classarr;
		}
	}
}();

!function(){
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elem, fromIndex) {
			var k;
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}
			var O = Object(this);
			var len = O.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = +fromIndex || 0;

			if (Math.abs(n) === Infinity) {
				n = 0;
			}
			if (n >= len) {
				return -1;
			}
			k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
			while (k < len) {
				if (k in O && O[k] === elem) {
					return k;
				}
				k++;
			}
			return -1;
		};
	}
}();
/**
 * @description 兼容IE8-
 */
!function(){
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		};
	}
}();
/**
 * [classUtil description]
 * @type {Object}
 * @desciption 增删类函数封装
 */
var classUtil = {
	addClass: function (node, className){
		var current = node.className || "";
		if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
		node.className = current? ( current + " " + className ) : className;
		}
	},
	delClass: function (node, className){
		var current = node.className || "";
		if (!current) return;
		node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
	}
}
/**
 * [cookieUtil description]
 * @type {Object}
 * @description 对cookie的get、set、remove操作的封装
 */
var cookieUtil = {
	getck:function() {
	    var cookie = {};
	    var all = document.cookie;
	    if (all === '')
	        return cookie;
	    var list = all.split('; ');
	    for (var i = 0; i < list.length; i++) {
	        var item = list[i];
	        var p = item.indexOf('=');
	        var name = item.substring(0, p);
	        name = decodeURIComponent(name);
	        var value = item.substring(p + 1);
	        // 对 encodeURIComponent() 函数编码的 URI 进行解码
	        value = decodeURIComponent(value);
	        cookie[name] = value;
	    }
	    return cookie;
	},
	setck:function(name, value, expiredays, path, domain, secure) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		// encodeURIComponent(str) 把字符串作为URI 组件进行编码
		var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		// 将信息跟在字符串后，用‘; ’分号空格隔开；
		if (expiredays)//有效期
		    cookie += '; expires=' + exdate.toGMTString();
		if (path)//路径
		    cookie += '; path=' + path;
		if (domain)//域
		    cookie += '; domain=' + domain;
		if (secure)//安全信息
		    cookie += '; secure=' + secure;
		document.cookie = cookie;
	},
	removeck:function(name, path, domain) {
	    document.cookie = encodeURIComponent(name) + '='+'; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
}
/**
 * [xhrUtil description]
 * @type {Object}
 * @description Ajax创建xhr对象及GET、POST请求的封装
 */
var createxhr = function(){
	 var xhrm;
	 return function(){
	 	if (!xhrm) {
	 		if (window.XMLHttpRequest) {
	 			xhrm = new XMLHttpRequest();
	 		}else{
	 			xhrm = new ActiveXObject("Microsoft.XMLHTTP");
	 		}
	 	}
	 	return xhrm;
	 }
}
function serialize(data){
	var pairs = [];
	if (!data) {return '';}
	for(var name in data){
		if (!data.hasOwnProperty(name)) {continue;}
		if (typeof data[name] === 'function') {continue;}
		var val = data[name].toString();
		name = encodeURIComponent(name);
		val = encodeURIComponent(val);
		pairs.push(name + '=' + val);
	}
	return pairs.join('&');
}
var xhrUtil = {
	getxhr:function(url,options,callback){
		var xhr = createxhr()();
		xhr.onreadystatechange = function(){
			if (xhr.readyState===4) {
				if ((xhr.status >= 200&&xhr.status < 300)||(xhr.status == 304)) {
					callback(xhr.responseText);
				}else{
					console.error("Request was unsuccesful:"+xhr.status);
				}
			}
		}
		if (typeof(options)==='object') {
			if(url.indexOf('?')==-1){url += '?';}
			url += serialize(options);
		}
		xhr.open('GET',url,true);
		xhr.send(null);
	},
	postxhr:function(url,options,callback){
		var xhr = createxhr();
		xhr.onreadystatechange = function(){
			if (xhr.readyState===4) {
				if ((xhr.status >= 200&&xhr.status < 300)||(xhr.status == 304)) {
					callback(xhr.responseText);
				}else{
					console.error("Request was unsuccesful:"+xhr.status);
				}
			}
		}
		xhr.open('POST',url,true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(serialize(options));
	}
}
