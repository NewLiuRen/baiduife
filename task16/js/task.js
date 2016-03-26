/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 判断是否为空对象
 */
function isNullObj(obj){
  for(var i in obj){
      if(obj.hasOwnProperty(i)){
          return false;
      }
  }
  return true;
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var validateCity = /^[A-z\u4e00-\u9fa5]+$/g,
      validateVal = /^\d+$/g,
      city = document.getElementById('aqi-city-input'),
      cityHint = city.parentNode.nextElementSibling,
      value = document.getElementById('aqi-value-input'),
      valueHint = value.parentNode.nextElementSibling,
      data = {};

  if (validateCity.test(city.value)) {
    data.city = city.value;
    lr_util.removeClass(city, 'error');
    lr_util.setInnerText(cityHint, '');
  } else {
    lr_util.addClass(city, 'error');
    lr_util.setInnerText(cityHint, '*城市名必须为中英文字符');
  }

  if (validateVal.test(value.value)) {
    data.value = value.value;
    lr_util.removeClass(value, 'error');
    lr_util.setInnerText(valueHint, '');
  } else {
    lr_util.addClass(value, 'error');
    lr_util.setInnerText(valueHint, '*空气质量指数必须为整数');
  }

  if (data.city && data.value) {
    aqiData[data.city] = data.value;
  }

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var table = document.getElementById('aqi-table'),
      tableHead = '',
      tableBody = '';

  if (!isNullObj(aqiData)) {
    tableHead = '<thead><th>城市</th><th>空气质量</th><th>操作</th></thead>';

    for (var k in aqiData) {
      tableBody += '<tr><td>'+k+'</td><td>'+aqiData[k]+'</td><td><button>删除</button></td></tr>';
    }
  }

  table.innerHTML = tableHead + tableBody;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
  delete aqiData[city];
  renderAqiList();
}

function init() {
  var btn = document.getElementById('add-btn'),
      table = document.getElementById('aqi-table');

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  lr_util.addHandler(btn, 'click', addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  lr_util.addHandler(table, 'click', function(event) {
    var e = lr_util.getEvent(event),
        target = lr_util.getTarget(e),
        city = '';

    if (target.nodeName.toLowerCase() === 'button') {
      city = lr_util.getInnerText(target.parentElement.parentElement.firstElementChild);
      delBtnHandle(city);
    }
  });

}

init();
