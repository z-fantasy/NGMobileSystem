import {Component, OnInit} from '@angular/core';
import {NgmessageService} from "../../../service/ngmessage.service";
import {RequestService} from "../../../service/request.service";

@Component({
  selector: 'app-add-progress',
  templateUrl: './add-progress.component.html',
  styleUrls: ['./add-progress.component.css']
})
export class AddProgressComponent implements OnInit {

  progName = '';
  progCont = '';
  progRamk = '';
  progress = '0';
  _dateStar = null;
  datePlan = '1';
  // 项目状态相关
  options = [
    { value: 'initial', label: '未开始' },
    { value: 'inProgress', label: '进行中' },
    { value: 'finished', label: '已完成', disabled: true },
  ];
  single = 'initial';
  manageList = [];
  seleMana = {};
  constructor(private mess: NgmessageService, private request: RequestService) {
  }

  ngOnInit() {
    this.request.postData('/mobile/getUserSelectList', {ROLE_USER: 'ROLE_PROJECT_MANAGER'}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(resu => {
      try {
        this.manageList = resu.map((ite) => {
          return {value: ite.id, label: ite.name};
        });
        this.seleMana = this.manageList[0];
      } catch (e) {
        this.mess.create('error', '加载人员列表失败！');
      }
    });
  }

  saveProg() {
    // addProject?name=333&estimatedTime=2d&status=inProgress&description=333&progress=0&managerId=3
    this.mess.load('正在保存…');
    if (/^[0-9]+[0-9]*]*$/.test(this.datePlan) && this.progName.length !== 0 && /^(0|100|[1-9]\d)$/.test(this.progress)) {
      this.request.postData('/mobile/addProject', {name: this.progName, estimatedTime: this.datePlan + 'd', status: this.single, description: this.progCont, progress: this.progress, managerId: this.seleMana['value']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', '保存成功！', 2000);
          this.progName = '';
          this.progCont = '';
          this.progress = '0';
          this.single = 'initial';
        } else {
          this.mess.create('error', '保存失败！');
        }
      });
    } else {
      this.mess.create('error', '请仔细检查编辑内容！');
    }
  }
  selectManage(peo: any) {
    this.seleMana = peo;
  }
}
