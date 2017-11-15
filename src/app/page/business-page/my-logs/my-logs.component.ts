import {Component, OnInit} from '@angular/core';
import {NgmessageService} from "../../../service/ngmessage.service";
import {StoragefunService} from "../../../service/storagefun.service";
import {FileUploader} from "ng2-file-upload";
import {RequestService} from "../../../service/request.service";
import {UtilFunService} from "../../../service/util-fun.service";

const URL = 'http://192.168.160.241:8015/mobile/taskLog/uploadAttachment';


@Component({
  selector: 'app-my-logs',
  templateUrl: './my-logs.component.html',
  styleUrls: ['./my-logs.component.css']
})
export class MyLogsComponent implements OnInit {
  // 选择框
  isOpen = false;
  options = [
    {value: 'work', label: '工作日志'},
    {value: 'prog', label: '项目日志', disabled: true}
  ];
  oldTypeValue = this.options[0];
  selectedOption = this.options[0];
  // 日志内容和备注
  inputValue: string;
  remarkDesc: string;
  logTitle: string;
  // 选择项目
  checkOptionsOne = [];
  checkedProj = {};
  // 选择任务
  taskListDa = [];
  selectedTask = {label: '无所属', value: ''};
  // upload
  attachment = [];
  public uploader: FileUploader = new FileUploader({
    url: URL,
  });
//   method: "POST",
//   itemAlias: "uploadedfile"

  constructor(private mess: NgmessageService, private stor: StoragefunService, private request: RequestService, private utilFun: UtilFunService) {
  }

  ngOnInit() {
    this.request.postData('/mobile/getTaskSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(result => {
      this.mess.remove();
      try {
        result.map(ites => {
          this.taskListDa.push({value: ites.id, label: ites.name});
        });
      } catch (e) {
        this.mess.create('error', '查询任务列表失败');
      }
    });
    const limits = this.stor.getSess('userInfo') ? JSON.parse(this.stor.getSess('userInfo')).role : 'ROLE_USER';
    if (limits !== 'ROLE_USER') {
      this.options[1] = {value: 'prog', label: '项目日志', disabled: false};
      // http://localhost:8080/jeefwmvn/mobile/getTaskSelectList // 得到任务选择列表
      this.request.postData('/mobile/getProjectSelectList', {}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(result => {
        this.mess.remove();
        try {
          this.checkOptionsOne = result.map(ites => {
            return {value: ites.id, label: ites.name};
          });
          if (this.checkOptionsOne.length !== 0) {
            this.checkedProj = this.checkOptionsOne[0];
          } else {
            this.mess.create('error', '没有可指定的所属项目');
          }
        } catch (e) {
          this.mess.create('error', '查询项目列表失败');
        }
      });
    }
    // 如果权限为管理，直接再加载项目的，如果不是，不用加载项目的
  }

  logSubmit() {
    this.mess.load('正在提交,请稍等');
    if (this.selectedOption.value === 'work') {
      let proxDatas = {};
      if (this.attachment.length !== 0 && this.selectedTask.value) {
        let att = '';
        for (let i = 0; i < this.attachment.length; i++) {
          if (i !== this.attachment.length - 1) {
            att += this.attachment[i] + ',';
          } else {
            att += this.attachment[i];
          }
        }
        proxDatas['attachment'] = att;
      } else {
        this.mess.remove();
        this.mess.create('info', '必须选择一个非所属任务！!');
        return;
      }
      if (this.selectedTask.value) {
        proxDatas['taskId'] = this.selectedTask.value;
      }
      proxDatas['detail'] = this.inputValue;
      proxDatas['notes'] = this.remarkDesc;
      proxDatas['startTime'] = this.utilFun.dateTimeGet(new Date());
      proxDatas['endTime'] = this.utilFun.dateTimeGet(new Date());
      this.request.postData('/mobile/commitWorkLog', proxDatas, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', '提交成功!');
          this.uploader.clearQueue();
          this.attachment = [];
        } else {
          this.mess.create('error', '提交失败!');
        }
      });
    } else {
      this.request.postData('/mobile/commitProjectLog', {
        projectId: this.checkedProj['value'],
        notes: this.remarkDesc
      }, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(message => {
        this.mess.remove();
        if (message.status === 'success') {
          this.mess.create('success', '提交成功!');
        } else {
          this.mess.create('error', '提交失败!');
        }
      });
    }
  }

  selectTask(ite: any) {
    this.selectedTask = ite;
  }

  selectProj(ite: any) {
    this.checkedProj = ite;
  }

  typeOpen() {
    if (this.isOpen) {
      if (this.selectedOption.value !== this.oldTypeValue.value) {
        if (this.selectedOption.value === 'work') {
          this.selectedTask = this.taskListDa[0];
          this.uploader.clearQueue(); // 清除上传列表
        } else {
          this.checkedProj = this.checkOptionsOne[0];
        }
        this.oldTypeValue = this.selectedOption;
      }
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  // upload
  selectedFileOnChanged(e: any) {
    const queuelen = this.uploader.queue;
    for (let i = 0; i < queuelen.length; i++) {
      // console.log(queuelen[i].file); // _file
    }
  }

  fileUp(e: any) {
    this.mess.load('附件上传中…');
    const prourl = '/mobile/taskLog/uploadAttachment?taskId=' + this.selectedTask.value;
    e.url = prourl;
    const that = this;
    e.onSuccess = function (response, status, headers) {
      // 上传文件成功
      that.mess.remove();
      if (status === 200) {
        // 上传文件后获取服务器返回的数据
        const tempRes = JSON.parse(response);
        that.attachment.push(tempRes.data); // push url
        that.mess.create('success', '上传附件成功！');
        // console.log(tempRes.data);
      } else {
        that.mess.create('error', '上传附件失败！');
        // console.log(response);
        e.remove();
      }
    };
    e.upload(); // 开始上传
  }

  fileRemove(e: any) {
    const filname = e.file.name;
    if (this.attachment.length !== 0) {
      this.attachment = this.attachment.filter((ite) => {
        if (ite.indexOf(filname) === -1) {
          return ite;
        }
      });
    }
    e.remove();
  }
}
