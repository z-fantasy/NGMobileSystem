import {Injectable} from '@angular/core';

@Injectable()
export class BlurService {
  constructor() { }
  blurs(elem: any, time?: number) {
    setTimeout(() => {
      const oo = elem;
      for (let i = 0; i < oo.length; i++) {
        oo[i].addEventListener('focus', e => this.onblur(e), false);
      }
    }, time ? time : 30);
  }
  onblur(e) {
    e.target.blur();
  }
  clearblur(elem: any) {
    const oo = elem;
    for (let i = 0; i < oo.length; i++) {
      oo[i].removeEventListener('focus', e => this.onblur(e), false);
    }
  }
}
