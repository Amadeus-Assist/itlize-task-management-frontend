import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../services/account.service";

export const canActivateTasks: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const accountService = inject(AccountService);
      const credential = accountService.getCredential();
      if (credential) {
        return true;
      }
      return false;
    };
