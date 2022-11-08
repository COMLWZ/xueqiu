import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';


@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(public sanitizer: DomSanitizer) { }

  public transform(html: string, type?): any {
    switch (type) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(html);
      default:
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

}


@Pipe({
  name: 'handnull'
})
export class HandnullPipe implements PipeTransform {

  // 处理null undefined
  transform(value: any, type): string {
    if (type == 1) {
      if (value == "null%" || value == "NaN%" || value == "-%" || value == "0.00%") {
        return "-";
      }
    } else if (type == 2) {
      if (value == null || value == undefined) {
        return "";
      }
    }
    if (value == "null%" || value == "NaN%" || value == "-%") {
      return "-";
    }
    return value;
  }

}


@Pipe({
  name: 'myriabit'
})
export class MyriabitPipe implements PipeTransform {

  // 保留两位小数
  transform(num: number, type): any {
    if (num == undefined || num == null || num == NaN) {
      return "-";
    }
    if (typeof (num) != 'number') return num;
    if (type == 0) {
      if (num > 0) {
        return '+' + num.toFixed(2);
      }
      return num.toFixed(2);

    }
    if (type == 1) {
      if (num < 0.01 && num > 0) return (num * 100).toFixed(2);
      if (num > (10 ** 12)) {
        // 粗略判断并转换时间
        return new DatePipe('en-US').transform(num, 'YYYY-MM-dd');
      }
      return num.toFixed(2);
    }


    // 万位 亿位 万亿四舍五入保留两位小数
    if (num >= (10 ** 12)) {
      num = Math.round(num / (10 ** 10)) / 100;
      return num.toFixed(2) + "万亿";
    } else if (num >= (10 ** 8) || num <= -(10 ** 8)) {
      num = Math.round(num / (10 ** 6)) / 100;
      return num.toFixed(2) + "亿";
    } else if (num >= 10000 || num <= -10000) {
      num = Math.round(num / 100) / 100;
      return num.toFixed(2) + "万";
    }
    return num.toFixed(2);
  }

}


@Pipe({
  name: 'pctJudge'
})
export class PctJudgePipe implements PipeTransform {

  // 如果有"率"字就返回true 判断为百分比
  transform(str: string): boolean {
    let reg = /率/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

}


@Pipe({
  name: 'removeDot'
})
export class RemoveDotPipe implements PipeTransform {
  // 去除点后面的字符
  transform(str: string): string {
    return str.split('.')[0];
  }

}


@Pipe({
  name: 'roundUp'
})
export class RoundUpPipe implements PipeTransform {
  // 向上取整
  transform(num: number): number {
    return Math.ceil(num);
  }

}


@Pipe({
  name: 'splitUrl'
})
export class SplitUrlPipe implements PipeTransform {

  transform(str: string): string {
    // 分割地址
    if (!str || str.trim() == "") return;
    let strlist = str.split(',');
    return strlist[1];
  }

}