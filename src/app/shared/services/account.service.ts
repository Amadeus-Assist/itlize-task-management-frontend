import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ILoginResponse } from '../interfaces/ilogin-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  username: string;
  token: string;

  constructor(private http: HttpClient) { }

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

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);
    body.set("grant_type", "password");
    return this.http.post<ILoginResponse>("api/token", body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
}
