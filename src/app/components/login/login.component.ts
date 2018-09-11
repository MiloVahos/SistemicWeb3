import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, share} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  forma: FormGroup;

  showError$: Observable<boolean>;

  email = '';
  password = '';
  error = '';

  constructor(public _authS: AuthService, private router: Router) {

    this.forma = new FormGroup({
      'email':    new FormControl( '', Validators.required ),
      'password': new FormControl( '', Validators.required )
    });

  }

  login() {

    this.email = this.forma.value.email;
    this.password = this.forma.value.password;

    this._authS.loginWithEmail(this.email, this.password)
        .then(() => this.router.navigate(['/']))
        .catch(_error => {
          this.error = _error;
          this.showError$ = timer(200).pipe( map(() => true), share() );
        });

  }

}
