import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class ScrollService {
  margBotPx = 60; // 距离底部高度
  timer: any;
  timeOut: any;
  oldSite = 0; // 当前停止位置
  windH;
  // @Output() isInbottom: EventEmitter<boolean> = new EventEmitter();
  // 用来产生数据流的数据源
  private isBo = new Subject<boolean>();
  // 把数据流转换成 Observable
  isbotmObs = this.isBo.asObservable();

  constructor() {
    let windowHeight = 0;
    if (document.compatMode === 'CSS1Compat') {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    this.windH = windowHeight;
  }

  scroll() {
    if (this.timer) {
      clearInterval(this.timer);
      clearTimeout(this.timeOut);
      this.timer = setInterval(() => {
        if (this.inSite()) {
          clearInterval(this.timer);
          this.isBo.next(this.oldSite < this.margBotPx ? true : false);
          clearTimeout(this.timeOut);
        }
      }, 100);
      this.timeOut = setTimeout(() => {
        clearInterval(this.timer);
        this.isBo.next(this.oldSite < this.margBotPx ? true : false);
      }, 3500);
    } else {
      this.timer = setInterval(() => {
        if (this.inSite()) {
          clearInterval(this.timer);
          this.isBo.next(this.oldSite < this.margBotPx ? true : false);
          clearTimeout(this.timeOut);
        }
      }, 100);
      this.timeOut = setTimeout(() => {
        clearInterval(this.timer);
        this.isBo.next(this.oldSite < this.margBotPx ? true : false);
      }, 3500);
    }
  }

  // 设置当前距离文档底部的距离并返回是否停止了滚动。
  inSite(): boolean {
    const ah = this.getAllHeight();
    const sh = this.getScrollTop();
    const h = ah - (sh + this.windH);
    if (h !== this.oldSite) {
      this.oldSite = h;
      return false;
    } else {
      return true;
    }
  }

  // 得到文档总高度
  getAllHeight(): number {
    let scrollHeight = 0;
    let bodyScrollHeight = 0;
    let documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  }

  // 得到文档被卷去的高
  getScrollTop(): number {
    let scrollTop = 0;
    let bodyScrollTop = 0;
    let documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  }

  cancleScroll() {
    clearInterval(this.timer);
  }
}
