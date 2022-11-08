import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NewsService } from '../../../service/news.service';

@Component({
  selector: 'app-stock-screener',
  templateUrl: './stock-screener.component.html',
  styleUrls: ['./stock-screener.component.less']
})
export class StockScreenerComponent implements OnInit {

  @Input() type: string;

  industriesList = []; // 行业
  areas = {}; // 地区对象
  areaKey = []; // 地区key值
  conditions = { '财务报表': { 0: '利润率', 1: '每股数据', 2: '资产负债率', 3: '资金流量表' } }; // 筛选条件对象
  conditionKey = []; // 筛选条件key值
  conditionIcons = ['sliders', 'pie-chart', 'fund', 'file-text', 'copyright']; // 图标名
  currentTab = "基本指标"; // 当前nav
  nzActives = [true, true, false, false];
  screenList = []; // 已选中的筛选条件
  exchange = 'sh_sz'; //市场
  areacode = ''; //地域
  indcode = ''; // 行业
  stocks = { count: 0, list: [] };
  pageIndex = 0; //筛选结果页码
  conditionName = []; //筛选指标名称
  conditionValue = [] // 筛选值
  isDrag = false; // 鼠标是否开始拖动
  svgX = 0; // svg的x值
  msX = 0; // 鼠标x轴坐标
  svgIndex = 0; // svg被拖动图标索引
  scope = ""; // 拖动时判断要改变的大小值
  reqOptions = { page: 1 }; // 筛选股票请求参数
  stockRank = {}; // 股票排行
  orderBy = "follow"; // 股票类型
  week = '7d'; // 最热或本周新增
  stockFilter = {}; // 股票排行榜2
  filterType = ""; // select框股票排行的类型
  oldfilterType = ""; // select框股票排行的上一次所选类型
  filterOrder = "desc"; // 升降序
  filterName = ""; // select选中文本
  topScroll = false; // 筛选结果上方滚动条是否拖拽
  topScrollX = 0; // 记录鼠标按下时的X轴位置

  constructor(private screenerSer: NewsService, private title: Title) {}

  ngOnInit(): void {
    if (this.type == "CN") {
      this.title.setTitle("股票筛选器 _ 沪股股票信息 _ 雪球");
    } else if (this.type == "HK") {
      this.title.setTitle("股票筛选器 _ 港股股票信息 _ 雪球");
    } else {
      this.title.setTitle("股票筛选器 _ 美股股票信息 _ 雪球");
    }

    if (this.type == "CN") {
      this.screenerSer.getAreas().then(res => {
        console.log('地区', res.data);
        this.areas = res.data.areas;
        // 用对象的key值遍历对象
        this.areaKey = Object.keys(this.areas);
      });
    }
    this.screenerSer.getIndustries(this.type).then(res => {
      console.log('行业', res.data);
      this.industriesList = res.data.industries;
    });
    this.screenerSer.getConditions(this.type).then(res => {
      console.log('筛选条件', res);
      this.conditions = res;
      this.conditionKey = Object.keys(this.conditions);

      this.conditionKey.forEach(item => {
        // 第四个对象没处理
        this.conditions[item].forEach(obj => {
          if (obj.adj != 0) {
            obj.field += '.20210630';
            obj.adj = 0;
          }
        });
      });
      // 默认选择第一个 选中的值和器其对应的文本
      this.filterType = this.conditions[this.conditionKey[0]][0]['field'];
      this.filterName = this.conditions[this.conditionKey[0]][0]['name'];
      this.stockFilter['name'] = this.filterName;
      this.getStockFilter(this.filterOrder); // 需要传入筛选条件 所以要获取条件之后再调用请求

    });

    // 右部分上下两个股票排行
    this.getStockRank('follow');
  }

  // 导航切换
  toggleTabs(key) {
    this.currentTab = key;
  }

  // 展开收起
  toggleCollapse(index) {
    this.nzActives[index] = !this.nzActives[index];
  }

