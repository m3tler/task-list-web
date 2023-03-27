import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  isLoggedIn = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isUserLoggedIn();
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
