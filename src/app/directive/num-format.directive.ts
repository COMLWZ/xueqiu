import { Directive, Input, ElementRef } from '@angular/core';

// 格式化数字指令
@Directive({
  selector: '[appNumFormat]'
})
export class NumFormatDirective {

  @Input() appNumFormat;
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }
  
}

