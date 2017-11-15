import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FileSaverService} from "ngx-filesaver";
import {Http, RequestOptions, ResponseContentType} from "@angular/http";
import {NgmessageService} from "../../../service/ngmessage.service";
import {RequestService} from "../../../service/request.service";

const url = 'http://192.168.160.241:8015';
@Component({
  selector: 'app-work-log-details',
  templateUrl: './work-log-details.component.html',
  styleUrls: ['./work-log-details.component.css']
})
export class WorkLogDetailsComponent implements OnInit {
  workLogDetail = {};
  constructor(private routerInfo: ActivatedRoute, private _http: Http, private mess: NgmessageService, private fileSave: FileSaverService, private request: RequestService) {
  }

// , private fileSave: FileSaverService

  ngOnInit() {
    const wldetail = JSON.parse(this.routerInfo.snapshot.queryParams['wldetail']);
    wldetail['attachment'] = wldetail['attachment'] ? wldetail['attachment'].split(',').map(ite => {
      return {value: ite, label: ite.split('/')[ite.split('/').length - 1]};
    }) : [];
    this.workLogDetail = wldetail;
  }

  downFile(urls: string, fileName: 'string') {
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob // 这里必须是Blob类型
    });

    this._http.get(url + urls, options).subscribe(res => {
      if (res['status'] === 200 && res['statusText'] === 'OK' && res['ok'] === true) {
        this.fileSave.save((<any>res)._body, fileName);
        this.mess.create('success', '下载成功！');
      } else {
        console.log(res);
        this.mess.create('error', '下载失败！');
      }
    });
  }
  showModal() {
    if (confirm('确定删除此日志？')) {
      this.mess.load('正在删除此日志');
      this.request.postData('/mobile/deleteWorkLog', {id: this.workLogDetail['id']}, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}).then(data => {
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
