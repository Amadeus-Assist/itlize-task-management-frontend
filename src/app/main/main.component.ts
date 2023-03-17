import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuote } from '../shared/interfaces/iquote';
import { AccountService } from '../shared/services/account.service';
import { TaskService } from '../shared/services/task.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  constructor(private accountService: AccountService, private taskService: TaskService, private rtr: Router) { }

  logout() {
    this.accountService.clearCredential();
    localStorage.setItem("TaskManagementUsername", "");
    localStorage.setItem("TaskManagementToken", "");
    this.taskService.clear();
    this.rtr.navigate(["login"]);
  }
}
