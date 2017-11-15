import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BlurService} from "../../../service/blur.service";
import {NgmessageService} from "../../../service/ngmessage.service";
import {ScrollService} from "../../../service/scroll.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-progress-logs',
  templateUrl: './progress-logs.component.html',
  styleUrls: ['./progress-logs.component.css']
})
export class ProgressLogsComponent implements OnInit, AfterContentInit, OnDestroy {
  page = 1;
  progLogList = [];
  sub; // 将监听服务挂载在这个变量上
  contral = false; // 控制是否到底部了需要加载
  constructor(private el: ElementRef, private router: Router, private mess: NgmessageService, private scroll: ScrollService, private request: RequestService) { }

  ngOnInit() {
    this.mess.load('正在更新，请稍候');
    this.addData({page: this.page, rows: 30}, false);
  }
  addData(proArg: any, isPush: boolean) {
    this.contral = false;
    this.request.postData('/mobile/projectLogList', proArg, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      console.log(data);
      if (data.status === 'success') {
        this.mess.create('success', '加载完成！');
        if (isPush) {
          this.progLogList = [...this.progLogList, ...data.data];
        } else {
          this.progLogList = data.data;
        }
        if (data.data.length > 30) {
          this.page++;
          this.contral = true;
        } else {
          this.contral = false;
        }
      } else {
        this.mess.create('success', '加载失败！');
      }
    });
  }
  ngAfterContentInit() {
    this.el.nativeElement.querySelector('#wrapper').addEventListener('touchmove', this.touchbottom.bind(this), false);
    this.sub = this.scroll.isbotmObs.subscribe((isbom: boolean) => {
      if (isbom && this.contral) {
        this.addData({page: this.page, rows: 30}, true);
      }
    });
  }
  touchbottom(event) {
    event.stopPropagation();
    this.scroll.scroll();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.mess.remove();
    this.el.nativeElement.querySelector('#wrapper').removeEventListener('touchmove', this.touchbottom.bind(this), false);
  }
  progLDetail(ite: any) {
    this.router.navigate(['/home/progressLogDetail'], {queryParams: {projLogDetail: JSON.stringify(ite)}});
  }
}
