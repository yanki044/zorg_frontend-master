import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component - old.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  valForm: FormGroup;
  errorMessage: string | null = null;

  constructor(public settings: SettingsService, private userService: AuthService, private router: Router, fb: FormBuilder) {
    this.valForm = fb.group({
      'company': [localStorage.getItem('company') || null, Validators.compose([Validators.required])],
      'username': [localStorage.getItem('user') || null, Validators.compose([Validators.required])],
      'password': [null, Validators.required]
    });
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (const c in this.valForm.controls) {
      if (this.valForm.controls.hasOwnProperty(c)) {
        this.valForm.controls[c].markAsTouched();
      }
    }
    if (this.valForm.valid) {
      this.userService.login(value)
        .subscribe(() => {
          localStorage.setItem('company', value.company);
          localStorage.setItem('user', value.username);
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate(['/']);
        }, err => {
          if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
            this.errorMessage = 'Server error';
            return;
          }
          this.errorMessage = 'Invalid username or password';
        });
    }
  }

  ngOnInit() {
  }

}
