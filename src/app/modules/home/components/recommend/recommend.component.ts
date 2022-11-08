import { Component, HostListener, OnInit } from '@angular/core';
import { NewsService } from '../../../../service/news.service';
import { ActivatedRoute } from '@angular/router';
// import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.less']
})
export class RecommendComponent implements OnInit {
  newsList = [];
  maxId;
  autoLoad = 0; // 加载次数
  reqing: boolean = false; // 是否正在请求

  constructor(public route: ActivatedRoute, public newsSer: NewsService) {
    // 初始获取热帖
    this.getMoreNews();
  }

  ngOnInit(): void {
    // fromEvent(window, 'scroll').subscribe(this.recommendLoad); rxjs 事件绑定
  }

  // 添加滚动条监听事件
  @HostListener('window:scroll')
  recommendLoad() { // 雪球热帖懒自动加载
    if (this.reqing || this.autoLoad > 3) return;
    if (this.newsList[this.newsList.length - 1] == "error") return;
    let recommend: any = document.querySelector(".recommend_container");
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

  // 获取更多热帖
  getMoreNews() {
    if (this.reqing) return;
    this.reqing = true;
    if (this.newsList[this.newsList.length - 1] == "error") this.newsList.splice(this.newsList.length - 1);
    // 每次请求15条热帖 热帖列表的热帖索引 对应骨架屏的布尔值 控制骨架屏是否显示
    let trueArr = [];
    for (let i = 0; i < 15; i++) {
      trueArr.push(true);
    }
    this.newsList.push(trueArr);

    this.newsSer.getNews(0, this.maxId).then(res => {
      this.newsList.splice(this.newsList.length - 1, 1);

      this.newsList.push(res.items);
      console.log('热帖', this.newsList);

      // 更新最大id
      this.maxId = res.next_max_id;
      this.autoLoad++;
      this.reqing = false;
    }, err => {
      this.reqing = false;
      this.newsList.splice(this.newsList.length - 1, 1);
      this.newsList.push("error");
    });
  }
}
