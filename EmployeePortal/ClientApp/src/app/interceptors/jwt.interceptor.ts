import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthService) {}

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this._authService.getLoginToken();
        const cloned = req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + idToken)
        });

        return next.handle(cloned).pipe(tap(event => {}, error => {
            if (error.status === 401) {
                this._authService.logout();
            }
        }));
    }
}