  // 多选框选择获取筛选字段
  async checkEvent($event, obj) {
    this.screenList.forEach((item, index) => {
      if (item.field == obj.field) {
        // 如果已存在则去除
        this.screenList.splice(index, 1);
      }
    });
    if ($event.target.checked != true) {
      if ($event.target.getAttribute("not_allow") == "true") {
        // 发送请求期间不允许改变复选框状态
        $event.target.checked = "checked";
      }
      return;
    } else {
      // 发送请求 给复选框添加自定义属性用于判断
      $event.target.setAttribute("not_allow", "true");
    }

    if (obj.adj != 0) {
      obj.field += '.20210630';
      obj.adj = 0;
    }

    let result = await this.screenerSer.getFieldRange(this.type, obj.field);
    // console.log('筛选范围：', result.data);
    $event.target.setAttribute("not_allow", "false"); // 请求结束后设置自定义属性为false
    obj.min = this.decimals(result.data.min);
    obj.max = this.decimals(result.data.max);
    obj.setmin = this.decimals(result.data.min);
    obj.setmax = this.decimals(result.data.max);
    obj.has_date = result.data.has_date;
    this.screenList.push(obj);
    console.log('筛选范围：', this.screenList);
  }

  // 删除筛选条件
  delete(index, id) {
    this.screenList.splice(index, 1);
    let checkbox: any = document.getElementById(id);
    checkbox.checked = false;
  }

  // 重置筛选条件
  reset() {
    this.screenList = [];
    let checkboxes: any = document.querySelectorAll(".condition_list input[type='checkbox']");
    checkboxes.forEach(item => {
      item.checked = false;
    });
  }

  // 保留小数点后两位
  decimals(num: number): number {
    let result = Math.round(num * 100) / 100;
    return result;
  }

  // 选股
  async selectStock() {
    document.getElementById('searchTip').innerText = "正在查找股票 ...";
    // 筛选股票请求参数
    let options = {
      category: this.type,
      exchange: this.exchange,
      areacode: this.areacode,
      indcode: this.indcode,
      order_by: 'symbol',
      order: 'desc',
      page: 1,
      size: 30,
      only_count: 0,
      current: '',
      pct: '',
      _: new Date().getTime()
    }

    // 重新筛选清空筛选值
    this.conditionName = [];
    this.conditionValue = [];
    this.screenList.forEach((item, index) => {
      this.conditionName.push(item.name);
      this.conditionValue.push(item.field.split('.')[0]);

      // 每次新的查找提取配置参数
      options[item.field] = item.setmin + "_" + item.setmax;
      // if (item.setmax > item.setmin) {
      //   options[item.field] = item.setmin + "_" + item.setmax;
      // } else {
      //   options[item.field] = item.setmax + "_" + item.setmin;
      // }
    });

    // 如果没筛选条件 设置默认条件
    if (this.conditionValue.length == 0) {
      options['mc'] = "";
      options['volume'] = "";
      this.conditionName.push('总市值', '本日成交量');
      this.conditionValue.push('mc', 'volume');
    }
    this.pageIndex = 1;
    this.reqOptions = options; // 查找请求后替换请求参数
    let stock;
    try {
      stock = await this.screenerSer.getSelectStock(options);
    } catch (error) {
      this.stocks = { count: 0, list: [] };
      document.getElementById('searchTip').innerHTML = "<span style='color: red;'>网络错误！</span>";
      return;
    }

    if (stock.data.count) {
      this.stocks = stock.data;
    } else {
      // 参数错误返回为空的结果
      this.stocks = { count: 0, list: [] };
    }

    if (this.stocks.count < 1) {
      document.getElementById('searchTip').innerHTML = "<span style='color: red;'>没有找到符合条件的股票</span>";
    }
    console.log('筛选的股票：', this.stocks);
  }

  // 页码改变回调 
  async PageIndexChange() {
    let anchor = document.getElementById("stock_anchor"); // 锚点
    let top = anchor.offsetTop - 20;
    let scroll = setInterval(() => {
      if (document.documentElement.scrollTop > top) {
        document.documentElement.scrollTop -= 25;
      } else {
        clearInterval(scroll);
      }
    }, 5);
    this.reqOptions.page = this.pageIndex;
    let stock = await this.screenerSer.getSelectStock(this.reqOptions);
    this.stocks = stock.data;
    console.log(`第${this.pageIndex}页：`, this.stocks);
  }

