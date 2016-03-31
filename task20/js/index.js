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
            var arr = this.splitTxt(txt),
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
     * 生成随机数组
     */
    function randomArr (num) {
        var arr = ['HTML', 'HTML5', 'CSS', 'CSS3', 'Sass', 'Less', 'Bootstrap', 'Javascript', 'ExtJs', 'JQuery',
                    'RequireJs', 'SeaJs', 'AngularJs', 'ReactJs', 'NodeJs', 'Express', 'koa', 'PHP', 'Yii', 'Laravel',
                    '梅西', '伊布', '亨利', '卡卡', 'C罗', '本泽马', '伊瓜因', '阿隆索', '阿圭罗', '比利亚',' 哈维', '普约尔',
                    '伊涅斯塔', '阿尔维斯 ', '范尼', '劳尔', '斯奈德', '范德法特', '拉莫斯', '卡纳瓦罗', '卡西利亚斯',
                    '里贝里', '卢西奥', '托尼 ', '罗本', '施魏因斯泰格', '波多尔斯基', '舍瓦', '小罗', '加图索', '内斯塔',
                    '马尔蒂尼', '埃托奥', '托蒂', '布冯', '皮耶罗', '吉拉迪诺', '穆图', ' 内德维德', '特雷遮盖', '克雷斯波',
                    '维埃拉', '萨内蒂', '萨穆埃尔', '麦孔', '塞萨尔', '鲁尼', '欧文', '杰拉德', '吉格斯', '范德萨', '鲁尼',
                    '费迪南德', '维迪奇', '贝尔巴托夫 ', '基恩 ', '罗比尼奥 ', '德罗巴', '兰帕德', '埃辛', '巴拉克', '特里',
                    '切赫 ', '费迪南德', '维迪奇' ],
            result = [];

        for (i=0 ; i<num ; i+=1) {
            result = result.concat(arr.splice([Math.floor(Math.random()*arr.length)], 1));
        }

        return result;
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
    function render (array, key) {
        var wrap = lr_util.$('wrap'),
            html = '';

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
            lIn = lr_util.$('left-in'),
            lOut = lr_util.$('left-out'),
            rIn = lr_util.$('right-in'),
            rOut = lr_util.$('right-out'),
            createNum = lr_util.$('createNum'),
            clear = lr_util.$('clear'),
            search = lr_util.$('search'),
            wrap = lr_util.$('wrap'),
            div = lr_util.$t('div', wrap),
            btns = lr_util.$t('button'),
            ctrl = new CtrlArray(),
            timer = null;

        var btnEvent = function (ele, type) {
            lr_util.addHandler(ele, 'click', function () {
                var num = lr_util.trim(input.value);

                if (validate(num)) {
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
            ctrl.setArray(randomArr(15));
            render(ctrl.getArray());
        });

        lr_util.addHandler(clear, 'click', function () {
            ctrl.clear();
            render(ctrl.getArray());
        });

        lr_util.addHandler(search, 'click', function () {
            var keyword = lr_util.trim(lr_util.$('keyword').value),
                indexArr = searchTxt(ctrl.getArray(), keyword),
                els = Array.prototype.slice.call(div, 0);

            if (indexArr) {
                els.forEach(function (e, i, arr) {
                    lr_util.removeClass(e, 'found');
                });
                indexArr.forEach(function (e, i, arr) {
                    lr_util.addClass(els[e], 'found');
                });
            }

        });
    }

    function init () {
        addEvent();
    }

    init();
})();
