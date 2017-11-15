import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./page/util-page/login/login.component";
import {NotfindComponent} from "./page/util-page/notfind/notfind.component";
import {RegisterComponent} from "./page/util-page/register/register.component";
import {LeaveLoginService} from "./service/leave-login.service";
import {ForgetComponent} from "./page/util-page/forget/forget.component";


const routes: Routes = [
  {path: 'login', component: LoginComponent, canDeactivate: [LeaveLoginService]},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot', component: ForgetComponent},
  {path: '', redirectTo: '/home/index', pathMatch: 'full'},
  {path: '**', component: NotfindComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
