import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  quoteList: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  zhishuPosition = 'translate(0)';
  stockIndex = 0;
  tabIndex = 0;
  hotStock = [];
  hotStockIndex = 10;
  hotStockType = 0;

  constructor(public router: Router, public route: ActivatedRoute, private stockSer: NewsService, private title: Title) {
    this.getMarket();
    this.title.setTitle('雪球');
  }

  ngOnInit(): void {
    this.getHotStock(10, 0);
  }

  getMarket() {
    this.stockSer.getMarket().then(data => {
      console.log('指数数据：', data);
      this.quoteList = data.data.items;
    }, err => {
      this.quoteList = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    });
  }

  toggleZhishu(index) {
    this.stockIndex = index;
    this.zhishuPosition = `translate(${-640 * index}px)`;
  }

  previousStock() {
    this.stockIndex--;
    if (this.stockIndex < 0) {
      this.stockIndex = 2;
    } else if (this.stockIndex > 2) {
      this.stockIndex = 0;
    }
    this.zhishuPosition = `translate(${-640 * this.stockIndex}px)`;
  }
  nextStock() {
    this.stockIndex++;
    if (this.stockIndex < 0) {
      this.stockIndex = 2;
    } else if (this.stockIndex > 2) {
      this.stockIndex = 0;
    }
    this.zhishuPosition = `translate(${-640 * this.stockIndex}px)`;
  }

  /** 
  // 热帖新闻切换
  tabEvent(index) {
    let pathList = ['recommend', 'weeknews'];
    this.tabIndex = index;
    this.router.navigate(['home', pathList[index]], {
      queryParams: {
        key: pathList[index]
      }
    });
  }
  */

  // 获取热股榜
  getHotStock(index, type) {
    if (type == 0) {
      type = index;
    } else {
      type = index + 10;
    }
    this.stockSer.getHotStock(index, type).then(res => {
      console.log('热股榜：', res);
      this.hotStock = res.data.items;
      this.hotStockIndex = index;
      this.hotStockType = type - index;
    });
  }

}

