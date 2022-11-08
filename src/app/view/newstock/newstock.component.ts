import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NewsService } from '../../service/news.service';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  // TitleComponentOption,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  GraphicComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  GraphicComponent,
  CanvasRenderer
]);

@Component({
  selector: 'app-newstock',
  templateUrl: './newstock.component.html',
  styleUrls: ['./newstock.component.less']
})
export class NewstockComponent implements OnInit {

  industry: any = ""; // 导航栏行业类型

  breadcrumb = ['深沪股市', '<a href="hq#xgss">新股上市</a>']; // 面包屑数据
  navType: Object = {};

  stockSubscribe: any = []; // 新股申购
  stockMarket: any = []; // 新股申购
  stockAnalysis: any = []; // 新股数据解析
  stockEarnings: any = []; // 打新收益
  stockType: string; // 类型
  myChart: any;

  newstock_moduleSort = [1, 2, 3, 4]; // 新股模块排序
  lately_visit = []; // 最近访问
  nav_unfold = [0, 1]; // 打开的一级导航

  // 图表配置
  chartOption: Object = {
    color: ['rgb(0, 102, 204)', 'rgb(255, 0, 0)', 'rgb(0, 128, 0)'],
    tooltip: {},
    grid: {
      left: "0",
      top: "40px",
      right: "0",
      bottom: "80px",
      containLabel: true
    },
    legend: {
      bottom: 40,
      itemWidth: 16,
      itemHeight: 16,
      icon: 'rect',
      itemStyle: {
        borderType: 'dashed'
      },
      textStyle: {
        color: "#000",
        fontSize: 14
      },
      selectedMode: false // 'multiple'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#000',
        interval: 0, // 刻度标签文字全部显示,
        // rotate: 90
        formatter: function (value) {
          // 文字垂直显示
          return value.split('').join('\n');
        }
      }
    },
    yAxis: {
      type: "value",
      // 坐标轴刻度最小值
      // min: "dataMin"
      // y轴分割线的颜色
      splitLine: {
        lineStyle: {
          color: "rgb(241, 241, 241)"
        }
      },
      axisLabel: {
        color: "#000",
        fontsize: 12,
      },
    },
    dataset: {
      source: []
    },
    series: [{ type: 'bar', cursor: 'default' }]
  };

  params: string = "#xgss"; // 路由参数
  stockMore: Array<any> = []; // 更多
  showMore: boolean = false; // 是否展示更多
  showType: string = "more"; // 展示类型
  total: number = 30; // 数量总量
  pageIndex: number = 1; // 页码
  pageSize: number = 30; // 每页展示数据量
  queryParams = []; // 请求参数列表
  stock_obj = { 'symbol': '股票代码', 'name': '股票名称', 'current': '当前价', 'chg': '跌涨额', 'percent': '跌涨幅', 'current_year_percent': '年初至今', 'volume': '成交量', 'amount': '成交额', 'turnover_rate': '换手率', 'pe_ttm': '市盈率(TTM)', 'dividend_yield': '股息率', 'market_capital': '市值' }
  stock_lst = Object.keys(this.stock_obj);

  // 参数对象
  subscribe_obj = {
    'name': '股票简称', 'onl_subcode': '申购代码', 'onl_distr_date': '申购日期', 'actissqty': '预计发行量(万)', 'onl_actissqty': '网上发行量(万)', 'onl_sub_maxqty': '申购上限(万)', 'iss_price': '发行价', 'onl_drawlots_date': '中签号发布日'
  }
  // 参数key值列表
  subscribe_lst = Object.keys(this.subscribe_obj);

  market_obj = {
    'name': '股票简称', 'list_date': '上市日期', 'iss_price': '发行价', 'napsaft': '发行后每股净资产', 'first_open_price': '首日开盘价', 'first_percent': '首日涨跌幅', 'current': '当前价', 'percent': '今日跌涨幅', 'stock_income': '每签获利', 'pe_ttm': '市盈率'
  }
  market_lst = Object.keys(this.market_obj);

  analysis_obj = {
    'name': '股票简称'
  }
  analysis_lst = Object.keys(this.analysis_obj);

  earnings_obj = {
    'name': '股票简称', 'list_date': '上市日期', 'iss_price': '发行价', 'first_percent': '首日涨跌幅', 'current': '当前价', 'percent': '今日跌涨幅', 'stock_income': '每签获利', 'onl_lotwinrt': '中签率(%)	', 'onl_onversubrt': '网上超额认购倍速'
  }
  earnings_lst = Object.keys(this.earnings_obj);

  constructor(private stockSer: NewsService, private router: Router, private location: Location, private title: Title) {
    this.getNavData();

    // 页面刷新时location.onUrlChange 没有监测
    this.onUrlChange(this.location.path(true));

    // 监测url变化
    this.location.onUrlChange(url => {
      this.onUrlChange(url);
    });

    let moduleSort = this.stockSer.getStorage('newstock_moduleSort');
    if (moduleSort) {
      this.newstock_moduleSort = moduleSort;
    }
    let lately_visit = this.stockSer.getStorage('lately_visit');
    if (lately_visit) {
      this.lately_visit = lately_visit;
    }
    let unfold = this.stockSer.getStorage('nav_unfold');
    if (unfold) {
      this.nav_unfold = unfold;
    }
  }

  ngOnInit(): void {
    // if(!this.myChart){
    //   try {
    //     this.myChart = echarts.init(document.querySelector('.newstock_main .stock_chart'));
    //   } catch (error) { }
    // }
  }

  // 页面路径变化处理
  onUrlChange(url: string) {
    url = decodeURI(url); // 中文解码
    if (this.params == url) return; // 防止重复请求
    if (url == "/hq#xgss") {
      this.getStockData();
      this.showMore = false;
      this.params = url;
      this.breadcrumb = ['深沪股市', '<a href="hq#xgss">新股上市</a>'];
      this.title.setTitle("新股上市" + " - 雪球");
      return;
    }
    this.urlHash(url);

    this.total = 0;
    this.pageIndex = 1;
    this.showMore = true;
    this.showType = "all";
    if (/.*secondName=xgss.*/.test(url)) {
      this.showType = "more";
    }
    this.params = url;

    let exchange, type, ind_code;
    try {
      exchange = /exchange=(.*?)&/.exec(this.params)[1];
    } catch (error) { }
    try {
      type = /type=(.*?)&/.exec(this.params)[1];
    } catch (error) { }
    try {
      ind_code = /level2code=(.*?)$/igs.exec(this.params)[1];
    } catch (error) { }

    this.queryParams = [exchange, type, ind_code];
    // console.log(this.queryParams);
    this.pageSizeChange(this.pageSize, 'flag');
    this.title.setTitle(this.breadcrumb[0] + " - 行情" + " - 雪球");
  }

  // 路径哈希值处理 并设置页面title
  urlHash(url: string) {
    let firstName, secondName, plate;
    try {
      firstName = /firstName=(.*?)$/.exec(url)[1];
      if (firstName) {
        try {
          firstName = /firstName=(.*?)&/.exec(url)[1];
        } catch (error) { }
      }
    } catch (error) { }
    try {
      secondName = /secondName=(.*?)$/.exec(url)[1];
      if (secondName) {
        try {
          secondName = /secondName=(.*?)&/.exec(url)[1];
        } catch (error) { }
      }
    } catch (error) { }
    try {
      plate = /plate=(.*?)&/.exec(url)[1];
    } catch (error) { }

    if (firstName > 0) {
      firstName = this.navType[firstName];
    } else if (firstName == undefined) {
      try {
        firstName = /#(.*?)$/.exec(url)[1];
      } catch (error) {
        firstName = "内部交易";
      }
    }
    secondName = this.navType[secondName];
    plate = this.navType[plate];
    this.breadcrumb = [firstName];
    if (secondName != undefined) {
      this.breadcrumb.push(secondName);
      if (plate != undefined) {
        this.breadcrumb.push(plate);
      }
    }
    this.title.setTitle(this.breadcrumb[0] + " - 行情" + " - 雪球");
  }

  // 获取导航栏数据
  getNavData() {
    this.industry = "数据加载中...";
    this.stockSer.getIndustry().subscribe((data: any) => {
      console.log('行业类型：', data);
      this.industry = data.html;
      this.navType = JSON.parse(data.type);
      if (this.breadcrumb[0] == undefined) {
        this.urlHash(this.location.path(true));
      }

      setTimeout(() => {
        let ul: any = document.querySelector(".industry_nav .nav0").nextElementSibling;
        let addClear = () => {
          if (ul.firstChild.textContent == "暂无访问") {
            let li = document.createElement('li');
            li.className = "removeAll";
            li.innerHTML = "清空";
            li.onclick = () => {
              ul.previousSibling.classList.remove('active');
              ul.innerHTML = "<li>暂无访问</li>";
              this.lately_visit = [];
              this.stockSer.removeStorage('lately_visit');
              this.nav_unfold.splice(0, 1);
              this.stockSer.setStorage('nav_unfold', this.nav_unfold);
            }
            ul.replaceChild(li, ul.firstChild);
          }
        }

        let close = ($event) => {
          $event.remove();;
          let index = this.lately_visit.indexOf($event.outerHTML);
          this.lately_visit.splice(index, 1);
          this.stockSer.setStorage('lately_visit', this.lately_visit);
          if (ul.children.length == 1) {
            ul.previousSibling.classList.remove('active');
            ul.innerHTML = ul.innerHTML = "<li>暂无访问</li>";
            this.nav_unfold.splice(0, 1);
            this.stockSer.setStorage('nav_unfold', this.nav_unfold)
          }
        }

        this.lately_visit.forEach(item => {
          addClear();
          let li = document.createElement('li');
          li.innerHTML = item;
          li.querySelector('.close').addEventListener('click', () => {
            close(li);
          });
          ul.insertBefore(li, ul.firstChild);
        });
        document.querySelectorAll('.industry_nav .first-nav').forEach((nav: any, index) => {
          this.nav_unfold.forEach(item => {
            if (index == item) {
              nav.classList.add('active');
            }
          });
          nav.onclick = () => {
            nav.classList.toggle('active');
            if (nav.classList.contains('active') == true) {
              this.nav_unfold.push(index);
            } else {
              this.nav_unfold.splice(index, 1);
            }
            this.nav_unfold.sort();
            this.stockSer.setStorage('nav_unfold', this.nav_unfold);
          }
        });

        document.querySelectorAll('.industry_nav a').forEach((a: any) => {
          a.onclick = () => {
            event.preventDefault();
            let params = a.getAttribute('href');
            this.router.navigateByUrl(`/hq${params}`);

            addClear();
            let html = '<i class="list-style"></i>' + a.outerHTML + '<span class="close"></span>';
            if (this.lately_visit.indexOf(html) == -1) {
              if (this.lately_visit.length > 6) {
                this.lately_visit.splice(6, this.lately_visit.length);
                ul.lastChild.previousSibling.remove();
              }
              if (ul.children.length == 1) ul.previousSibling.classList.add('active');
              let li = document.createElement('li');
              li.innerHTML = html;
              li.querySelector('.close').addEventListener('click', () => {
                close(li);
              });
              ul.insertBefore(li, ul.firstChild);

              // this.lately_visit.unshift(html); 
              this.lately_visit.push(html);
              // this.lately_visit = Array.from(new Set(this.lately_visit));
              this.stockSer.setStorage('lately_visit', this.lately_visit);
            }

            document.querySelectorAll('.industry_nav .third-nav').forEach((item: any) => {
              item.style.display = 'none'; // 点击后隐藏第三级面板
              setTimeout(() => {
                item.style.display = '';
              }, 0);
            });
          }
        });
      }, 0);
    }, err => {
      // console.error('错误====>', err);
      this.industry = `请求失败了>_< <br/><a class='error'>点击这里</a>或刷新页面重试~`;
      setTimeout(() => {
        let a: any = document.querySelector('.industry_nav .error');
        a.onclick = () => {
          this.getNavData();
        }
      }, 0);
    });
  }

  // 获取股票数据
  getStockData() {
    try {
      if (this.stockSubscribe.length > 0 && this.stockMarket.length > 0 && this.stockAnalysis.length > 0 && this.stockEarnings.length > 0) return;
    } catch (error) { }
    this.stockSubscribe = null, this.stockMarket = null, this.stockAnalysis = null, this.stockEarnings = null;
    this.stockSer.getStockPreipo('onl_subbeg_date', 'asc', 'subscribe').subscribe((data: any) => {
      console.log('新股申购：', data)
      this.stockSubscribe = data.data.items;
    }, err => {
      this.stockSubscribe = -1;
    });

    this.stockSer.getStockPreipo('list_date', 'desc', 'quote').subscribe((data: any) => {
      // console.log('新股行情：', data);
      this.stockMarket = data.data.items;
    }, err => {
      this.stockMarket = -1;
    });

    this.stockSer.getStockPreipo('list_date', 'desc', 'quote', 30).subscribe((data: any) => {
      // console.log('新股数据解析：', data);
      this.stockAnalysis = data.data.items;
      try {
        this.myChart = echarts.init(document.querySelector('.newstock_main .stock_chart'));
      } catch (error) { }
      this.chartToggle(0);
    }, err => {
      this.stockAnalysis = -1;
    });

    this.stockSer.getStockPreipo('list_date', 'desc', 'income').subscribe((data: any) => {
      // console.log('打新收益：', data);
      this.stockEarnings = data.data.items;
    }, err => {
      this.stockEarnings = -1;
    });
  }

  // 返回列表中所有对象key对应的值列表
  handleList(list: Array<any>, lst: Array<any>, key: string, ...keyList): Array<any> {
    let result = [];
    list.forEach((data: any) => {
      let lst = [data['name'], this.handleNull(data[key])];
      keyList.forEach(k => {
        lst.push(this.handleNull(data[k]));
      });
      result.push(lst);
    });
    return lst.concat(result);
  }
  handleNull(value: any): string {
    if (value == null || value == undefined) {
      return '0.00';
    }
    return value.toFixed(2);
  }
  // 图表切换
  chartToggle(index: number, $event?) {
    if ($event) {
      let all: any = $event.target.parentNode.querySelectorAll('a');
      all.forEach(a => {
        a.classList.remove('selected');
      });
      $event.target.classList.add('selected');
    }

    let sourceData;
    if (index == 0) {
      sourceData = [['product', '网上中签率(%)']];
      this.stockAnalysis.forEach((data: any) => {
        sourceData.push([data.name, this.handleNull(data['onl_lotwinrt'] * 100)]);
      });
      this.chartOption['series'] = [{ type: 'bar', label: { show: true, position: 'top', distance: 2, color: '#000', fontSize: 10 } }];
      this.chartOption['legend'].selectedMode = false;
    } else if (index == 1) {
      sourceData = [['product', '首日涨幅%', '换手率%']];
      sourceData = this.handleList(this.stockAnalysis, sourceData, 'first_percent', 'first_turnrate');
      this.chartOption['series'] = [{ type: 'bar' }, { type: 'bar' }];
      this.chartOption['legend'].selectedMode = 'multiple';
    } else if (index == 2) {
      sourceData = [['product', '发行价(元)', '首日开盘价(元)', '首日收盘价(元)']];
      sourceData = this.handleList(this.stockAnalysis, sourceData, 'iss_price', 'first_open_price', 'first_close_price');
      this.chartOption['series'] = [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }];
      this.chartOption['legend'].selectedMode = 'multiple';
    } else if (index == 3) {
      sourceData = [['product', '实际募资总额(亿元)']];
      this.stockAnalysis.forEach((data: any) => {
        sourceData.push([data.name, this.handleNull(data['acttotraiseamt'] / 10000)]);
      });
      this.chartOption['series'] = [{ type: 'bar' }];
      this.chartOption['legend'].selectedMode = false;
    } else {
      sourceData = [['product', '每签获利(元)']];
      sourceData = this.handleList(this.stockAnalysis, sourceData, 'stock_income');
      this.chartOption['series'] = [{ type: 'bar' }];
      this.chartOption['legend'].selectedMode = false;
    }

    this.chartOption['dataset'].source = sourceData;
    if (!this.myChart) {
      return;
    }
    this.myChart.clear();
    this.myChart.setOption(this.chartOption);
  }

  // 获取更多
  getMoreStock($event, type?) {
    $event.preventDefault();
    this.pageIndex = 1;
    this.showMore = true;
    this.showType = "more";

    if (type == '新股申购') {
      this.stockType = '新股申购';
    } else if (type == '新股行情') {
      this.stockType = '新股行情';
    } else {
      this.stockType = '打新收益';
    }
    let params = $event.currentTarget.getAttribute('href');
    this.router.navigateByUrl(`/hq${params}`);
  }

  // 展示数量改变 / 页码改变
  pageSizeChange(size: number, type?, $event?) {
    if ($event) {
      if ($event.target.classList.contains('selected') && this.stockMore.length > 0) {
        return;
      }
    }
    this.pageSize = size;
    if (type) {
      this.stockMore = null;
      this.pageIndex = 1;
    }
    if (this.showType == "more") {
      let order_by, order, type;
      if (this.stockType == '新股申购') {
        order_by = 'onl_subbeg_date';
        order = 'asc';
        type = 'subscribe';
        this.breadcrumb = ['深沪股市', '<a href="hq#xgss">新股上市</a>', '新股申购'];
      } else if (this.stockType == '新股行情') {
        order_by = 'list_date';
        order = 'desc';
        type = 'quote';
        this.breadcrumb = ['深沪股市', '<a href="hq#xgss">新股上市</a>', '新股行情']
      } else {
        order_by = 'list_date';
        order = 'desc';
        type = 'income';
        this.breadcrumb = ['深沪股市', '<a href="hq#xgss">新股上市</a>', '打新收益']
      }
      this.stockSer.getStockPreipo(order_by, order, type, this.pageSize, this.pageIndex).subscribe((data: any) => {
        // console.log(`股票列表${this.pageIndex}：`, data);
        this.stockMore = data.data.items;
        this.total = data.data.count;
      }, err => {
        this.stockMore = [];
      });
    } else {
      let exchange = this.queryParams[0];
      let type = this.queryParams[1];
      let ind_code = this.queryParams[2];
      this.stockSer.getStockQuote(exchange, type, this.pageSize, this.pageIndex, ind_code).subscribe((data: any) => {
        // console.log(`股票详情${this.pageIndex}：`, data);
        this.stockMore = data.data.list;
        this.total = data.data.count;
        console.log(this.stockMore);

      }, err => {
        // console.log(err);
        this.stockMore = [];
      });
    }
  }

  // 获取子组件传来的值 e即改变的页码数
  getChildMsg(e) {
    this.pageIndex = e;
    this.pageSizeChange(this.pageSize);
  }

  // 模块上移/下移
  arrowMove($event, der) {
    let moveDiv = $event.currentTarget.parentNode.parentNode.parentNode;
    let allDiv = moveDiv.parentNode.children;
    let order = parseInt(moveDiv.style.order);

    if (der == 'up') {
      if (order > 1) {
        moveDiv.style.order = order - 1;
      }
    } else {
      if (order < 4) {
        moveDiv.style.order = order + 1;
      }
    }
    let sortLst = [];
    for (let i = 0; i < allDiv.length; i++) {
      if (allDiv[i] != moveDiv) {
        if (allDiv[i].style.order == moveDiv.style.order) {
          allDiv[i].style.order = order; // 实现对调两个div顺序
        }
      }
      if (allDiv[i].style.order == 1) {
        allDiv[i].querySelector('.up').classList.add('up_no');
      } else if (allDiv[i].style.order == 4) {
        allDiv[i].querySelector('.down').classList.add('down_no');
      } else {
        // document.querySelector('a')
        allDiv[i].querySelector('.up').classList.remove('up_no');
        allDiv[i].querySelector('.down').classList.remove('down_no');
      }
      sortLst.push(allDiv[i].style.order);
    };
    this.newstock_moduleSort = sortLst;
    this.stockSer.setStorage('newstock_moduleSort', this.newstock_moduleSort);
  }

}
