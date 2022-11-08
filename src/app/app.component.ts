import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { NewsService } from './service/news.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { routeAnimation } from './model/animate'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [routeAnimation]
})
export class AppComponent {
  // title = 'xueqiu';
  isSpinning = true; // 加载中
  userList = []; // 用户
  stockList = []; // 股票
  groupList = []; // 组合
  query = ""; // 搜索词
  losefocus = true; // 搜索框是否失去焦点
  searchHistory = []; // 搜索历史

  qrDown = false;

  showNav: boolean = true; // 是否显示导航栏
  loginOpen: boolean = false; // 登录组件是否打开

  @ViewChild("search") el1: ElementRef;

  constructor(public searchSer: NewsService, public message: NzMessageService, private router: Router, private location: Location) {
    console.log = function () { }
    // 监测url变化
    this.location.onUrlChange(url => {
      if (url == "/account/login") {
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let history = this.searchSer.getStorage("searchHistory");
    if (history) {
      this.searchHistory = history;
    }
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.isSpinning = false;
    }, 0);
  }

  // 返回当前路由data传值
  animationRoute(outlet: RouterOutlet) {
    // console.log(outlet?.activatedRouteData?.animation);
    return outlet?.activatedRouteData?.animation;
  }

  // 打开登录框
  openLogin() {
    this.loginOpen = true;
  }
  // 接收登录组件的传值
  closeChange(newValue) {
    this.loginOpen = newValue;
  }

  // 搜索建议
  searchSuggest(e) {
    // e = e || window.Event;

    // 用上下键选词时不发送请求
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
      return;
    }
    // 搜索框内关键词为空或按回车键时 不发送请求
    if (this.query == "") {
      this.losefocus = true;
      return;
    } else {
      this.losefocus = false;
    }

    this.searchSer.stockSuggest(this.query).then(res => {
      // 股票列表
      if (res.data == undefined) {
        return;
      }
      this.stockList = res.data;
      console.log('股票', this.stockList);
    });

    this.searchSer.userSuggest(this.query).then(res => {
      // 用户列表
      if (res.list == undefined) {
        return;
      }
      this.userList = res.list;
      console.log('用户', this.userList);
    });

    this.searchSer.groupSuggest(this.query).then(res => {
      // 组合列表
      if (res.list == undefined) {
        return;
      }
      this.groupList = res.list;
      console.log('组合', this.userList);
    });

  }

  searchBlur() {
    let that = this;
    // 鼠标弹起后隐藏建议词面板
    document.addEventListener('mouseup', function domUp() {
      that.losefocus = true;
      document.removeEventListener('mouseup', domUp);
    });
  }

  searchIt(query: any) {
    this.searchHistory.push(query);
    this.searchHistory = Array.from(new Set(this.searchHistory));
    this.searchSer.setStorage("searchHistory", this.searchHistory);
  }

  historyDelete(event: Event, index) {
    event.preventDefault();
    // 阻止事件冒泡
    event.stopPropagation();
    this.searchHistory.splice(index, 1)
    this.searchSer.setStorage("searchHistory", this.searchHistory);
    this.el1.nativeElement.focus();
  }

  historyClear() {
    this.searchHistory = [];
    this.searchSer.removeStorage("searchHistory");
    this.message.success('搜索历史已清空！', {
      nzDuration: 1000,
      nzPauseOnHover: false
    });
  }

  // 新股上市跳转
  newStockSkip() {
    // this.router.navigateByUrl('/hq#xgss');
    this.router.navigate(['/hq'], {
      fragment: "xgss" // 传hash值
    });
  }
}