  // svg图片拖动改变条件范围
  msDown($event, index, scope) {
    this.isDrag = true;
    $event.preventDefault(); // 取消鼠标默认事件
    $event.target.setAttribute('class', "moveSvg"); // 增加类名用于在鼠标移动时找到这个svg
    this.svgX = parseFloat($event.target.getAttribute('x'));
    this.msX = $event.clientX;
    this.svgIndex = index;
    this.scope = scope;
  }
  @HostListener('window: mousemove')
  msMove($event) {
    if (!this.isDrag) return;

    let e = $event || event;
    let moveX = e.clientX;
    let x = moveX - this.msX;
    if (x < 0) {
      x += this.svgX;
      if (x < 0) x = 0;
    } else if ((x += this.svgX) > 150) {
      x = 150;
    }
    document.querySelector('.moveSvg').setAttribute('x', x.toString());

    let min = this.screenList[this.svgIndex].min;
    let max = this.screenList[this.svgIndex].max;
    let range = max - min;
    let set;
    let pct = x / 150;
    set = range * pct + min;

    set = this.decimals(set);
    if (this.scope == "min") {
      this.screenList[this.svgIndex].setmin = set;
    } else {
      this.screenList[this.svgIndex].setmax = set;
    }
  }
  @HostListener('window: mouseup')
  msUp() {
    if (this.isDrag) {
      document.querySelector('.moveSvg').removeAttribute('class');
      this.isDrag = false;
    }
  }

  // 设置范围输入框失去焦点时同时改变对应svg的位置
  setRangeBlur(index, scope) {
    let min = this.screenList[index].min;
    let range = this.screenList[index].max - min;
    if (scope == "min") {
      let setmin = this.screenList[index].setmin;
      if (isNaN(setmin)) {
        return;
      }
      let pct = (setmin - min) / range; // 输入数值所占百分比
      if (pct > 1) {
        pct = 1;
      } else if (pct < 0) {
        pct = 0;
      }
      // 设置对应svg图片位置
      document.querySelector("#minSvg" + index).setAttribute("x", (150 * pct).toString());
    } else {
      let setmax = this.screenList[index].setmax;
      if (isNaN(setmax)) {
        return;
      }
      let pct = (setmax - min) / range;
      if (pct > 1) {
        pct = 1;
      } else if (pct < 0) {
        pct = 0;
      }
      document.querySelector("#maxSvg" + index).setAttribute("x", (150 * pct).toString())
    }
  }

  // 获取股票排行 最热或本周新增股票
  async getStockRank(order_by, week?) {
    this.orderBy = order_by;
    if (week != undefined) {
      this.week = week;
    }
    let name;
    switch (order_by) {
      case 'tweet':
        name = '讨论数';
        break;
      case 'deal':
        name = '交易数';
        break;
      default:
        name = '关注数';
        break;
    }
    try {
      let result = await this.screenerSer.getStockRank(this.type, order_by + this.week);
      console.log('股票排行上', result.data);
      this.stockRank = result.data;
      this.stockRank['name'] = name;
    } catch (error) {
      return;
    }
  }

  // 获取股票排行 不同类型股票
  async getStockFilter(order, $event?) {
    this.filterOrder = order;
    if ($event) {
      // 获取选中的select框的文本值
      let index = $event.target.selectedIndex;
      this.filterName = $event.target[index].text;
    }

    try {
      let result = await this.screenerSer.getStockRank(this.type, this.filterType, this.filterOrder);
      this.oldfilterType = this.filterType;
      console.log('股票排行下', result.data);
      this.stockFilter = result.data;
      this.stockFilter['name'] = this.filterName;
    } catch (error) {
      // 错误则不改变选择的类型
      this.filterType = this.oldfilterType;
      return;
    }
  }

  borderTip($event) {
    let allTr: any = document.querySelectorAll(".stock_list tr");
    allTr.forEach(tr => {
      tr.removeAttribute("class", "tips");
    });
    $event.currentTarget.setAttribute("class", "tips");
  }
}

