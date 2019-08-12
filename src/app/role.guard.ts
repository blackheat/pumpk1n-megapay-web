import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './services/account.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

    constructor(private router: Router, private accountService: AccountService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const expectedRole = route.data.expectedRole;
        const userRole = this.accountService.getUserRole();
        if (!localStorage.getItem('currentUser')) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        let key = false;
        expectedRole.forEach(role => {
            if (role === userRole) {
                key = true;
            }
        });

        if (!key) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;

    }
}
