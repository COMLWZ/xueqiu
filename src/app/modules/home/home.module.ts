import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RecommendComponent } from './components/recommend/recommend.component';
import { WeekNewsComponent } from './components/week-news/week-news.component';
import { HandnullPipe, SplitUrlPipe } from '../filter/my-pipe.pipe'
// 引入ng-zorro模块
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [
    HomeComponent,
    RecommendComponent,
    WeekNewsComponent,
    HandnullPipe,
    SplitUrlPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzSpinModule,
    NzSkeletonModule,
    NzBackTopModule,
    NzResultModule
  ]
})
export class HomeModule { }
