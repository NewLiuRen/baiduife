(function () {
    /**
     * 建立要控制的数组对象
     */
    function CtrlArray (arr) {
        this.array = [];
    }
    /**
     * 对象原型上添加方法
     */
    CtrlArray.prototype = {
        constructor : CtrlArray,
        rIn : function (txt) {
            var arr = this.splitTxt(txt),
                array = this.array;

            arr.forEach(function (e, i, arr) {
                if (e) {
                    array.push(e);
                }
            });
        },
        rOut : function (txt) {
            var tip = this.array.pop(txt);
            console.log('右侧删除：' + tip);
        },
        lIn : function (txt) {
            var arr = this.splitTxt(txt).reverse(),
                array = this.array;

            arr.forEach(function (e, i, arr) {
                if (e) {
                    array.unshift(e);
                }
            });
        },
        lOut : function (txt) {
            var tip = this.array.shift(txt);
            console.log('左侧删除：' + tip);
        },
        remove : function (index) {
            this.array.splice(index, 1);
        },
        clear : function () {
            this.array = [];
        },
        getArray : function () {
            return this.array;
        },
        setArray : function (arr) {
            this.array = arr;
        },
        splitTxt : function (txt) {
            var splitRegexp = /,|，|、|\s/;

            return txt.split(splitRegexp);
        },
        isOutRange : function (num) {
            return this.array.length > num;
        },
        removeRepeat : function (arr) {
            var rearr = [],
                i;

            for (i=0 ; i<arr.length ; i+=1) {
                if (rearr.indexOf(arr[i]) === -1) {
                    rearr.push(arr[i]);
                }
            }

            return rearr;
        }
    };
    /**
     * 查找
     */
    function searchTxt (arr, key) {
        var keyword = null,
            indexArr = [];

        if (key) {
            keyword = new RegExp(key, 'i');

            arr.forEach(function (e, i, arr) {
                if (keyword.test(e)) {
                    indexArr.push(i);
                }
            });
        }

        return indexArr;
    }
    /**
     * 验证表单
     */
    function validate (num, range) {
        var regexp = /^\S+$/g;

        if (!regexp.test(num*1)) {
            alert('请填入符合要求的文字');
            return false;
        } else {
            return true;
        }
    }
    /**
     * 渲染数组
     */
    function render (array, wrap) {
        var html = '';

        html = array.map(function (e, i, arr) {
            return '<div>'+e+'</div>';
        }).join('');

        wrap.innerHTML = html;
    }
    /**
     * 绑定事件
     */
    function addEvent () {
        var input = lr_util.$('input'),
            textarea = lr_util.$('textarea'),
            clear = lr_util.$('clear'),
            btn = lr_util.$('btn'),
            wrap_tag1 = lr_util.$('wrap_tag1'),
            wrap_tag2 = lr_util.$('wrap_tag2'),
            div1 = lr_util.$t('div', wrap_tag1),
            div2 = lr_util.$t('div', wrap_tag2),
            btns = lr_util.$t('button'),
            ctrl_1 = new CtrlArray(),
            ctrl_2 = new CtrlArray(),
            timer = null;

        var btnDisable = function () {
            for (var i = 0; i < btns.length; i++) {
                btns[i].setAttribute('disabled', true);
            }
        };

        var btnEnable = function () {
            for (var i = 0; i < btns.length; i++) {
                btns[i].removeAttribute('disabled');
            }
        };

        // input内添加标签
        lr_util.addHandler(input, 'keyup', function (e) {
            var event = lr_util.getEvent(e),
                arr = ctrl_1.getArray(),
                txt = this.value;

            // 判断输入若输入内含有空格，逗号，或者用户点击回车则输出标签
            if (txt.indexOf(' ') !== -1 || txt.indexOf(',') !== -1 || txt.indexOf('，') !== -1 || e.keyCode === 13) {
                txt = this.value.indexOf(',') ? this.value.slice(0, -1) : this.value ;
                arr.push(lr_util.trim(txt));
                ctrl_1.setArray(arr);
                // 若超出10个标签则从队列头部删除
                if (ctrl_1.isOutRange(10)) {
                    ctrl_1.lOut();
                }
                this.value = '';
                this.select();
            }

            render(ctrl_1.getArray(), wrap_tag1);
        });

        // 点击标签则删除
        lr_util.addHandler(wrap_tag1, 'click', function (e) {
            var event = lr_util.getEvent(e),
                target = lr_util.getTarget(event),
                divs = Array.prototype.slice.call(this.childNodes, 0);
                index = -1;

            if (target.nodeName.toLowerCase() === 'div' && target.parentNode.nodeName.toLowerCase() !== 'body') {
                index = divs.indexOf(target);
                ctrl_1.remove(index);
                wrap_tag1.removeChild(divs[index]);
            }
        });

        lr_util.addHandler(btn, 'click', function (e) {
            var event = lr_util.getEvent(e),
                arr = ctrl_2.getArray(),
                txt = textarea.value;

            ctrl_2.clear();
            ctrl_2.rIn(txt);
            ctrl_2.setArray(ctrl_2.removeRepeat(ctrl_2.getArray()));
            //若超出10个标签则从队列头部删除
            if (ctrl_2.isOutRange(10)) {
                ctrl_2.setArray(ctrl_2.getArray().slice(-10));
            }

            render(ctrl_2.getArray(), wrap_tag2);
        });

    }

    function init () {
        addEvent();
    }

    init();
})();
