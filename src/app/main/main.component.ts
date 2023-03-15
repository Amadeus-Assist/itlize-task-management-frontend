import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
   constructor(private accountService: AccountService, private rtr: Router){}

   logout() {
    this.accountService.username = "";
    this.accountService.token = "";
    localStorage.setItem("TaskManagementUsername", "");
    localStorage.setItem("TaskManagementToken", "");
    this.rtr.navigate(["login"]);
   }
}
