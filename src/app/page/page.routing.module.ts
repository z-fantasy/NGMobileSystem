import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./business-page/home/home.component";
import {GuardService} from "../service/guard.service";
import {IndexComponent} from "./business-page/index/index.component";
import {MyWorksComponent} from "./business-page/my-works/my-works.component";
import {MyLogsComponent} from "./business-page/my-logs/my-logs.component";
import {ProgressListComponent} from "./business-page/progress-list/progress-list.component";
import {TaskListComponent} from "./business-page/task-list/task-list.component";
import {ProgressLogsComponent} from "./business-page/progress-logs/progress-logs.component";
import {WorkLogsComponent} from "./business-page/work-logs/work-logs.component";
import {WorkDetailsComponent} from "./business-page/work-details/work-details.component";
import {ProgressDetailsComponent} from "./business-page/progress-details/progress-details.component";
import {AddProgressComponent} from "./business-page/add-progress/add-progress.component";
import {TaskListDetailComponent} from "./business-page/task-list-detail/task-list-detail.component";
import {ReleaseTaskComponent} from "./business-page/release-task/release-task.component";
import {WorkLogDetailsComponent} from "./business-page/work-log-details/work-log-details.component";
import {ProgressLogDetailComponent} from "./business-page/progress-log-detail/progress-log-detail.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardService],
    children: [
      {path: 'index', component: IndexComponent},
      {path: 'myWorks', component: MyWorksComponent},
      {path: 'myLogs', component: MyLogsComponent},
      {path: 'progressList', component: ProgressListComponent},
      {path: 'taskList', component: TaskListComponent},
      {path: 'workLogs', component: WorkLogsComponent},
      {path: 'progressLogs', component: ProgressLogsComponent},
      {path: 'releaseTask', component: ReleaseTaskComponent},
      {path: 'addProgress', component: AddProgressComponent},

      {path: 'workDetails', component: WorkDetailsComponent},
      {path: 'progressDetails', component: ProgressDetailsComponent},
      {path: 'taskListDetail', component: TaskListDetailComponent},
      {path: 'workLogDetails', component: WorkLogDetailsComponent},
      {path: 'progressLogDetail', component: ProgressLogDetailComponent},
      {path: '', redirectTo: '/home/index', pathMatch: 'prefix'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {
}
