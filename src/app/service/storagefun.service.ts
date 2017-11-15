import {Injectable} from '@angular/core';

@Injectable()
export class StoragefunService {

  constructor() {
  }
  setSess (key: string, info) {
    sessionStorage.setItem(key, JSON.stringify(info));
    if (info && info.remember) {
      localStorage.setItem(key, JSON.stringify(info));
    }
    if (info && !info.remember) {
      this.clearOneLoc(key);
    }
  }
  getSess (key) {
    let stor;
    if (sessionStorage.getItem(key)) {
      stor = sessionStorage.getItem(key);
    }
    if (localStorage.getItem(key)) {
      stor = localStorage.getItem(key);
    }
    return stor;
  }
  clearOneSee (key) {
    sessionStorage.removeItem(key);
  }
  clearOneLoc (key) {
    localStorage.removeItem(key);
  }
  clearOne(key) {
    this.clearOneSee(key);
    this.clearOneLoc(key);
  }
}
