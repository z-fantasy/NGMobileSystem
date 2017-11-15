import {NgModule, Optional, SkipSelf} from '@angular/core';
import {ShareModule} from "../shared/share.module";
import {LoginComponent} from "../page/util-page/login/login.component";
import {RegisterComponent} from "../page/util-page/register/register.component";
import {ForgetComponent} from "../page/util-page/forget/forget.component";
import {NotfindComponent} from "../page/util-page/notfind/notfind.component";

@NgModule({
  imports: [
    ShareModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    NotfindComponent,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    NotfindComponent,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule
  ) {
    if (parent) {
      throw new Error('模块已经存在，不需要再次加载!');
    }
  }
}
