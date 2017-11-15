import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {StoragefunService} from "../../../service/storagefun.service";
import {Router} from "@angular/router";
import {NgmessageService} from "../../../service/ngmessage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor( private storage: StoragefunService, private route: Router, private el: ElementRef, private mess: NgmessageService) { }

  ngOnInit() {
   this.setExpIns();
  }
  setExpIns () {
    this.storage.setSess('expIns', new Date().getTime());
  }
  ngAfterViewInit() {
    this.el.nativeElement.querySelector('.homeBox').addEventListener('touchstart', this.expLogin.bind(this), false);
  }
  expLogin() {
    if (this.storage.getSess('expIns')) {
      const marTime = Math.ceil((new Date().getTime() - this.storage.getSess('expIns')) / 1000);
      if (marTime > 1200) {
        console.log('token过期了');
        this.mess.create('warning', '登录过期，请重新登录!');
        this.storage.clearOne('userInfo');
        this.storage.clearOneSee('expIns');
        this.el.nativeElement.querySelector('.homeBox').removeEventListener('touchstart', this.expLogin.bind(this), false);
        this.route.navigate(['/login']);
      } else {
        this.setExpIns();
      }
    } else {
      console.log('没有存页面过期检测变量');
      this.setExpIns();
    }
  }
  ngOnDestroy() {
    this.storage.clearOneSee('expIns');
    this.el.nativeElement.querySelector('.homeBox').removeEventListener('touchstart', this.expLogin.bind(this), false);
  }
}
