import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../services/account.service";

export const canActivateTasks: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const accountService = inject(AccountService);
      if (accountService.username && accountService.token) {
        return true;
      }
      accountService.username = localStorage.getItem("TaskManagementUsername");
      accountService.token = localStorage.getItem("TaskManagementToken");
      console.log("retrieve token from local storage");
      if (accountService.username && accountService.token) {
        return true;
      }
      inject(Router).navigate(["login"]);
      return false;
    };
