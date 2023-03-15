import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { DetailComponent } from './detail/detail.component';
import { MainComponent } from './main/main.component';
import { NgbModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { ErrorComponent } from './error/error.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TasksComponent,
    DetailComponent,
    MainComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbAlertModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [NgbModule]
})
export class AppModule { }
