import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.less']
})
export class StockTableComponent implements OnInit {

  @Input() type: string; // 表格类型
  @Input() listData: Array<any>; // 股票数据列表
  @Input() obj: Object; // 数据key值与对应名称
  @Input() lst: Array<any>; // key值列表

  @Input() pageSize: number; // 展示数据数量
  @Input() total: number; // 数据总量
  @Input() pageIndex: number;  // 当前页

  @ViewChild("stockTop") stockTop: ElementRef;

  @Output() private outer = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    
  }

  PageIndexChange() {
    // let top = this.stockTop.nativeElement.offsetTop - 100;
    let h = this.stockTop.nativeElement.offsetHeight / 10;
    let scroll = setInterval(() => {
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTop -= h;
      } else {
        clearInterval(scroll);
      }
    }, 5);

    this.outer.emit(this.pageIndex); // 页码改变发送给父组件
  }
}
