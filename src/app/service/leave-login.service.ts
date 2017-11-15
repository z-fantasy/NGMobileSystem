import { Injectable } from '@angular/core';
import {StoragefunService} from "./storagefun.service";
import {Observable} from "rxjs/Observable";
import {CanDeactivate, Router} from "@angular/router";

@Injectable()
export class LeaveLoginService implements CanDeactivate<CanComponentDeactivate> {
  // 实际使用的时候参阅：https://angular.cn/guide/router#candeactivate：处理未保存的更改
  constructor(private storage: StoragefunService, private router: Router) { }
  canDeactivate() {
    if (this.storage.getSess('userInfo')) {
      return true;
    } else if (this.storage.getSess('forgot')) {
      this.storage.clearOneSee('forgot');
      return true;
    } else if (this.storage.getSess('register')) {
      this.storage.clearOneSee('register');
      return true;
    }
  }
}

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
