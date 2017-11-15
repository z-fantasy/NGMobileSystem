import {Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgmessageService} from "../../../service/ngmessage.service";
import {ScrollService} from "../../../service/scroll.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy, AfterViewInit {
  myWorksList = [];
// 选择状态相关
  proState = [
    {value: 'initial', label: '未开始'},
    {value: 'inProgress', label: '进行中'},
    {value: 'finished', label: '已完成'}
  ];
  selectedState = this.proState[0];
  statePanel = false;
  // 选择数据
  isLoad = false;
  selectList = [];
  selectPeople = {};
  page = 1;
  sub; // 将监听服务挂载在这个变量上
  contral = false; // 控制是否到底部了需要加载
  constructor(private router: Router, private mess: NgmessageService, private scroll: ScrollService, private request: RequestService) { }

  ngOnInit() {
    this.mess.load('正在更新加载！');
    // ROLE_USER: 'ROLE_PROJECT_MANAGER'
    this.request.postData('/mobile/getUserSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.selectList = data.map((ite) => {
        return {value: ite.id, label: ite.name};
      });
      const selOne = this.selectList[0];
      this.selectPeople = selOne;
      this.isLoad = true;
      if (selOne) {
        // /mobile/taskList?page=1&rows=10&status=initial&assignmentId=1
        const proxData = {page: this.page, rows: 30, status: 'initial', assignmentId: selOne.value};
        this.addData(proxData, false);
      } else {
        this.mess.remove();
        this.mess.create('info', '没有人员可查询！');
      }
    });
  }
  addData(proArg: any, isPush: boolean) {
    this.mess.load('正在加载！');
    this.contral = false;
    this.request.postData('/mobile/taskList', proArg, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
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
        const proxData = {page: this.page, rows: 30, status: this.selectedState.value, assignmentId: this.selectPeople['value']};
        this.addData(proxData, true);
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
  taskDetail(details: any) {
    this.router.navigate(['/home/taskListDetail'], {queryParams: {details: JSON.stringify(details)}});
  }

  getYear(people: any) {
    // 选择人员
    this.selectPeople = people;
    this.page = 1;
    const proxData = {page: 1, rows: 30, status: this.selectedState.value, assignmentId: people.value};
    this.addData(proxData, false);
  }
  panclChange() {
    // 选择状态
    if (this.statePanel) {
      this.page = 1;
      const proxData = {page: 1, rows: 30, status: this.selectedState.value, assignmentId: this.selectPeople['value']};
      this.addData(proxData, false);
      this.statePanel = false;
    } else {
      this.statePanel = !this.statePanel;
    }
  }
}
