import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ILoginResponse } from '../interfaces/ilogin-response';
import { map } from 'rxjs/operators'
import { ICredential } from '../interfaces/icredential';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  credential: ICredential;

  constructor(private http: HttpClient, private rtr: Router) { }

  register(username: string, password: string, confirmPassword: string) {
    return this.http.post("api/Account/Register", {
      "Email": username,
      "Password": password,
      "ConfirmPassword": confirmPassword,
      "Role": "user"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getCredential() {
    if (!this.credential) {
      const username = localStorage.getItem("TaskManagementUsername");
      const token = localStorage.getItem("TaskManagementToken");
      if (!username || !token) {
        this.rtr.navigate(["login"]);
        return null;
      }
      this.credential = {
        username: username,
        token: token
      }
    }
    return this.credential;
  }

  clearCredential() {
    this.credential = null;
  }

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);
    body.set("grant_type", "password");
    return this.http.post<ILoginResponse>("api/token", body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(map(resp => {
      localStorage.setItem("TaskManagementUsername", resp.userName);
      localStorage.setItem("TaskManagementToken", `${resp.token_type} ${resp.access_token}`);
      this.credential = {
        username: resp.userName,
        token: `${resp.token_type} ${resp.access_token}`
      };
      return resp;
    }));
  }
}
