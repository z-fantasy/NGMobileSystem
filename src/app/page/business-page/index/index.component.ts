import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StoragefunService} from "../../../service/storagefun.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  // limits = 'ROLE_ADMIN';
  limits = this.stor.getSess('userInfo') ? JSON.parse(this.stor.getSess('userInfo')).role : 'ROLE_USER';
  constructor(private router: Router, private stor: StoragefunService) { }

  ngOnInit() {
    if (this.stor.getSess('userInfo')) {
      console.log(JSON.parse(this.stor.getSess('userInfo')).role);
    } else {
      this.router.navigate(['/home/login']);
    }
  }
  myWorks() {
    this.router.navigate(['/home/myWorks'], {});
  }
  myLogs() {
    this.router.navigate(['/home/myLogs'], {});
  }
  progressList() {
    this.router.navigate(['/home/progressList'], {});
  }
  taskList() {
    this.router.navigate(['/home/taskList'], {});
  }
  workLogs() {
    this.router.navigate(['/home/workLogs'], {});
  }
  progressLogs() {
    this.router.navigate(['/home/progressLogs'], {});
  }
  newProgress() {
    this.router.navigate(['/home/addProgress']);
  }
  distribute() {
    this.router.navigate(['/home/releaseTask']);
  }
}
