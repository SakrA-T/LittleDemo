// !function(){
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
		//获得被触发的事件
		getEvent:function(event){
			return event?event:window.event;
		},
		//获得触发事件的元素
		getTarget:function(event){
			return event.target||event.srcElement;
		},
		//阻止时间冒泡（向上传播）
		stopPropagation:function(event){
			if (event.stopPropagation) {
				event.stopPropagation();	//这里写return的话return的是这个函数运行后的结果
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
// }();
var $ = function(id){
	 return document.getElementById(id);
}

var createxhr = (function() {
    var xhr;
    return function() {
        if (!xhr) {
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xhr;
    }
})();

if(!window.JSON){
	window.JSON = {
		parse : function(sJSON){
		 	return eval('('+sJSON+')');
		}
	};
}
/**
 * [getElementByClassName description]
 * @param  classname
 * @return 符合要求的数组
 * @description 兼容IE8-
 */
Object.prototype.getElementByClassName = function(classname){
	if (this.getElementsByClassName) {
		return this.getElementsByClassName(classname);
	}else{
		var childelems = this.getElementsByTagName('*');
		var classarr = [];
		var elem,cnamestr,flag;
		classname = classname.split(' ');
		console.log(classname);
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