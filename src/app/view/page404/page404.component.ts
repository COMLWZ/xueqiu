import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.less']
})

export class Page404Component {
  public skiptime: number = 4;

  @ViewChild('tplContent') tplContent: TemplateRef<any>;

  constructor(private router: Router, private modal: NzModalService, private title: Title) {
    this.title.setTitle('404');
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.modal.confirm({
      nzTitle: '<h4>抱歉！没有找到你想要的内容~</h4>',
      nzContent: this.tplContent,
      nzOkText: null,
      nzCancelText: `取消`,
      // nzCloseIcon: 'close-circle',
      nzOnCancel: () => { clearTimeout(skip) }
    });


    let time = setInterval(() => {
      this.skiptime--;
      if (this.skiptime < 1) clearInterval(time);
    }, 1000);

    let skip = setTimeout(() => {
      this.goHome();
    }, 4000);
  }

  goHome() {
    this.modal.closeAll();
    this.router.navigate(['/'], {
      replaceUrl: true
    });
  }
}
