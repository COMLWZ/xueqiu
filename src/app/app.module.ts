import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NewstockComponent } from './view/newstock/newstock.component';
import { ScreenerComponent } from './view/screener/screener.component';
import { CNComponent } from './component/screener/cn/cn.component';
import { HKComponent } from './component/screener/hk/hk.component';
import { USComponent } from './component/screener/us/us.component';
import { StockScreenerComponent } from './component/screener/stock-screener/stock-screener.component';
import { CommentComponent } from './view/comment/comment.component';
import { Page404Component } from './view/page404/page404.component';
import { StockTableComponent } from './component/stockTable/stock-table/stock-table.component';
import { LoginComponent } from './component/login/login.component';

// 引入ng-zorro模块
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular'
import { SlidersTwoTone, FundTwoTone, PieChartTwoTone, FileTextTwoTone, RightCircleTwoTone, RocketTwoTone, DeleteFill, CopyrightTwoTone, LikeTwoTone, LikeOutline, DislikeTwoTone, DislikeOutline, LinkOutline, UserOutline, SmileOutline, DollarOutline, PayCircleOutline, PictureOutline, ShareAltOutline, StarOutline, WeiboOutline, WechatOutline, TransactionOutline, MessageOutline, EyeOutline, ClearOutline, HistoryOutline, RightOutline, DoubleRightOutline, DoubleLeftOutline, WarningFill } from '@ant-design/icons-angular/icons';
// nz图标
const icons: IconDefinition[] = [SlidersTwoTone, FundTwoTone, PieChartTwoTone, FileTextTwoTone, RightCircleTwoTone, RocketTwoTone, DeleteFill, CopyrightTwoTone, LikeTwoTone, LikeOutline, DislikeTwoTone, DislikeOutline, LinkOutline, UserOutline, SmileOutline, DollarOutline, PayCircleOutline, PictureOutline, ShareAltOutline, StarOutline, WeiboOutline, WechatOutline, TransactionOutline, MessageOutline, EyeOutline, ClearOutline, HistoryOutline, RightOutline, DoubleRightOutline, DoubleLeftOutline, WarningFill];

// 引入自定义管道
import { MyriabitPipe, RemoveDotPipe, RoundUpPipe, HandnullPipe, PctJudgePipe, SafeHtmlPipe, SplitUrlPipe, } from './filter/my-pipe.pipe';
// 自定义指令
import { NumFormatDirective } from './directive/num-format.directive';
// 服务
import { NewsService } from './service/news.service';

// ng-zorro模块
const NzModules = [
  NzSpinModule,
  NzCheckboxModule,
  NzInputModule,
  NzSkeletonModule,
  NzListModule,
  NzSpaceModule,
  NzDividerModule,
  NzGridModule,
  NzBackTopModule,
  NzCommentModule,
  NzCollapseModule,
  NzPaginationModule,
  NzImageModule,
  NzResultModule,
  NzButtonModule,
  NzModalModule,
  NzAvatarModule,
  NzPopconfirmModule,
  NzMessageModule,
  NzTableModule,
  NzAutocompleteModule,
  NzFormModule,
  NzBreadCrumbModule,
  NzIconModule.forRoot(icons) // 注册ng-zorro图标
]

// 自定义管道
const myPipe = [
  MyriabitPipe,
  RemoveDotPipe,
  RoundUpPipe,
  HandnullPipe,
  PctJudgePipe,
  SafeHtmlPipe,
  SplitUrlPipe,
]

@NgModule({
  declarations: [
    AppComponent,
    NewstockComponent,
    ScreenerComponent,
    CNComponent,
    HKComponent,
    USComponent,
    StockScreenerComponent,
    CommentComponent,
    Page404Component,
    StockTableComponent,
    LoginComponent,
    ...myPipe,
    // NumFormatDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ...NzModules
  ],
  providers: [NewsService], // 注入服务
  bootstrap: [AppComponent]
})

export class AppModule { }