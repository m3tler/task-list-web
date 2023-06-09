import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage = 'Invalid Credentials';
  successMessage: string = '';
  invalidLogin = false;
  loginSuccess = false;

  constructor(private authService: AuthService, private router: Router) { }

  handleLogin() {
    this.authService.authenticationService(this.username, this.password).subscribe(result => {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMessage = 'Login Successful.';
      this.router.navigate(['tasks']);
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });
  }
}
