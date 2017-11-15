import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgZorroAntdModule} from "ng-zorro-antd";
import {FileUploadModule} from "ng2-file-upload";
import {ScrollService} from "../service/scroll.service";
import {BlurService} from "../service/blur.service";
import {GuardService} from "../service/guard.service";
import {StoragefunService} from "../service/storagefun.service";
import {LeaveLoginService} from "../service/leave-login.service";
import {NgmessageService} from "../service/ngmessage.service";
import {RequestService} from "../service/request.service";
import {UtilFunService} from "../service/util-fun.service";
import {TakeoutdPipe} from "../pipe/takeoutd.pipe";
import {FileSaverModule} from "ngx-filesaver";

const DIRECTIVES = [];
const PIPES = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgZorroAntdModule.forRoot(),
    FileUploadModule,
    FileSaverModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    FileUploadModule,
    FileSaverModule
  ],
  declarations: [
    TakeoutdPipe
  ],
  providers: [
    ScrollService,
    BlurService,
    GuardService,
    StoragefunService,
    LeaveLoginService,
    NgmessageService,
    RequestService,
    UtilFunService
  ]
})
export class ShareModule { }
