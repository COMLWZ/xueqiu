import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, animation, transition, query, stagger } from '@angular/animations';
import QRCode from 'qrcode';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  animations: [
    trigger('fadeInOut', [
      state('yes', style({ background: 'red' })),
      // 元素从无到有
      transition(':enter', [
        style({ transform: 'translate(-50%, -50%) scale(.6)' }),
        animate('.2s', style({ transform: 'translate(-50%, -50%) scale(1)' })),
      ]),
      transition(':leave', [
        animate('.15s', style({ transform: 'translate(-50%, -50%) scale(.8)' }))
      ])
    ]),
    // 写成查找元素并添加动画
    trigger('pageAnimations', [
      transition(':enter', [
        query('.login_mask > .modal_login', [
          style({ transform: 'translate(-50%, -50%) scale(.6)' }),
          animate('.2s', style({ transform: 'translate(-50%, -50%) scale(1)' })),
        ], { optional: true }) // optional: true 当找不到元素时不返回错误
      ]),
      transition(':leave', [
        query('.login_mask > .modal_login', [
          animate('.2s ease-in', style({ transform: 'translate(-50%, -50%) scale(.8)' }))
        ], { optional: true })
      ])
    ])
  ],
})
export class LoginComponent implements OnInit {
  @Input() open: boolean; // 打开登录对话框
  @Output() closeChange = new EventEmitter();

  registerForm!: FormGroup;
  loginForm: FormGroup;

  email_login: boolean = false;
  reg_login: string = "login";
  area_select: boolean = false;

  is_safe: any = false; // 加载安全控件

  constructor(private fb: FormBuilder, private loginSer: NewsService) {
    this.registerForm = this.fb.group({
      phone: [null, [Validators.required]],
      verify: [null, [Validators.required]],
      remember: [true]
    });
    this.loginForm = this.fb.group({
      phone_email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

  }

  ngOnInit(): void {
    this.safeCheck();
  }

  // 关闭模板
  closeModal() {
    this.open = false;
    this.closeChange.emit(this.open);
  }

  // 安全校验
  safeCheck() {
    this.is_safe = false;
    this.loginSer.safeCheck().subscribe((data: any) => {
      if (data.success == 1) {
        console.log(data);
        this.is_safe = true;
      }
    }, err => {
      this.is_safe = "failed";
    });
  }

  // 注册/登录
  submitRegister(): void {
    console.log('登录');
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }
  }

  // 登录
  submitLogin(): void {
    console.log('登录');
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
  }

  // 海外手机号登录切换
  areaToggle($event) {
    if (this.area_select) {
      $event.target.innerText = "海外手机号登录";
      this.area_select = false;
    } else {
      $event.target.innerText = "手机号或邮箱登录";
      this.area_select = true;
    }
  }

  // 切换邮箱登录
  emailLogin($event) {
    if (this.email_login) {
      $event.target.innerText = "邮箱验证码登录";
      this.email_login = false;
    } else {
      $event.target.innerText = "手机验证码登录";
      this.email_login = true;
    }
  }

  // 重设下拉框宽度
  resetWidth($event) {
    let select = $event.target;
    let index = select.selectedIndex;
    let len = select.options[index].text.length * 14;
    select.style.width = len + 'px';
  }

  // 创建二维码
  makeQRCode() {
    QRCode.toCanvas('https://xueqiu.com', {
      errorCorrectionLevel: "L",//容错率L（低）H(高)
      margin: 0,//二维码内边距，默认为4。单位px
      height: 220,//二维码高度
      width: 220,//二维码宽度
      color: {
        dark: '#000', // 二维码背景颜色
        // light: '#07d' // 二维码前景颜色
      }
    }).then(canvas => {
      // console.log(canvas);
      let cans = document.querySelector('.qrcode>.qrcode_canvas');
      cans.innerHTML = "";
      cans.append(canvas);
    }).catch((err) => {
      console.log(err)
    });
  }
}
