import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgmessageService} from "../../../service/ngmessage.service";
import {BlurService} from "../../../service/blur.service";
import {UtilFunService} from "../../../service/util-fun.service";
import {RequestService} from "../../../service/request.service";
@Component({
  selector: 'app-progress-details',
  templateUrl: './progress-details.component.html',
  styleUrls: ['./progress-details.component.css']
})
export class ProgressDetailsComponent implements OnInit, OnDestroy {
  isEdit = false;
  oldProInfo = {};
  progressInfo = {};
  // 选择
  size = 'large';
  options = [];
  single = '';

  constructor(private routerInfo: ActivatedRoute,
              private mess: NgmessageService,
              private el: ElementRef,
              private blur: BlurService,
              private utFun: UtilFunService,
              private request: RequestService
              ) {
  }

  ngOnInit() {
    this.mess.load('正在更新加载！');
    this.request.postData('/mobile/getUserSelectList', {ROLE_USER: 'ROLE_PROJECT_MANAGER'}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
      this.mess.remove();
      this.options = data.map((ite) => {
        return {value: ite.id, label: ite.name};
      });
    });
    const proInfo = JSON.parse(this.routerInfo.snapshot.queryParams['projDetail']);
    for (const key in proInfo) {
      if (key === 'progress') {
        if (proInfo.progress > 100) {
          proInfo.progress = 100;
        }
      }
      // if (key === 'createTime' || key === 'endTime') {
      //   proInfo[key] = new Date(proInfo[key]);
      // }
      if (key === 'estimatedTime') {
        proInfo[key] = proInfo[key].replace(/d/, '');
      }
    }
    this.progressInfo = proInfo;
    this.single = proInfo.managerId;
    this.oldProInfo = this.forIn(proInfo);
  }

  proEdit() {
    if (this.isEdit) {
      // 保存操作
      const proInfo = this.progressInfo;
      if (proInfo['name'] !== '' && /^[0-9]+[0-9]*]*$/.test(proInfo['estimatedTime']) && /\d+$/.test(proInfo['progress'])) {
        this.mess.load('正在保存…');
        proInfo['managerId'] = ~~this.single;
        proInfo['estimatedTime'] = proInfo['estimatedTime'] + 'd';
        for (let i = 0; i < this.options.length; i++) {
          if (~~this.single === this.options[i].value) {
            proInfo['managerName'] = this.options[i].label;
          }
        }
        if (~~proInfo['progress'] <= 0) {
          proInfo['progress'] = 0;
          proInfo['status'] = 'initial';
        } else if (~~proInfo['progress'] < 100) {
          proInfo['status'] = 'inProgress';
        } else if (~~proInfo['progress'] > 100) {
          proInfo['progress'] = 100;
          proInfo['status'] = 'finished';
        }
        const proxys = {};
        for (const key in proInfo) {
          if (key === 'createTime' || key === 'isDeleted' || key === 'dynamicProperties' || key === 'queryDynamicConditions' || key === 'sortedConditions' || key === 'statusCn' || key === 'maxResults' || key === 'managerName' || key === 'flag' || key === 'firstResult') {
          } else {
            proxys[key] = proInfo[key];
          }
        }
        // proInfo['createTime'] = new Date(this.utFun.overHerfDate(this.utFun.dateTimeGet(proInfo['createTime'])));
        this.request.postData('/mobile/editProject', proxys, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
          this.mess.remove();
          if (data && data.status === 'success') {
            this.mess.create('success', '保存成功');
            this.progressInfo = this.forIn(proInfo)
            this.oldProInfo =  this.progressInfo;
          } else {
              this.mess.create('error', '保存失败');
              this.progressInfo = this.forIn(this.oldProInfo);
          }
          this.isEdit = false;
        });
      } else {
        this.mess.create('error', '请仔细检测完善内容后提交！');
      }
    } else {
      this.isEdit = true;
      setTimeout(() => {
        this.blur.blurs(this.el.nativeElement.querySelectorAll('input.ant-calendar-picker-input'));
      }, 30);
    }
  }

  forIn(data) {
    return {...data, estimatedTime: data.estimatedTime ? data.estimatedTime.replace(/d/, '') : 0};
  }

  cancleEdit() {
    this.isEdit = false;
    this.progressInfo = this.forIn(this.oldProInfo);
  }

  ngOnDestroy() {
    this.blur.clearblur(this.el.nativeElement.querySelectorAll('input.ant-calendar-picker-input'));
  }
  showModal() {
    if (confirm('确定删除此项目？')) {
      this.mess.load('正在删除此项目');
      this.request.postData('/mobile/deleteProject', {id: this.progressInfo['id']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
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
