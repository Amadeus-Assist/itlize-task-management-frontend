import { Component, ViewChild } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private accountService: AccountService, private rtr: Router) { }
  activeId: string = "login";
  alertMessage: string = "";
  alertType: string = "";

  loginUsername: string = "";
  loginPassword: string = "";

  registerUsername: string = "";
  registerPassword: string = "";
  conRegisterPassword: string = "";

  usernameInvalidMsg = "";
  passwordInvalidMsg = "";
  confirmPasswordInvalidMsg = "";

  // @ViewChild('registerAlert', { static: false }) registerAlert: NgbAlert;

  login() {
    this.accountService.login(this.loginUsername, this.loginPassword).subscribe({
      next: resp => {
        localStorage.setItem("TaskManagementUsername", resp.userName);
        localStorage.setItem("TaskManagementToken", `${resp.token_type} ${resp.access_token}`);
        this.accountService.username = resp.userName;
        this.accountService.token = `${resp.token_type} ${resp.access_token}`;
        this.rtr.navigate(["tasks"]);
      },
      error: err => {
        console.log(err);
        if (err.status === 400) {
          this.alertMessage = "Invalid username or password";
          this.alertType = "warning";
          this.loginUsername = "";
          this.loginPassword = "";
          setTimeout(() => this.alertMessage = "", 3000);
        }else {
          this.rtr.navigate(["error"]);
        }
      }
    })
  }

  register() {
    this.accountService.register(this.registerUsername, this.registerPassword, this.conRegisterPassword)
      .subscribe({
        next: resp => {
          this.loginUsername = this.registerUsername;
          this.loginPassword = this.registerPassword;
          this.usernameInvalidMsg = "";
          this.passwordInvalidMsg = "";
          this.confirmPasswordInvalidMsg = "";
          this.alertMessage = "Register successfully!"
          this.alertType = "success;"
          this.activeId = "login";
          setTimeout(() => this.alertMessage = "", 2000);
        },
        error: err => {
          if (err.status === 400) {
            let newAlertMsg: Array<string> = [];
            if (err["error"]?.["Message"]) {
              newAlertMsg.push(err["error"]?.["Message"]);
            }
            if (err["error"]?.["ModelState"]) {
              const modelState = err["error"]["ModelState"];
              this.usernameInvalidMsg = modelState["model.Email"] ? modelState["model.Email"].join(" | ") : "";
              this.passwordInvalidMsg = modelState["model.Password"] ? modelState["model.Password"].join(" | ") : "";
              this.confirmPasswordInvalidMsg = modelState["model.ConfirmPassword"] ? modelState["model.ConfirmPassword"].join(" | ") : "";
              for (let [k, v] of Object.entries<Array<string>>(modelState)) {
                if (k !== "model.Email" && k !== "model.Password" && k !== "model.ConfirmPassword") {
                  newAlertMsg.push(...v);
                }
              }
            }

            this.alertMessage = newAlertMsg.length === 0 ? "invalid request" : newAlertMsg.join(" | ");
            this.alertType = "danger";
            this.registerUsername = "";
            this.registerPassword = "";
            this.conRegisterPassword = "";
          } else {
            this.rtr.navigate(["error"]);
          }
        }
      })
  }
}
