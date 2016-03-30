;(function (window) {

    var lr_util = {
        // id选择器
        $ : function (id) {
            return document.getElementById(id);
        },
        // 标签选择器
        $t : function (tag, parent) {
            return !parent ? document.getElementsByTagName(tag) : parent.getElementsByTagName(tag);
        },

        // 检测是否含有textContent方法，ie9-没有textContent()
        getInnerText : function (ele) {
            return typeof ele.textContent === 'string' ? ele.textContent : ele.innerText;
        },
        setInnerText : function (ele, txt) {
            if (typeof(ele.textContent) === 'string') {
                ele.textContent = txt;
            } else {
                ele.innerText = txt;
            }
        },


        // 事件处理
        // 增加事件监听
        addHandler : function (ele, type, handler) {
            if (ele.addEventListener) {
                ele.addEventListener(type, handler, false);
            } else if (ele.attachEvent) {
                ele.attachEvent('on' + type, handler);
            } else {
                ele['on' + type] = handler;
            }
        },
        // 移除事件监听
        removeHandler : function (ele, type, handler) {
            if (ele.removeEventListener) {
                ele.removeEventListener(type, handler, false);
            } else if (ele.detachEvent) {
                ele.detachEvent('on' + type, handler);
            } else {
                ele['on' + type] = null;
            }
        },
        // 获取event对象
        getEvent : function (event) {
            return event ? event : window.event;
        },
        // 获取目标对象
        getTarget : function (event) {
            return event.target || event.srcElement;
        },
        // 阻止默认事件
        preventDefault : function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        // 阻止事件冒泡
        stopPropagation : function (event) {
            if (event) {
                event.stopPropagation();
            } else {
                evetn.cancelBubble = true;
            }
        },


        // 操作class
        // 判断是否存在class
        hasClass : function (ele, cls) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)', 'g'),
                clses = ele.className;

            return reg.test(clses);
        },
        // 添加class
        addClass : function (ele, cls) {
            if (!this.hasClass(ele, cls)) {
                ele.className += ' ' + cls;
            }
        },
        // 删除class
        removeClass : function (ele, cls) {
            var className = ele.className,
                reg = new RegExp('(\\s+|^)'+cls+('(\\s+|$)'), 'g');

            if (this.hasClass(ele, cls)) {
                if (className === this.trim(cls)) {
                    className = '';
                } else {
                    ele.className = className.replace(reg, '');
                }
            }

        },
        // 切换class
        toggleClass : function (ele, cls) {
            if (this.hasClass(ele, cls)) {
                this.removeClass(ele, cls);
            } else {
                this.addClass(ele, cls);
            }
        },

        // 清除字符串左面空格
        ltrim : function (str) {
            return str.replace(/^\s+/g, '');
        },
        // 清除字符串右面空格
        rtrim : function (str) {
            return str.replace(/\s+$/g, '');
        },
        // 清除字符串两面空格
        trim : function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        },

        // 获取元素计算样式
        getStyle : function (ele, style) {
            return window.getComputedStyle ? window.getComputedStyle(ele,null)[style] : ele.currentStyle[style];
        }

    };

    if (!window.lr_util) {
        window.lr_util = lr_util;
    }

})(window, undefined);
