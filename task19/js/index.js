(function () {
    /**
     * 建立要控制的数组对象
     */
    function CtrlArray (arr) {
        var array = [];
    }
    /**
     * 对象原型上添加方法
     */
    CtrlArray.prototype = {
        constructor : CtrlArray,
        rIn : function (num) {
            if(this.isOutRange()) {
                this.array.push(num);
            }
        },
        rOut : function (num) {
            var tip = this.array.pop(num);
            console.log('右侧删除数字' + tip);
        },
        lIn : function (num) {
            if(this.isOutRange()) {
                this.array.unshift(num);
            }
        },
        lOut : function (num) {
            var tip = this.array.shift(num);
            console.log('左侧删除数字' + tip);
        },
        remove : function (index) {
            this.array.splice(index, 1);
        },
        getArray : function () {
            return this.array;
        },
        setArray : function (arr) {
            this.array = arr;
        },
        isOutRange : function () {
            return this.array.length>=60 ? alert('元素个数不能超过60个') : true;
        }
    };
    /**
     * 排序
     */
    var arrSort = {
        // 冒泡
        bubble : function (arr) {
            if (!arr) {
                return ;
            }
            var arrClone = [],
                queue = [],
                tmp, i, j;

            for (i=arr.length ; i>0 ; i-=1) {
                for (j=0 ; j<i ; j+=1) {
                    if (arr[j] > arr[j+1]) {
                        tmp = arr[j];
                        arr[j] = arr[j+1];
                        arr[j+1] = tmp;
                        arrClone = arr.slice(0);
                        queue.push(arrClone);
                    }
                }
            }
            return queue.reverse();
        },
        // 插入
        insert : function (arr) {
            if (!arr) {
                return ;
            }
            var arrClone = [],
                queue = [],
                i, tmp, key;

            for(i=1 ; i<arr.length ; i++){
                tmp= arr[i];
                key= i-1;

                while(key>=0&& tmp< arr[key]){
                    arr[key+1]= arr[key];
                    key--;
                }

                if((key+1)!= i){
                    arr[key+1]= tmp;
                }

                arrClone = arr.slice(0);
                queue.push(arrClone);
            }
            return queue.reverse();
        }
    };
    /**
     * 生成随机数组
     */
    function randomArr (num) {
        var i,arr = [];
        for (i=0 ; i<num ; i+=1) {
            arr.push(Math.floor(Math.random()*90)+10);
        }
        return arr;
    }
    /**
     * 验证表单
     */
    function validate (num, range) {
        var regexp = /^\d+$/g;

        if (!regexp.test(num*1)) {
            alert('请填入数字');
            return false;
        } else {
            if (range && (num<10 || num>100)) {
                alert('填入数字范围为10~100');
                return false;
            }
            return true;
        }
    }
    /**
     * 渲染数组
     */
    function render (array) {
        var wrap = lr_util.$('wrap'),
            html = array.map(function (e, i, arr) {
                return '<div style="left:'+(i*21)+'px;height:'+(e*1.6)+'px;">'+e+'</div>';
            }).join('');

        wrap.innerHTML = html;
    }
    /**
     * 绑定事件
     */
    function addEvent () {
        var input = lr_util.$('input'),
            lIn = lr_util.$('left-in'),
            lOut = lr_util.$('left-out'),
            rIn = lr_util.$('right-in'),
            rOut = lr_util.$('right-out'),
            createNum = lr_util.$('createNum'),
            sort = lr_util.$('sort'),
            wrap = lr_util.$('wrap'),
            div = lr_util.$t('div', wrap),
            btns = lr_util.$t('button'),
            select = lr_util.$('sortType'),
            ctrl = new CtrlArray(),
            timer = null;

        var btnEvent = function (ele, type) {
            lr_util.addHandler(ele, 'click', function () {
                var num = lr_util.trim(input.value),
                    flag = /in/i.test(type);
                if (validate(num, flag)) {
                    ctrl[type](num);
                    render(ctrl.getArray());
                }
                input.select();
            });
        };

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

        btnEvent(lIn, 'lIn');
        btnEvent(lOut, 'lOut');
        btnEvent(rIn, 'rIn');
        btnEvent(rOut, 'rOut');

        lr_util.addHandler(wrap, 'click', function (e) {
            var event = lr_util.getEvent(e),
                target = lr_util.getTarget(event),
                divs = Array.prototype.slice.call(this.childNodes, 0);
                index = -1;

            if (target.nodeName.toLowerCase() === 'div') {
                index = divs.indexOf(target);
                ctrl.remove(index);
                render(ctrl.getArray());
            }
        });

        lr_util.addHandler(createNum, 'click', function () {
            ctrl.setArray(randomArr(50));
            render(ctrl.getArray());
        });

        lr_util.addHandler(sort, 'click', function () {
            var type = select.value,
                arr = arrSort[type](ctrl.getArray()),
                show = [];

            if (!arr) {
                return;
            }

            timer = setInterval(function () {
                if (arr.length) {
                    show = arr.pop();
                    render(show);
                    btnDisable();
                } else {
                    clearInterval(timer);
                    btnEnable();
                }
            }, 50);
        });
    }

    function init () {
        addEvent();
    }

    init();
})();
