import { Component, OnInit, HostListener } from '@angular/core';
import { NewsService } from '../../../../service/news.service';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-week-news',
  templateUrl: './week-news.component.html',
  styleUrls: ['./week-news.component.less']
})
export class WeekNewsComponent implements OnInit {
  weekNews = [];
  maxId;
  newsTime = new Date();
  mouthObj = {
    1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月', 7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月'
  };
  autoLoad = 0; // 加载次数
  reqing: any = false; // 是否正在请求

  constructor(public route: ActivatedRoute, public newsSer: NewsService) {
    // 初次获取周新闻
    this.getMoreNews();
  }

  ngOnInit(): void {
  }

  // 添加滚动条监听事件
  @HostListener('window:scroll')
  recommendLoad() { // 雪球热帖自动加载
    if (this.reqing || this.autoLoad > 3) return;
    let recommend: any = document.querySelector(".weekNews");
    let offsetTop = recommend.offsetTop;
    let height = recommend.offsetHeight;

    //scrollTop的值
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //窗口可视化高度
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(parseInt(scrollTop.toString()), '========', (height + offsetTop - clientHeight));

    if (scrollTop >= (height + offsetTop - clientHeight)) {
      this.getMoreNews();
    }
  }

  numToMouth(num) {
    return this.mouthObj[num];
  }

  // 获取更多热帖
  getMoreNews() {
    if (this.reqing == true) return;
    this.reqing = true;
    this.newsSer.getNews(1, this.maxId).then(res => {
      console.log('7*24：', res);
      let reg = /com\/(.*?)\//;
      res.items.forEach(item => {
        // 遍历数据并筛选出用户id
        item['user_id'] = reg.exec(item.target)[1];
      });
      this.weekNews = this.weekNews.concat(res.items);
      this.maxId = res.next_max_id;
      this.autoLoad++;
      this.reqing = false;
    }, err => {
      this.reqing = "error";
    });
  }
}
