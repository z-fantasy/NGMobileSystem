import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Observable} from "rxjs/Observable";
import {StoragefunService} from "../../../service/storagefun.service";
import {Router} from "@angular/router";
import {RequestService} from "../../../service/request.service";
import {NgmessageService} from "../../../service/ngmessage.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm($event, value) {
    $event.preventDefault();
    this.request.postData('/sys/sysuser/login', {phone: value.userName, password: value.password}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      if (data.result === 1) {
        data.remember = value.remember;
        this.storage.setSess('userInfo', data);
        this.router.navigate(['/home']);
      } else if (data.result === -1) {
        this.mess.create('error', '用户名有误或已被禁用');
        this.formInit();
      } else if (data.result === -2) {
        this.mess.create('error', '密码错误');
        this.formInit();
      } else {
        this.mess.create('error', '请求失败，服务器错误');
      }
    });
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder, private storage: StoragefunService, private router: Router, private request: RequestService, private mess: NgmessageService, private confirmServ: NzModalService) {
    try {
      sessionStorage.setItem('testSess', '');
    } catch (e) {
      confirmServ.warning({
        title: '提示！',
        content: '您的浏览器处于无痕浏览模式下，不能正常储存您的信息，请先关闭无痕模式再续操作！'
      });
    }
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required], [this.userNameAsync]],
      password: [null, [Validators.required], [this.passwordAli]],
      remember: [false],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  userNameAsync = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (!/\d+$/.test(control.value)) {
          observer.next({error: true, duplicated: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }
  passwordAli = (control: FormControl): any => {
    return Observable.create(function (observer) {
      setTimeout(() => {
        if (control.value !== '123456') {
          observer.next({error: true, duplicated: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }

  register() {
    this.storage.setSess('register', true);
    this.router.navigate(['/register']);
  }

  forgot() {
    this.storage.setSess('forgot', true);
    this.router.navigate(['/forget']);
  }
}
