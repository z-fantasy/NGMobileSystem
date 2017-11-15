import {Component, OnInit} from '@angular/core';
import {NgmessageService} from "../../../service/ngmessage.service";
import {UtilFunService} from "../../../service/util-fun.service";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-task-list-detail',
  templateUrl: './task-list-detail.component.html',
  styleUrls: ['./task-list-detail.component.css']
})
export class TaskListDetailComponent implements OnInit {
  // 菜单选择相关
  size = 'large';
  options = [
    { value: 'initial', label: '未开始' },
    { value: 'inProgress', label: '进行中'},
    { value: 'finished', label: '已完成'},
  ];
  single = 'initial';
  // 任务列表数据相关
  taskDetail = {};
  isEditor = false;
  oldTaskDetails = {};
  // 选择执行人
  selectList = [];
  selecPeople = {};
  // 项目列表
  projList = [];
  selecproj = {};

  constructor(private mess: NgmessageService, private utFun: UtilFunService, private routerInfo: ActivatedRoute, private request: RequestService) {
  }

  ngOnInit() {
    console.log(JSON.parse(this.routerInfo.snapshot.queryParams['details']));
    const data = JSON.parse(this.routerInfo.snapshot.queryParams['details']);
    this.single = data.status;
    this.taskDetail = data;
    this.oldTaskDetails = this.forIn(data);
    let rolk = {};
    if (JSON.parse(sessionStorage.getItem('userInfo')).role === 'ROLE_PROJECT_MANAGER') {
      rolk = {roleKey: 'ROLE_USER'};
    }
    this.request.postData('/mobile/getUserSelectList', rolk, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(resu => {
      try {
        this.selectList = resu.map((ite) => {
          if (ite.name === data.assignmentName) {
            this.selecPeople = {value: ite.id, label: ite.name};
          }
          return {value: ite.id, label: ite.name};
        });
      } catch (e) {
        this.mess.create('error', '加载人员列表失败！');
      }
    });
    this.request.postData('/mobile/getProjectSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(result => {
      try {
        this.projList = result.map((ite) => {
          if (ite.id === data.projectId) {
            this.selecproj = {value: ite.id, label: ite.name};
          }
          return {value: ite.id, label: ite.name};
        });
      } catch (e) {
        this.mess.create('error', '加载项目列表失败！');
      }
    });
  }

  editTask(oldDate?: any) {
    if (this.isEditor) {
      this.mess.load('正在保存！');
      this.taskDetail['status'] = this.single;
      if (this.single === 'initial') {
        this.taskDetail['statusCn'] = '未开始';
      } else if (this.single === 'inProgress') {
        this.taskDetail['statusCn'] = '进行中';
      } else {
        this.taskDetail['statusCn'] = '已完成';
      }
      const tDetas = this.taskDetail;
      if (tDetas['name'] !== '' && /^(0|100|[1-9]\d)$/.test(tDetas['progress'])) {
        // tDetas['start'] = new Date(this.utFun.overHerfDate(this.utFun.dateTimeGet(tDetas['start'])));
        this.request.postData('/mobile/editTask', {id: this.taskDetail['id'], projectId: this.selecproj['value'], detail: this.taskDetail['detail'], progress: this.taskDetail['progress'], assignmentId: this.selecPeople['value'], status: this.single}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
          this.mess.remove();
          if (message.status === 'success') {
            this.mess.create('success', '编辑成功！');
            this.oldTaskDetails = this.forIn(tDetas);
          } else {
            this.mess.create('error', '编辑失败！');
            this.taskDetail = this.forIn(this.oldTaskDetails);
          }
          this.isEditor = false;
        });
      } else {
        this.mess.create('info', '请仔细检查编辑内容！');
      }
    } else {
      // 打开编辑
      this.isEditor = true;
    }
  }

  cancleEdit() {
    // 取消编辑
    this.taskDetail = this.forIn(this.oldTaskDetails);
    this.isEditor = false;
  }

  cancleTask() {
    // 取消任务
    if (confirm('确定要取消此任务吗？')) {
      this.mess.load('正在删除…');
      this.request.postData('/mobile/deleteTask', {id: this.taskDetail['id']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', '删除成功！马上跳转', 1000);
          setTimeout(() => history.back(), 1000);
        } else {
          this.mess.create('success', '删除失败！');
        }
      });
    }
  }

  // forIn遍历存一个新数据
  forIn(data) {
    return {...data};
  }

  getYear(people: any) {
    this.selecPeople = people;
    this.taskDetail['assignmentName'] = people.label;
  }
  getProj(proj: any) {
    this.selecproj = proj;
    this.taskDetail['projectName'] = proj.label;
  }
}
