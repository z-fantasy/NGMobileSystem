import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ScrollService} from "../../../service/scroll.service";
import {NgmessageService} from "../../../service/ngmessage.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-my-works',
  templateUrl: './my-works.component.html',
  styleUrls: ['./my-works.component.css']
})
export class MyWorksComponent implements OnInit, AfterContentInit, OnDestroy {
  public myWorksList = [];
  sub; // 将监听服务挂载在这个变量上
  contral = false; // 控制是否到底部了需要加载
  // 选择状态相关
  proState = [
    {value: 'initial', label: '未开始'},
    {value: 'inProgress', label: '进行中'},
    {value: 'finished', label: '已完成'}
  ];
  selectedState = this.proState[0];
  isCloseSelect = false;
  taskTitClas = {
    'coteTskTit': true,
    'being': true,
    'nedTest': false,
    'taskClose': false
  };
  page = 1;
  constructor(private rout: Router, private scroll: ScrollService, private el: ElementRef, private mess: NgmessageService, private request: RequestService) {
  }

  ngOnInit() {
    this.mess.load('正在更新，请稍候');
    this.addData({status: this.selectedState.value, page: this.page, rows: 30}, false);
  }
  addData(proArg: any, isPush: boolean) {
    this.contral = false;
    this.request.postData('/mobile/myWorks', proArg, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      if (data.status === 'success') {
        this.mess.create('success', '加载完成！');
        if (isPush) {
          this.myWorksList = [...this.myWorksList, ...data.data];
        } else {
          this.myWorksList = data.data;
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
        this.contral = false;
        this.mess.load('正在加载…');
        this.addData({status: this.selectedState.value, page: this.page, rows: 30}, true);
      }
    });
  }

  myTaskDetail(item: number) {
    this.rout.navigate(['/home/workDetails'], {queryParams: {'taskdetail': JSON.stringify(item)}});
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
  chooseState() {
    if (this.isCloseSelect) {
      this.taskTitClas = {
        'coteTskTit': true,
        'being': this.selectedState.value === 'initial',
        'nedTest': this.selectedState.value === 'inProgress',
        'taskClose': this.selectedState.value === 'finished'
      };
      this.isCloseSelect = false;
      this.page = 1;
      this.addData({status: this.selectedState.value, page: this.page, rows: 30}, false);
    } else {
      this.isCloseSelect = true;
    }
  }
  // 列表的trackBy方法。
  trackByHeroes(index: number, item: any): number {
    return item.id;
  }
  chooseProj(item: any) {
    console.log(item);
  }
}
