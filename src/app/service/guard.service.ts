import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
@Injectable()
export class GuardService implements CanActivate {

  constructor(private router: Router) {
    // router 可以获取url参数的
  }
  canActivate() {
    console.log('进入路由守卫，并判断是否允许进入当前路由');
    // return true;
    if (sessionStorage.getItem('userInfo') || localStorage.getItem('userInfo')) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
