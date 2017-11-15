import { Component, OnInit } from '@angular/core';
import {NgmessageService} from "../../../service/ngmessage.service";
import {ActivatedRoute} from "@angular/router";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-progress-log-detail',
  templateUrl: './progress-log-detail.component.html',
  styleUrls: ['./progress-log-detail.component.css']
})
export class ProgressLogDetailComponent implements OnInit {
  isVisible = false;
  selectList = [];
  seleProj = {};
  progRamk = '';
  style: any = {
    top: '20px'
  };
  proLogDet = {};
  controlScrol = false;
  constructor(private mess: NgmessageService, private routerInfo: ActivatedRoute, private request: RequestService) { }

  ngOnInit() {
    console.log(JSON.parse(this.routerInfo.snapshot.queryParams['projLogDetail']));
    const rotInfo = JSON.parse(this.routerInfo.snapshot.queryParams['projLogDetail'])
    this.proLogDet = rotInfo;
    this.progRamk = rotInfo['notes'];
    this.request.postData('/mobile/getProjectSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(result => {
      try {
        this.selectList = result.map(ites => {
          if (ites.id === this.proLogDet['projectId']) {
            this.seleProj = {value: ites.id, label: ites.name};
            this.controlScrol = true;
          }
          return {value: ites.id, label: ites.name};
        });
      } catch (e) {
        this.mess.create('error', '查询项目列表失败');
      }
    });
  }
  showModal = () => {
    this.isVisible = true;
  }
  handleCancel = (e) => {
    this.isVisible = false;
  }
  handleOk = (e) => {
    this.mess.load('正在保存…');
    this.request.postData('/mobile/editProjectLog', {id: this.proLogDet['id'], projectId: this.seleProj['value'], notes: this.progRamk}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
      this.mess.remove();
      if (message.status === 'success') {
        this.mess.create('success', '编辑成功！');
        this.proLogDet['notes'] = this.progRamk;
        this.proLogDet['projectName'] = this.seleProj['label'];
        this.proLogDet['projectId'] = this.seleProj['value'];
        this.isVisible = false;
      } else {
        this.mess.create('error', '编辑失败！');
      }
    });
  }
  getYear(e: any) {
    this.seleProj = e;
  }
  deleteid() {
    if (confirm('确定删除此日志？')) {
      this.mess.load('正在删除此日志…');
      this.request.postData('/mobile/deleteProjectLog', {id: this.proLogDet['id']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
        this.mess.remove();
        if (data && data.status === 'success') {
          this.mess.create('success', '删除成功，正在跳转…');
          setTimeout(() => {
            history.back();
          }, 1500);
        } else {
          this.mess.create('error', '删除失败');
        }
      });
    }
  }
}
