import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgmessageService} from "../../../service/ngmessage.service";
import {ScrollService} from "../../../service/scroll.service";
import {RequestService} from "../../../service/request.service";


@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  styleUrls: ['./work-details.component.css']
})
export class WorkDetailsComponent implements OnInit, OnDestroy {
  public taskDetails: any;
  isVisible = false;
  siteName: any = 0;
  // 修改状态相关
  size = 'large';
  options = [
    { value: 'initial', label: '未开始' },
    { value: 'inProgress', label: '进行中' },
    { value: 'finished', label: '已完成'},
  ];
  single = 'initial';
  showModal = () => {
    this.isVisible = true;
  }

  handleOk = (e) => {
    this.mess.load('正在提交，请稍后');
    const prosjd = ~~this.siteName > 100 ? 100 : ~~this.siteName;
    if (prosjd < 0 ) {
      this.mess.create( 'error', '项目进度不能为负值！');
    } else {
      if (prosjd > 100) {
        this.siteName = 100;
        this.single = 'finished';
      }
      this.taskDetails['progress'] = 100;
      this.request.postData('/mobile/editTask', {id: this.taskDetails['id'], name: this.taskDetails['name'], projectId: this.taskDetails['projectId'], detail: this.taskDetails['detail'], status: this.single, progress: this.siteName, assignmentId: this.taskDetails['assignmentId']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', `提交成功！`);
          this.taskDetails['progress'] = this.siteName;
          if (this.single === 'finished') {
            this.taskDetails['statusCn'] = '已完成';
          } else if (this.single === 'inProgress') {
            this.taskDetails['statusCn'] = '进行中';
          } else {
            this.taskDetails['statusCn'] = '未开始';
          }
          this.isVisible = false;
        } else {
          this.mess.create('error', `提交失败！`);
        }
      });
    }
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }
  constructor(private routerInfo: ActivatedRoute,
              private mess: NgmessageService,
              private request: RequestService
  ) {
  }

  ngOnInit() {
    const deta = JSON.parse(this.routerInfo.snapshot.queryParams['taskdetail']);
    this.taskDetails = deta;
    this.siteName = deta['progress'];
    this.single = deta['status'];
  }
  ngOnDestroy() {
    this.mess.remove();
  }
  blurs() {
    if (/^(0|100|[1-9]\d)$/.test('' + this.siteName)) {
    } else {
      this.siteName = '0';
      this.mess.create('error', '输入进度有误');
    }
  }
}
