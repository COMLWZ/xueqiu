import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewstockComponent } from './view/newstock/newstock.component';
import { ScreenerComponent } from './view/screener/screener.component';
import { CNComponent } from './component/screener/cn/cn.component';
import { HKComponent } from './component/screener/hk/hk.component';
import { USComponent } from './component/screener/us/us.component';
import { CommentComponent } from './view/comment/comment.component';
import { LoginComponent } from './component/login/login.component';
import { Page404Component } from './view/page404/page404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    data: { animation: 'home' }
  },
  {
    path: 'screener',
    component: ScreenerComponent,
    data: { animation: 'screener' },
    children: [
      {
        path: '',
        redirectTo: 'CN',
        pathMatch: 'full'
      },
      {
        path: 'CN',
        component: CNComponent
      },
      {
        path: 'HK',
        component: HKComponent
      },
      {
        path: 'US',
        component: USComponent
      }
    ]
  },
  {
    path: 'hq',
    component: NewstockComponent,
    data: { animation: 'hq' },
  },
  {
    path: 'account/login',
    component: LoginComponent
  },
  {
    path: ':userId/:postId',
    component: CommentComponent
  },
  {
    path: '**',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
