/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};

/**
 * 随机颜色
 */
function randomColor () {
  var colors = ['#66cccc', '#ccff66', '#ff99cc', '#ff9999', '#ffcc99', '#ff6666', '#ffff66', '#99cc66', '#666699', '#ff9999', '#99cc33', '#ff9900', '#ffcc00', '#ff0033', '#ff9966', '#ff9900', '#ccff00', '#cc3399', '#99cc33', '#ff6600', '#993366', '#cccc33', '#666633', '#66cccc', '#666699'];

  return colors[Math.floor(Math.random()*colors.length)];
}

/**
 * 渲染图表
 */
function renderChart() {
  var wrap = document.getElementById('chart-wrap'),
      wrapH = parseInt(lr_util.getStyle(wrap, 'height')),
      txtBox = document.getElementById('aqi-chart-info').getElementsByTagName('span')[0],
      txt = pageState.nowSelectCity !== -1 ? pageState.nowSelectCity : '',
      typestr = {
        day : '日',
        week : '周',
        month : '月'
      },
      html = '',
      type = pageState.nowGraTime,
      data = [],
      weekstr = -1, weekdata = [], weekarr = [], sumweek = 0,
      monthend = -1, date = [], montharr = [], monthdata = [], summonth = 0,
      i;

  switch (type) {
    case 'day' :
      data = chartData;
      break;
    case 'week' :
      weekstr = 7-new Date(chartData[0][0]).getDay();
      chartData.slice(0, weekstr+1).forEach(function (e, i, arr) {
        sumweek += parseInt(e[1]);
      });
      data.push([chartData[0][0]+'~'+chartData[weekstr][0], Math.round(sumweek/(weekstr+1))]);
      weekarr = chartData.slice(weekstr+1);
      while (weekarr.length > 0) {
        sumweek = 0;
        weekdata = [];
        weekdata[0] = weekarr[0][0]+'~'+weekarr[weekarr.length<7?weekarr.length-1:6][0];
        for (i=0 ; i<7 ; i+=1) {
          if (!weekarr[i]) {
            break;
          }
          sumweek += parseInt(weekarr[i][1]);
        }
        weekdata[1] = Math.round(sumweek/7);
        data.push(weekdata);
        weekarr = weekarr.slice(7);
      }
      break;
    case 'month' :
      montharr = chartData.slice(0);
      while (montharr.length > 0) {
        summonth = 0;
        monthdata = [];
        date = montharr[0][0].split('-');
        monthend = new Date(date[0], date[1], 0).getDate();
        monthdata[0] = montharr[0][0]+'~'+montharr[montharr.length<monthend?montharr.length-1:monthend-1][0];
        for (i=0 ; i<monthend ; i+=1) {
          summonth += parseInt(montharr[i][1]);
        }
        monthdata[1] = Math.round(summonth/monthend);
        data.push(monthdata);
        montharr = montharr.slice(monthend);
      }
  }

  for (i=0 ; i<data.length ; i+=1) {
    html += '<div class="'+type+'" data-info="第'+(i+1)+typestr[type]+'，时间：'+
              data[i][0]+'/空气质量：'+data[i][1]+'" style="background:'+
                randomColor()+';height:'+(data[i][1]/5)+'%;width:'+
                  (100/data.length)+'%;left:'+(100/data.length)*i+'%;"></div>';
  }

  lr_util.setInnerText(txtBox, txt);
  wrap.innerHTML = html;

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  var graTime = document.getElementsByName('gra-time'),
      value = '',
      i;
  // 确定是否选项发生了变化
  for (i=0 ; i<graTime.length ; i+=1) {
    if (graTime[i].checked) {
      value = graTime[i].value;
    }
  }

  if (value !== pageState.nowGraTime) {
    pageState.nowGraTime = value;
  // 设置对应数据
    initAqiChartData();
  // 调用图表渲染函数
    renderChart();
  }

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var citySelect = document.getElementById('city-select');
  // 确定是否选项发生了变化
  if (citySelect.value !== pageState.nowSelectCity) {
    pageState.nowSelectCity = citySelect.value;
  // 设置对应数据
    initAqiChartData();
  // 调用图表渲染函数
    renderChart();
  }

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var graTime = document.getElementsByName('gra-time'),
      i;

  for (i=0 ; i<graTime.length ; i+=1) {
    lr_util.addHandler(graTime[i], 'click', graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  var citySelect = document.getElementById('city-select'),
      options = '',
      k;
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  for (k in aqiSourceData) {
    options += '<option value="'+k+'">'+k+'</option>';
  }
  citySelect.innerHTML = options;

  pageState.nowSelectCity = citySelect.value;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  lr_util.addHandler(citySelect, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  var city = document.getElementById('city-select').value,
      datas = aqiSourceData[city],
      arr = [],
      k;
  // 将原始的源数据处理成图表需要的数据格式
  for (k in datas) {
    arr.push([k, datas[k]]);
  }
  // 处理好的数据存到 chartData 中
  chartData = arr;
}

/**
 * 提示
 */
function createTooltip () {
  var tipbox = document.createElement('div'),
      body = document.getElementsByTagName('body')[0];

  tipbox.innerHTML = '<p></p><p></p>';
  tipbox.id = 'tooltip';

  body.appendChild(tipbox);
}

function showTooltip (txt, x, y) {
  var txtarr = txt.split('/'),
      tooltip = document.getElementById('tooltip'),
      ps = tooltip.getElementsByTagName('p');

  tooltip.style.display = 'block';
  tooltip.style.left = x+5;
  tooltip.style.top = y;

  lr_util.setInnerText(ps[0], txtarr[0]);
  lr_util.setInnerText(ps[1], txtarr[1]);
}

function showInfo () {
  var wrap = document.getElementById('chart-wrap'),
      tooltip = document.getElementById('tooltip');

  lr_util.addHandler(wrap, 'mousemove', function (e) {
    var event = lr_util.getEvent(e),
        target = lr_util.getTarget(event);
    if (target.parentElement.id === 'chart-wrap') {
      showTooltip(target.dataset.info, event.clientX, event.clientY);
    } else {
      tooltip.style.display = 'none';
    }
  });
  lr_util.addHandler(tooltip, 'mouseover', function (e) {
    this.style.display = 'none';
  });

}

/**
 * 初始化函数
 */
function init() {
  initCitySelector();
  initGraTimeForm();
  initAqiChartData();
  renderChart();
  createTooltip();
  showInfo();
}

init();
