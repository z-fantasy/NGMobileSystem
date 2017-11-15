import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app.routing.module";
import {PageModule} from "./page/page.module";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {CoreModule} from "./core/core.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    PageModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
