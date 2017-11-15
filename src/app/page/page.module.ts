import {NgModule} from '@angular/core';
import {ShareModule} from "../shared/share.module";
import {IndexComponent} from './business-page/index/index.component';
import {PageRoutingModule} from "./page.routing.module";
import {HomeComponent} from "./business-page/home/home.component";
import { MyWorksComponent } from './business-page/my-works/my-works.component';
import { MyLogsComponent } from './business-page/my-logs/my-logs.component';
import { ProgressListComponent } from './business-page/progress-list/progress-list.component';
import { TaskListComponent } from './business-page/task-list/task-list.component';
import { WorkLogsComponent } from './business-page/work-logs/work-logs.component';
import { ProgressLogsComponent } from './business-page/progress-logs/progress-logs.component';
import { WorkDetailsComponent } from './business-page/work-details/work-details.component';
import { ProgressDetailsComponent } from './business-page/progress-details/progress-details.component';
import { AddProgressComponent } from './business-page/add-progress/add-progress.component';
import { TaskListDetailComponent } from './business-page/task-list-detail/task-list-detail.component';
import { ReleaseTaskComponent } from './business-page/release-task/release-task.component';
import { WorkLogDetailsComponent } from './business-page/work-log-details/work-log-details.component';
import { ProgressLogDetailComponent } from './business-page/progress-log-detail/progress-log-detail.component';
import {ScrollSelectComponent} from "./util-component/scroll-select/scroll-select.component";

@NgModule({
  imports: [
    ShareModule,
    PageRoutingModule
  ],
  declarations: [
    HomeComponent,
    IndexComponent,
    MyWorksComponent,
    MyLogsComponent,
    ProgressListComponent,
    TaskListComponent,
    WorkLogsComponent,
    ProgressLogsComponent,
    WorkDetailsComponent,
    ProgressDetailsComponent,
    AddProgressComponent,
    TaskListDetailComponent,
    ReleaseTaskComponent,
    WorkLogDetailsComponent,
    ProgressLogDetailComponent,
    ScrollSelectComponent
  ]
})
export class PageModule {
}
