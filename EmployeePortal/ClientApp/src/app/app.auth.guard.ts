import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _authService: AuthService,
        private router: Router,
        private currentActivatedRoute: ActivatedRoute,
        private location: Location) { }
    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot) {
        if (!this._authService.isAuthenticated()) {
            const current = this.currentActivatedRoute;
            const path = this.location.path();
            if (path === '') {
                this.router.navigate(['login']);
            } else {
                this.router.navigate(['login'], { queryParams: { returnUrl: path } });
            }
            return false;
        }
        return true;
    }
}
