import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { AuthService } from '@app/services/auth/auth.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { environment } from '@env/environment';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
  logo = environment.APP_LOGO;
  title = 'Developer | ' + environment.COMPANY_NAME;
  activeTheme = 'light-theme';
  nextTheme = 'dark-theme';

  constructor(
    private router: Router,
    private auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() { }

  @HostListener('window:scroll', [])
  async onWindowScroll() {
    if (document.documentElement.scrollTop > 20) {
      document.getElementById('app_navbar').classList.add('app-navbar-bg');
      document.getElementById('app_navbar').classList.add('app-shadow');
    }
    if (document.documentElement.scrollTop < 20) {
      document.getElementById('app_navbar').classList.remove('app-navbar-bg');
      document.getElementById('app_navbar').classList.remove('app-shadow');
    }
  }

  async changeTheme() {
    const bodyElement = document.body;
    if (bodyElement) {
      this.nextTheme = this.activeTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
      bodyElement.classList.remove(this.activeTheme);
      bodyElement.classList.add(this.nextTheme);
      this.activeTheme = this.nextTheme;
    }
  }
}
