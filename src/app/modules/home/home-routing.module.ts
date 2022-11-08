import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component'
import { RecommendComponent } from './components/recommend/recommend.component'
import { WeekNewsComponent } from './components/week-news/week-news.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'recommend',
        pathMatch: 'full'
      },
      {
        path: 'recommend',
        component: RecommendComponent
      },
      {
        path: 'weeknews',
        component: WeekNewsComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
