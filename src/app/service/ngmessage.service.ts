import { Injectable } from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";

@Injectable()
export class NgmessageService {
  _id;
  constructor(private _message: NzMessageService) { }
  load(text?: string) {
    this._id = this._message.loading(text ? text : '正在请求，请等待…', { nzDuration: 0 }).messageId;
  }
  remove() {
    this._message.remove(this._id);
  }
  create(state: string, text: string, timer?: number) {
    this._message.create(state, text, {nzDuration: timer ? timer : 1500});
  }
}
