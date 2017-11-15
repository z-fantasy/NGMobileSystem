import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgmessageService} from "../../../service/ngmessage.service";
import {ScrollService} from "../../../service/scroll.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-progress-list',
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.css']
})
export class ProgressListComponent implements OnInit, OnDestroy, AfterViewInit {
  progressList = [];
  sub; // 将监听服务挂载在这个变量上
  contral = false; // 控制是否到底部了需要加载
  page = 1;
  // 选择状态相关
  proState = [
    {value: 'initial', label: '未开始'},
    {value: 'inProgress', label: '进行中'},
    {value: 'finished', label: '已完成'}
  ];
  selectedState = this.proState[0];
  statePanel = false;
  // 选择年月
  selectList = [];
  selectYear = [];
  constructor(private route: Router, private mess: NgmessageService, private scroll: ScrollService, private request: RequestService) {
  }

  ngOnInit() {
    // 选择时间数据
    const nowYear = (new Date()).getFullYear();
    const yearArr = [];
    const startYear = 2007; // 初始年份；
    for (let i = startYear; i <= nowYear; i++) {
      yearArr.unshift({label: i, value: i + '-01-01 00:00:00&' + (i + 1) + '-01-01 00:00:00'}); // -12-31 23:59:59
    }
    this.selectList = yearArr;
    const timeArr = yearArr[0].value.split('&');
    this.selectYear = timeArr;
    this.mess.load('正在加载更新…');
    this.addData({page: this.page, rows: 15, startTime: timeArr[0], endTime: timeArr[1], status: this.selectedState.value}, false);
  }
  addData(proArg: any, isPush: boolean) {
    this.contral = false;
    this.request.postData('/mobile/projectList', proArg, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      if (data.status === 'success') {
        this.mess.create('success', '加载完成！');
        if (isPush) {
          this.progressList = [...this.progressList, ...data.data];
        } else {
          this.progressList = data.data;
        }
        if (data.data.length > 15) {
          this.page++;
          this.contral = true;
        }
      } else {
        this.mess.create('success', '加载失败！');
      }
    });
  }
  ngAfterViewInit() {
    window.addEventListener('touchmove', this.touchbottom.bind(this), false);
    this.sub = this.scroll.isbotmObs.subscribe((isbom: boolean) => {
      if (isbom && this.contral) {
        this.mess.load('正在加载…');
        this.addData({page: this.page, rows: 15, startTime: this.selectYear[0], endTime: this.selectYear[1], status: this.selectedState.value}, true);
      }
    });
  }

  ngOnDestroy() {
    this.mess.remove();
    this.sub.unsubscribe();
    window.removeEventListener('touchmove', this.touchbottom.bind(this), false);
  }

  touchbottom(event) {
    event.stopPropagation();
    this.scroll.scroll();
  }

  goProDetail(ite: any) {
    this.route.navigate(['/home/progressDetails'], {queryParams: {projDetail: JSON.stringify(ite)}});
  }

  newProgress() {
    this.route.navigate(['/home/addProgress']);
  }

  getYear(year: any) {
    // 选择年份
    const timeArr = year.value.split('&');
    this.selectYear = timeArr;
    this.page = 1;
    this.addData({page: 1, rows: 15, startTime: timeArr[0], endTime: timeArr[1], status: this.selectedState.value}, false);
  }
// 列表的trackBy方法。
  trackByHeroes(index: number, item: any): number {
    return item.id;
  }
  panclChange() {
    // 选择状态
    if (this.statePanel) {
      this.page = 1;
      this.addData({page: 1, rows: 15, startTime: this.selectYear[0], endTime: this.selectYear[1], status: this.selectedState.value}, false);
      this.statePanel = false;
    } else {
      this.statePanel = true;
    }
  }
}
