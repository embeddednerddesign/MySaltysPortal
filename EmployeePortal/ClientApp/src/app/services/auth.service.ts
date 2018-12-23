import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { take } from 'rxjs/operator/take';
import { from } from 'rxjs/observable/from';
import { isNullOrUndefined } from 'util';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { User } from '../models/user';


@Injectable()
export class AuthService {
  loggedIn = false;

  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(private _router: Router, private http: HttpClient)  {
  }

  login(email, password) {
    return this.http.post<{idToken: string, expiresIn: number, userModel: User}>(environment.baseUrl + 'api/auth', {email: email, password: password});
  }

  logout() {
    this.clearLoginTokens();
    this._router.navigate(['login']);
  }
  clearLoginTokens() {
    sessionStorage.removeItem('login_token');
    sessionStorage.removeItem('login_token_expires_at');
  }
  getLoginToken() {
    return sessionStorage.getItem('login_token');
  }
  setLoginToken(loginToken, expiresIn) {
    const expiresAt = moment().add(expiresIn, 'days');
    sessionStorage.setItem('login_token', loginToken);
    sessionStorage.setItem('login_token_expires_at', JSON.stringify(expiresAt.valueOf()));
  }
  getLoginTokenExpiration() {
    const expiration = sessionStorage.getItem('login_token_expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getEmail() {
    const jwtToken = this.getLoginToken();
    if (jwtToken) {
      const parsed = this.parseJwt(jwtToken);
      return parsed.email;
    }
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  isAuthenticated(): boolean {
    const isbefore = moment().isBefore(this.getLoginTokenExpiration());
    return isbefore;
  }
}
