import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth/auth.service';
import { Router } from '@angular/router';

import { environment } from '@env/environment';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  currentDate: Date = new Date();
  currentUser: any = {};
  isDeveloper = false;
  isPreDeveloper = false;
  logo = environment.APP_LOGO;
  title = 'Developer | ' + environment.COMPANY_NAME;

  isSidebar = false;
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    this.currentUser = this.auth.isLoggedIn();
    this.isDeveloper = this.auth.hasRole('DEVELOPER');
    this.isPreDeveloper = this.auth.hasRole('PREDEVELOPER');
  }

  ngOnInit() { }

  appSidebarToggler() {
    this.isSidebar = !this.isSidebar;
  }
  redirectTo(link) {
    window.open(link, '_blank');
  }
  openApps() {
    this.router.navigate(['/console/developer/applications']);
  }
  logout() {
    this.auth.logout();
    this.currentUser = this.auth.isLoggedIn();
  }
}
