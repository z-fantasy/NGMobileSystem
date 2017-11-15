import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ScrollService} from "../../../service/scroll.service";
import {NgmessageService} from "../../../service/ngmessage.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-work-logs',
  templateUrl: './work-logs.component.html',
  styleUrls: ['./work-logs.component.css']
})
export class WorkLogsComponent implements OnInit, AfterContentInit, OnDestroy {
  page = 1;
  // 列表数据
  workLogList = [];
  sub; // 将监听服务挂载在这个变量上
  contral = false; // 控制是否到底部了需要加载
  constructor(private router: Router, private scroll: ScrollService, private mess: NgmessageService, private el: ElementRef, private request: RequestService) {
  }

  ngOnInit() {
    this.mess.load('正在更新，请稍候');
    // workLogList?page=1&rows=10
   this.addData({page: this.page, rows: 30}, false);
  }
  addData(proArg: any, isPush: boolean) {
    this.contral = false;
    this.request.postData('/mobile/workLogList', proArg, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      if (data.status === 'success') {
        this.mess.create('success', '加载完成！');
        if (isPush) {
          this.workLogList = [...this.workLogList, ...data.data];
        } else {
          this.workLogList = data.data;
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
  workLDetail(ite: any) {
    this.router.navigate(['/home/workLogDetails'], {queryParams: {wldetail: JSON.stringify(ite)}});
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
  trackByHeroes(index: number, item: any): number {
    return item.id;
  }
}
