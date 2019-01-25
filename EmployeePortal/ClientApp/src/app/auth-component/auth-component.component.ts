import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UsersService } from '../services/users.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.less']
})
export class AuthComponent implements OnInit, OnDestroy {
  loading = false;

  unsub = new Subject<any>();
  returnUrl: string;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  email = '';
  validationErrorMessage = '';
  validationError = false;
  constructor(private authService: AuthService,
              private userService: UsersService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    this.authService.componentMethodCalled$.subscribe(
      (err) => {
        this.showError(err);
      }
    );
  }

  ngOnInit() {
    this._activatedRoute.queryParams.pipe(takeUntil(this.unsub))
      .subscribe(params => {
        this.returnUrl = params['returnUrl'];
      });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  @HostListener('document:keydown', ['$event'])
  updateModalAnnouncementState(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        this.login(event);
      }
  }

  login(event) {
    this.loading = true;
    this.validationError = false;
    const password = this.passwordFormControl.value;
    const email = this.emailFormControl.value;
    this.authService.login(email, password).subscribe(result => {
      this.userService.loggedInUser = result.userModel;
      if (this.returnUrl) {
        this.authService.setLoginToken(result.idToken, result.expiresIn);
        this._router.navigate([this.returnUrl]);
      } else {
        this.authService.setLoginToken(result.idToken, result.expiresIn);
        this._router.navigate(['../home']);
      }
      this.loading = false;
    }, error => {
      // handle login failure
      this.showError(error);
      this.loading = false;
    });
  }

  showError(err) {
    this.validationError = true;
    if (err.status === 401) {
      this.validationErrorMessage = 'Your username/password combination seems to be wrong. Please try again.';
    }
    else {
      this.validationErrorMessage = 'Something has gone wrong with the magical cloud. Please try again.';
    }
  }
}
