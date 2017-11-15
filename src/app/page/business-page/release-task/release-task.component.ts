import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../../service/request.service";
import {NgmessageService} from "../../../service/ngmessage.service";

@Component({
  selector: 'app-release-task',
  templateUrl: './release-task.component.html',
  styleUrls: ['./release-task.component.css']
})
export class ReleaseTaskComponent implements OnInit {
  taskName = '';
  taskCont = '';
  taskRamk = '';
  taskprogress = '0';
  // 任务状态相关
  options = [
    {value: 'initial', label: '未开始'},
    {value: 'inProgress', label: '进行中'},
    {value: 'finished', label: '已完成', disabled: true},
  ];
  single = 'initial';
  // 所属项目
  progs = [];
  sinleProg = '';
  // 执行人员
  searchOptions = [];
  selectUser = {};
  // 给不给添加
  canAddNew = true;
  constructor(private mess: NgmessageService, private request: RequestService) {
  }

  ngOnInit() {
    this.mess.load('正在加载…');
    this.request.postData('/mobile/getUserSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(resu => {
      try {
        this.searchOptions = resu.map(ite => {
          return {value: ite.id, label: ite.name};
        });
        if (this.searchOptions.length !== 0) {
          console.log(this.canAddNew);
          this.selectUser = this.searchOptions[0];
        } else {
          this.mess.create('error', '没有可指定的执行人员');
          this.canAddNew = false;
        }
      } catch (e) {
        this.mess.create('error', '查询人员失败');
      }
    });
    this.request.postData('/mobile/getProjectSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(result => {
      this.mess.remove();
      try {
        this.progs = result.map(ites => {
          return {value: ites.id, label: ites.name};
        });
        if (this.progs.length !== 0) {
          this.sinleProg = this.progs[0].value;
        } else {
          this.mess.create('error', '没有可指定的所属项目');
          this.canAddNew = false;
        }
      } catch (e) {
        this.mess.create('error', '查询项目列表失败');
      }
    });
  }

  taskSave() {
    this.mess.load('正在添加新任务…');
    if (this.taskName !== '' && /^(0|100|[1-9]\d)$/.test(this.taskprogress)) {
      this.request.postData('/mobile/addTask', {name: this.taskName, projectId: this.sinleProg, detail: this.taskCont, status: this.single, progress: ~~this.taskprogress, assignmentId: this.selectUser['value']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', '添加任务成功！');
          this.taskName = '';
          this.taskCont = '';
          this.single = 'initial';
          this.taskprogress = '0';
        } else {
          this.mess.create('error', '添加任务失败！');
        }
      });
    } else {
      this.mess.create('error', '请仔细检查填写内容！');
    }
  }

  getYear(peo: any) {
    this.selectUser = peo;
  }
}
